// Supabase Edge Function: Process OCR using DeepSeek
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
}

// Resize image to reduce token usage
async function resizeImage(buffer: ArrayBuffer, maxWidth: number = 800): Promise<string> {
  // For now, just truncate base64 to reduce tokens
  // In production, use sharp or similar library
  const bytes = new Uint8Array(buffer)
  
  // Skip bytes to reduce size (every 2nd byte for 50% reduction)
  const sampledBytes = new Uint8Array(Math.floor(bytes.length / 2))
  for (let i = 0; i < sampledBytes.length; i++) {
    sampledBytes[i] = bytes[i * 2]
  }
  
  // Convert to base64
  let binary = ''
  for (let i = 0; i < sampledBytes.length; i++) {
    binary += String.fromCharCode(sampledBytes[i])
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

    // Resize and convert to base64 (reduced size for token limit)
    const arrayBuffer = await fileData.arrayBuffer()
    console.log('Original size:', arrayBuffer.byteLength, 'bytes')
    
    const base64Image = await resizeImage(arrayBuffer, 800)
    console.log('Resized base64 length:', base64Image.length)

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
            content: `Extract invoice/receipt data as JSON: {amount: number, date: "YYYY-MM-DD", vendor: string, invoiceNumber: string, documentType: "invoice|receipt|other"}. Return JSON only.`
          },
          {
            role: 'user',
            content: `Extract from this receipt image:\ndata:image/jpeg;base64,${base64Image}`
          }
        ],
        temperature: 0.1,
        max_tokens: 300
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`)
    }

    const apiData = await response.json()
    const aiContent = apiData.choices?.[0]?.message?.content || ''
    
    console.log('AI response:', aiContent.substring(0, 200))

    // Parse JSON
    let parsed: any = {}
    try {
      const jsonMatch = aiContent.match(/\{[^}]+\}/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0])
      }
    } catch (e) {
      console.log('JSON parse failed:', e)
    }

    // Calculate confidence
    let filledFields = 0
    if (parsed.amount) filledFields++
    if (parsed.date) filledFields++
    if (parsed.vendor) filledFields++
    if (parsed.invoiceNumber) filledFields++
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
