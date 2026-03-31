import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

export async function POST(req: NextRequest) {
  try {
    const { prompt, homeCityState, roomNames } = await req.json()

    if (!prompt?.trim()) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }

    const client = new Anthropic()

    const roomContext = roomNames?.length > 0
      ? `The home has these rooms: ${roomNames.join(', ')}.`
      : 'No rooms have been added yet.'

    const systemPrompt = `You are an expert home renovation cost estimator for the Homagio platform.
The user has a home located in ${homeCityState}.
${roomContext}

Your job is to generate a detailed, realistic budget breakdown based on what the user describes.
Use current market rates for ${homeCityState} — adjust for local cost of living.
Break every project into specific line items (materials, labor, permits separately when significant).
Always include a contingency line item of 10-15% for unexpected costs.

You MUST respond with ONLY a valid JSON array. No markdown, no explanation, no text before or after.
Each item in the array must have exactly these fields:
- project_name: string (specific and descriptive)
- room_name: string (matching one of the home's rooms, or "General / Site Work" for exterior/whole-home items)
- estimated_low: number (in dollars, realistic low estimate)
- estimated_high: number (in dollars, realistic high estimate)
- notes: string (1 sentence explaining what's included)
- status: "planning"`

    const message = await client.messages.create({
      model: 'claude-opus-4-5',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''

    // Parse and validate JSON
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)

    if (!Array.isArray(parsed)) throw new Error('Response was not a JSON array')

    return NextResponse.json({ items: parsed })
  } catch (err: any) {
    console.error('AI budget route error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to generate budget' },
      { status: 500 }
    )
  }
}