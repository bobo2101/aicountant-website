// Supabase Edge Function: Process OCR using Google Vision API
// This function is triggered when a new document is uploaded

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
  confidence: number
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get environment variables
    const GOOGLE_VISION_API_KEY = Deno.env.get('GOOGLE_VISION_API_KEY')
    
    if (!GOOGLE_VISION_API_KEY) {
      throw new Error('GOOGLE_VISION_API_KEY not set')
    }

    // Parse request body
    const { filePath, userId } = await req.json()

    if (!filePath || !userId) {
      throw new Error('Missing filePath or userId')
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get the file from Supabase Storage
    const { data: fileData, error: fileError } = await supabaseClient
      .storage
      .from('documents')
      .download(filePath)

    if (fileError) {
      throw new Error(`Failed to download file: ${fileError.message}`)
    }

    // Convert to base64
    const arrayBuffer = await fileData.arrayBuffer()
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

    // Call Google Vision API
    const visionResponse = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'DOCUMENT_TEXT_DETECTION',
                  maxResults: 1,
                },
              ],
            },
          ],
        }),
      }
    )

    if (!visionResponse.ok) {
      const errorData = await visionResponse.json()
      throw new Error(`Vision API error: ${JSON.stringify(errorData)}`)
    }

    const visionData = await visionResponse.json()
    const textAnnotations = visionData.responses[0]?.textAnnotations

    if (!textAnnotations || textAnnotations.length === 0) {
      // No text found
      await updateDocumentWithOCR(supabaseClient, filePath, null, 'no_text')
      return new Response(
        JSON.stringify({ success: true, result: null, message: 'No text found in image' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract full text
    const fullText = textAnnotations[0].description

    // Parse the text to extract structured data
    const ocrResult = parseInvoiceText(fullText)

    // Update document with OCR results
    await updateDocumentWithOCR(supabaseClient, filePath, ocrResult, 'completed')

    return new Response(
      JSON.stringify({ success: true, result: ocrResult }),
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

// Parse invoice text to extract structured data
function parseInvoiceText(text: string): OCRResult {
  const lines = text.split('\n')
  
  let amount: number | null = null
  let date: string | null = null
  let vendor: string | null = null
  let invoiceNumber: string | null = null
  let confidence = 0

  // Extract amount (look for $, HK$, 總計, Total, etc.)
  const amountPatterns = [
    /(?:總計|Total|Amount|金額).*?[$\$]?\s*([\d,]+\.?\d*)/i,
    /[$\$]\s*([\d,]+\.?\d*)\s*(?:HKD|HK\$)?/,
    /([\d,]+\.?\d*)\s*(?:HKD|HK\$| dollars)/i,
  ]

  for (const pattern of amountPatterns) {
    const match = text.match(pattern)
    if (match) {
      amount = parseFloat(match[1].replace(/,/g, ''))
      confidence += 30
      break
    }
  }

  // Extract date (look for common date formats)
  const datePatterns = [
    /(\d{4}[/-]\d{1,2}[/-]\d{1,2})/,
    /(\d{1,2}[/-]\d{1,2}[/-]\d{4})/,
    /(\d{1,2}\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{4})/i,
    /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i,
  ]

  for (const pattern of datePatterns) {
    const match = text.match(pattern)
    if (match) {
      date = normalizeDate(match[1])
      confidence += 25
      break
    }
  }

  // Extract invoice number
  const invoicePatterns = [
    /(?:發票編號|Invoice\s*(?:No|Number|#)\.?\s*)[:\s]*([A-Z0-9\-]+)/i,
    /(?:INV| Invoice)[\s\-]*(\d+)/i,
  ]

  for (const pattern of invoicePatterns) {
    const match = text.match(pattern)
    if (match) {
      invoiceNumber = match[1]
      confidence += 20
      break
    }
  }

  // Extract vendor (usually in the first few lines or contains "Ltd", "Limited", "公司")
  for (const line of lines.slice(0, 10)) {
    const trimmed = line.trim()
    if (trimmed.length > 2 && 
        (trimmed.includes('Ltd') || 
         trimmed.includes('Limited') || 
         trimmed.includes('公司') ||
         trimmed.includes('Inc') ||
         trimmed.includes('Co.')) &&
        !trimmed.toLowerCase().includes('total') &&
        !trimmed.toLowerCase().includes('invoice')) {
      vendor = trimmed
      confidence += 25
      break
    }
  }

  // If no vendor found, try first non-empty line
  if (!vendor) {
    for (const line of lines) {
      const trimmed = line.trim()
      if (trimmed.length > 2 && !trimmed.match(/^\d/)) {
        vendor = trimmed
        confidence += 10
        break
      }
    }
  }

  return {
    amount,
    date,
    vendor,
    invoiceNumber,
    confidence: Math.min(confidence, 100),
  }
}

// Normalize date to ISO format
function normalizeDate(dateStr: string): string {
  // Try to parse various date formats
  const cleanDate = dateStr.replace(/,/g, '')
  
  // Try standard parsing
  const date = new Date(cleanDate)
  if (!isNaN(date.getTime())) {
    return date.toISOString().split('T')[0]
  }
  
  // If parsing fails, return as-is
  return dateStr
}

// Update document record with OCR results
async function updateDocumentWithOCR(
  supabase: any,
  filePath: string,
  ocrResult: OCRResult | null,
  status: string
) {
  const { error } = await supabase
    .from('documents')
    .update({
      processing_status: status,
      extracted_data: ocrResult,
      ocr_confidence: ocrResult?.confidence || 0,
      updated_at: new Date().toISOString(),
    })
    .eq('storage_path', filePath)

  if (error) {
    console.error('Failed to update document:', error)
    throw error
  }
}
