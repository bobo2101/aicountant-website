// Supabase Edge Function: Process OCR using DeepSeek (Cost-effective alternative)
// Supports: DeepSeek, Google Vision, or local fallback

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OCRResult {
  amount: number | null
  date: string | null
  vendor: string | null
  invoiceNumber: string | null
  documentType: 'invoice' | 'receipt' | 'bank_statement' | 'contract' | 'tax' | 'other'
  confidence: number
  rawText: string
}

// Configuration - Set these in Supabase Secrets
const getConfig = () => ({
  // Primary: DeepSeek (cheapest)
  DEEPSEEK_API_KEY: Deno.env.get('DEEPSEEK_API_KEY'),
  DEEPSEEK_API_URL: 'https://api.deepseek.com/v1/chat/completions',
  
  // Fallback: Google Vision (if DeepSeek fails)
  GOOGLE_VISION_API_KEY: Deno.env.get('GOOGLE_VISION_API_KEY'),
  
  // Cost tracking
  ENABLE_COST_TRACKING: Deno.env.get('ENABLE_COST_TRACKING') === 'true',
})

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const config = getConfig()
  const startTime = Date.now()

  try {
    const { filePath, userId } = await req.json()

    if (!filePath || !userId) {
      throw new Error('Missing filePath or userId')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get file from Storage
    const { data: fileData, error: fileError } = await supabaseClient
      .storage
      .from('documents')
      .download(filePath)

    if (fileError) throw new Error(`Download failed: ${fileError.message}`)

    // Convert to base64
    const arrayBuffer = await fileData.arrayBuffer()
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    const mimeType = filePath.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'

    let ocrResult: OCRResult
    let provider = ''
    let cost = 0

    // Try DeepSeek first (cheapest)
    if (config.DEEPSEEK_API_KEY) {
      try {
        const result = await processWithDeepSeek(base64Image, mimeType, config)
        ocrResult = result
        provider = 'deepseek'
        cost = calculateDeepSeekCost(result.rawText)
      } catch (deepseekError) {
        console.log('DeepSeek failed, trying Google Vision:', deepseekError)
        
        // Fallback to Google Vision
        if (config.GOOGLE_VISION_API_KEY) {
          const result = await processWithGoogleVision(base64Image, config)
          ocrResult = result
          provider = 'google'
          cost = 0.0015 // $1.50 per 1000 = $0.0015 per request
        } else {
          throw deepseekError
        }
      }
    } else if (config.GOOGLE_VISION_API_KEY) {
      // Use Google Vision directly
      const result = await processWithGoogleVision(base64Image, config)
      ocrResult = result
      provider = 'google'
      cost = 0.0015
    } else {
      // No AI configured - use basic pattern matching
      ocrResult = await processWithBasicOCR(base64Image, supabaseClient)
      provider = 'basic'
      cost = 0
    }

    // Update document with OCR results
    await updateDocument(supabaseClient, filePath, ocrResult, provider, cost)

    // Log cost if tracking enabled
    if (config.ENABLE_COST_TRACKING) {
      await logOCRUsage(supabaseClient, userId, provider, cost, Date.now() - startTime)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        result: ocrResult,
        provider,
        cost: cost.toFixed(4),
        processingTime: Date.now() - startTime
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('OCR Processing error:', error)
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Process with DeepSeek V3 (Cheapest option)
async function processWithDeepSeek(
  base64Image: string, 
  mimeType: string,
  config: any
): Promise<OCRResult> {
  
  const response = await fetch(config.DEEPSEEK_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一個專業的財務文檔分析助手。請分析這張圖片並提取關鍵信息。

請以 JSON 格式返回以下欄位：
{
  "amount": 發票總金額（數字，不含貨幣符號）,
  "date": 發票日期（格式：YYYY-MM-DD）,
  "vendor": 供應商/公司名稱（字符串）,
  "invoiceNumber": 發票編號（字符串）,
  "documentType": 文檔類型（invoice/receipt/bank_statement/contract/tax/other）,
  "rawText": 你識別到的所有原始文字（用於驗證）
}

documentType 判斷標準：
- invoice: 有「發票」「Invoice」「INV」字樣，有金額和編號
- receipt: 有「收據」「Receipt」字樣，金額較小
- bank_statement: 有「銀行」「Bank Statement」「對帳單」
- contract: 有「合同」「合約」「Contract」字樣
- tax: 有「稅」「Tax」字樣
- other: 無法判斷

如果某個欄位無法識別，設為 null。` 
        },
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`
              }
            }
          ]
        }
      ],
      temperature: 0.1, // Low temperature for consistent results
      max_tokens: 1000,
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`DeepSeek API error: ${error}`)
  }

  const data = await response.json()
  const content = data.choices[0]?.message?.content || ''
  
  // Parse JSON from response
  let parsed: any
  try {
    // Try to extract JSON from markdown code block
    const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || 
                      content.match(/```\n?([\s\S]*?)\n?```/) ||
                      content.match(/{[\s\S]*}/)
    
    const jsonStr = jsonMatch ? jsonMatch[1] || jsonMatch[0] : content
    parsed = JSON.parse(jsonStr)
  } catch {
    // Fallback: treat entire content as raw text
    parsed = {
      amount: null,
      date: null,
      vendor: null,
      invoiceNumber: null,
      documentType: 'other',
      rawText: content
    }
  }

  return {
    amount: parsed.amount ? parseFloat(parsed.amount) : null,
    date: parsed.date || null,
    vendor: parsed.vendor || null,
    invoiceNumber: parsed.invoiceNumber || null,
    documentType: parsed.documentType || 'other',
    confidence: calculateConfidence(parsed),
    rawText: parsed.rawText || content
  }
}

// Process with Google Vision (Fallback)
async function processWithGoogleVision(
  base64Image: string,
  config: any
): Promise<OCRResult> {
  
  const response = await fetch(
    `https://vision.googleapis.com/v1/images:annotate?key=${config.GOOGLE_VISION_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: base64Image },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION', maxResults: 1 }]
        }]
      }),
    }
  )

  if (!response.ok) {
    const error = await response.json()
    throw new Error(`Vision API error: ${JSON.stringify(error)}`)
  }

  const data = await response.json()
  const text = data.responses[0]?.textAnnotations?.[0]?.description || ''
  
  return parseTextWithHeuristics(text)
}

// Basic OCR without AI (Free but limited)
async function processWithBasicOCR(
  base64Image: string,
  supabase: any
): Promise<OCRResult> {
  // For now, return empty result
  // In production, you could use Tesseract.js or similar
  return {
    amount: null,
    date: null,
    vendor: null,
    invoiceNumber: null,
    documentType: 'other',
    confidence: 0,
    rawText: 'Basic OCR not implemented - please configure DeepSeek or Google Vision API'
  }
}

// Parse text using regex heuristics
function parseTextWithHeuristics(text: string): OCRResult {
  const lines = text.split('\n')
  
  // Amount patterns
  const amountMatch = text.match(/(?:總計|Total|Amount|金額).*?[$\$]?\s*([\d,]+\.?\d*)/i) ||
                      text.match(/[$\$]\s*([\d,]+\.?\d*)\s*(?:HKD|HK\$)?/)
  
  // Date patterns
  const dateMatch = text.match(/(\d{4}[/-]\d{1,2}[/-]\d{1,2})/) ||
                    text.match(/(\d{1,2}[/-]\d{1,2}[/-]\d{4})/)
  
  // Invoice number
  const invMatch = text.match(/(?:發票編號|Invoice\s*(?:No|Number|#)\.?\s*)[:\s]*([A-Z0-9\-]+)/i)
  
  // Vendor
  let vendor = null
  for (const line of lines.slice(0, 10)) {
    if (line.match(/(Ltd|Limited|公司|Inc|Co\.|Limited)/i)) {
      vendor = line.trim()
      break
    }
  }
  
  // Document type classification
  let docType: OCRResult['documentType'] = 'other'
  const lowerText = text.toLowerCase()
  if (lowerText.includes('發票') || lowerText.includes('invoice')) {
    docType = 'invoice'
  } else if (lowerText.includes('收據') || lowerText.includes('receipt')) {
    docType = 'receipt'
  } else if (lowerText.includes('銀行') || lowerText.includes('bank statement')) {
    docType = 'bank_statement'
  } else if (lowerText.includes('合同') || lowerText.includes('contract')) {
    docType = 'contract'
  } else if (lowerText.includes('稅') || lowerText.includes('tax')) {
    docType = 'tax'
  }
  
  const extracted: OCRResult = {
    amount: amountMatch ? parseFloat(amountMatch[1].replace(/,/g, '')) : null,
    date: dateMatch ? normalizeDate(dateMatch[1]) : null,
    vendor,
    invoiceNumber: invMatch ? invMatch[1] : null,
    documentType: docType,
    confidence: 0,
    rawText: text
  }
  
  extracted.confidence = calculateConfidence(extracted)
  
  return extracted
}

// Calculate confidence score
function calculateConfidence(result: any): number {
  let score = 0
  if (result.amount) score += 30
  if (result.date) score += 25
  if (result.vendor) score += 25
  if (result.invoiceNumber) score += 20
  return Math.min(score, 100)
}

// Calculate DeepSeek cost (approximate)
function calculateDeepSeekCost(text: string): number {
  // DeepSeek: ~¥2 / 1M tokens
  // Approximate: 1000 tokens per request average
  // Cost: ~¥0.002 = ~$0.0003 USD per request
  const estimatedTokens = Math.ceil(text.length / 4) + 500 // input + output
  return (estimatedTokens / 1000000) * 0.3 // Convert to USD (~$0.30 per 1M tokens)
}

// Normalize date
function normalizeDate(dateStr: string): string {
  const clean = dateStr.replace(/,/g, '')
  const date = new Date(clean)
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0]
  }
  return dateStr
}

// Update document in database
async function updateDocument(
  supabase: any,
  filePath: string,
  result: OCRResult,
  provider: string,
  cost: number
) {
  const { error } = await supabase
    .from('documents')
    .update({
      processing_status: 'completed',
      extracted_data: result,
      ocr_confidence: result.confidence,
      doc_type: result.documentType,
      processing_provider: provider,
      processing_cost: cost,
      updated_at: new Date().toISOString(),
    })
    .eq('storage_path', filePath)

  if (error) throw error
}

// Log usage for cost tracking
async function logOCRUsage(
  supabase: any,
  userId: string,
  provider: string,
  cost: number,
  processingTime: number
) {
  await supabase.from('ocr_usage_logs').insert({
    user_id: userId,
    provider,
    cost,
    processing_time_ms: processingTime,
    created_at: new Date().toISOString(),
  })
}
