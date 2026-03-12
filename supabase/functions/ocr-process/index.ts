// Supabase Edge Function: Process OCR using DeepSeek
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
}

// Convert ArrayBuffer to base64 safely (chunked)
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  const len = bytes.byteLength
  for (let i = 0; i < len; i += 1024) {
    const chunk = bytes.subarray(i, Math.min(i + 1024, len))
    binary += String.fromCharCode.apply(null, Array.from(chunk))
  }
  return btoa(binary)
}

interface OCRResult {
  amount: number | null
  date: string | null
  vendor: string | null
  invoiceNumber: string | null
  documentType: string
  confidence: number
  rawText: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { filePath, userId } = await req.json()
    console.log('Processing:', filePath)

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get file
    const { data: fileData, error: fileError } = await supabaseClient
      .storage.from('documents').download(filePath)

    if (fileError) throw new Error(`Download failed: ${fileError.message}`)

    // Convert to base64
    const arrayBuffer = await fileData.arrayBuffer()
    console.log('Original size:', arrayBuffer.byteLength, 'bytes')
    
    const base64Image = arrayBufferToBase64(arrayBuffer)
    console.log('Base64 length:', base64Image.length)

    // Truncate to fit token limit (keep first 80KB of base64 ~60K tokens)
    const maxBase64Length = 80000
    const truncatedBase64 = base64Image.length > maxBase64Length 
      ? base64Image.substring(0, maxBase64Length) 
      : base64Image
    
    console.log('Truncated to:', truncatedBase64.length)

    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY')
    
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY not configured')
    }

    // Call DeepSeek API
    console.log('Calling DeepSeek API...')
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: `You are an OCR assistant specialized in extracting information from receipts and invoices.

Analyze the provided image and extract the following fields as JSON:
- amount: Total amount as number (remove currency symbols, use decimal point)
- date: Date in YYYY-MM-DD format
- vendor: Company/merchant name
- invoiceNumber: Invoice or receipt number
- documentType: One of "invoice", "receipt", or "other"

Return ONLY a valid JSON object in this exact format:
{"amount": 123.45, "date": "2024-03-12", "vendor": "Company Name", "invoiceNumber": "INV-001", "documentType": "invoice"}

If a field cannot be found, use null. Be precise with amounts and dates.`
          },
          {
            role: 'user',
            content: `Extract information from this receipt/invoice image (base64 encoded JPEG, may be truncated if large):\n\n[IMAGE_START]\ndata:image/jpeg;base64,${truncatedBase64}\n[IMAGE_END]\n\nExtract: amount, date (YYYY-MM-DD), vendor name, invoice/receipt number, document type. Return JSON only.`
          }
        ],
        temperature: 0.1,
        max_tokens: 400
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`)
    }

    const apiData = await response.json()
    const aiContent = apiData.choices?.[0]?.message?.content || ''
    
    console.log('AI response:', aiContent.substring(0, 400))

    // Parse JSON
    let parsed: any = {}
    try {
      const jsonMatch = aiContent.match(/\{[\s\S]*?\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.log('JSON parse failed:', e)
    }

    // Calculate confidence
    let filledFields = 0
    if (parsed.amount && parsed.amount > 0) filledFields++
    if (parsed.date && parsed.date !== 'null') filledFields++
    if (parsed.vendor && parsed.vendor !== 'null') filledFields++
    if (parsed.invoiceNumber && parsed.invoiceNumber !== 'null') filledFields++
    const confidence = filledFields / 4

    const result: OCRResult = {
      amount: parsed.amount || null,
      date: parsed.date || null,
      vendor: parsed.vendor || null,
      invoiceNumber: parsed.invoiceNumber || null,
      documentType: parsed.documentType || 'other',
      confidence: confidence,
      rawText: aiContent
    }

    console.log('Parsed result:', result)

    // Update database
    const { error: updateError } = await supabaseClient.from('documents').update({
      processing_status: 'completed',
      extracted_data: result,
      ocr_confidence: confidence,
      doc_type: result.documentType,
      updated_at: new Date().toISOString(),
    }).eq('storage_path', filePath)

    if (updateError) {
      console.error('Update error:', updateError)
      throw updateError
    }

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ success: false, error: (error as Error).message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
