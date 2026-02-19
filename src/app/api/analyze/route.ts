import { NextRequest, NextResponse } from 'next/server'
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai'

interface AnalysisResponse {
  series: string
  character: string
  jpKeywords: string
  reasoning: string
}

interface ErrorResponse {
  error: string
  details?: string
}

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(
  process.env.GOOGLE_GENERATIVE_AI_API_KEY || ''
)

const SYSTEM_PROMPT = `You are a Japanese vintage toy expert specializing in anime merchandise. Your task is to analyze images of anime characters and collectibles.

For any provided image, identify:
1. The anime/manga series it belongs to
2. The specific character depicted
3. The type of merchandise (e.g., strap, acrylic stand, figure, card, etc.)
4. The approximate year/era if discernible

Provide the most effective Japanese search keywords used by collectors on Mercari and other Japanese auction sites. These keywords should be specific, authentic, and commonly used.

If the image is blurry, heavily obscured, or does not contain anime-related content, respond with an error message indicating the issue.

You must respond in valid JSON format only.`

const VALIDATION_PROMPT = `Analyze this image and determine:
1. Is this an anime-related image? (yes/no)
2. Is the image clear enough to identify details? (yes/no)
3. Brief reason for your assessment

Respond in valid JSON format: {"isAnime": boolean, "isClear": boolean, "reason": string}`

async function validateImage(
  base64Image: string,
  mimeType: string
): Promise<{ isValid: boolean; reason: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const response = await model.generateContent([
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
        },
      },
      VALIDATION_PROMPT,
    ])

    const text = response.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)

    if (!jsonMatch) {
      return {
        isValid: false,
        reason: 'Could not parse image validation response',
      }
    }

    const validation = JSON.parse(jsonMatch[0])

    if (!validation.isAnime) {
      return {
        isValid: false,
        reason: 'Image does not appear to contain anime-related content',
      }
    }

    if (!validation.isClear) {
      return {
        isValid: false,
        reason: 'Image is too blurry or unclear to analyze accurately',
      }
    }

    return { isValid: true, reason: 'Image validation passed' }
  } catch (error) {
    return {
      isValid: false,
      reason: `Image validation error: ${error instanceof Error ? error.message : 'Unknown error'}`,
    }
  }
}

async function analyzeImage(
  base64Image: string,
  mimeType: string
): Promise<AnalysisResponse> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  })

  const analysisPrompt = `Analyze this anime character/merchandise image and provide:
1. series: The name of the anime/manga series
2. character: The specific character's name
3. jpKeywords: Comma-separated Japanese search keywords used on Mercari (be specific with product type and year if visible)
4. reasoning: Brief explanation of your analysis

Return ONLY valid JSON in this exact format:
{
  "series": "string",
  "character": "string",
  "jpKeywords": "string",
  "reasoning": "string"
}`

  const response = await model.generateContent([
    {
      inlineData: {
        data: base64Image,
        mimeType: mimeType as 'image/jpeg' | 'image/png' | 'image/gif' | 'image/webp',
      },
    },
    analysisPrompt,
  ])

  const text = response.response.text()

  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('Could not parse analysis response as JSON')
  }

  const result = JSON.parse(jsonMatch[0]) as AnalysisResponse

  // Validate required fields
  if (!result.series || !result.character || !result.jpKeywords) {
    throw new Error('Analysis response missing required fields')
  }

  return result
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<AnalysisResponse | ErrorResponse>> {
  try {
    // Check for API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return NextResponse.json(
        {
          error: 'API configuration error',
          details: 'Google Generative AI API key is not configured',
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { image, mimeType } = body

    // Validate input
    if (!image) {
      return NextResponse.json(
        { error: 'No image provided', details: 'Image data is required' },
        { status: 400 }
      )
    }

    if (typeof image !== 'string') {
      return NextResponse.json(
        {
          error: 'Invalid image format',
          details: 'Image must be a base64 encoded string',
        },
        { status: 400 }
      )
    }

    const imageMimeType = mimeType || 'image/jpeg'

    // Validate image is anime-related and clear
    const validation = await validateImage(image, imageMimeType)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Image validation failed', details: validation.reason },
        { status: 400 }
      )
    }

    // Analyze the image
    const analysis = await analyzeImage(image, imageMimeType)

    return NextResponse.json(analysis, { status: 200 })
  } catch (error) {
    console.error('Error analyzing image:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Handle specific Gemini API errors
    if (errorMessage.includes('blocked')) {
      return NextResponse.json(
        {
          error: 'Content policy violation',
          details: 'The image content violates safety policies',
        },
        { status: 400 }
      )
    }

    if (errorMessage.includes('Could not parse')) {
      return NextResponse.json(
        {
          error: 'Analysis parsing error',
          details: 'Could not parse the image analysis response',
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        error: 'Image analysis failed',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
