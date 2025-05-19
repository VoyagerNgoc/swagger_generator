import { NextResponse } from "next/server"

export async function GET() {
  // Determine which AI provider is being used based on environment variables
  const provider = process.env.ANTHROPIC_API_KEY ? "anthropic" : "openai"

  // Get the specific model being used
  const model = provider === "anthropic" ? "Claude 3 Sonnet" : "GPT-4o"

  return NextResponse.json({
    provider,
    model,
  })
}
