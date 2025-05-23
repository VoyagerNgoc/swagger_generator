"use server"

import { OpenAI } from "openai"
import { Anthropic } from "@anthropic-ai/sdk"

export async function enhancePrompt(userPrompt: string): Promise<string> {
  // Check which API keys are available
  const openAiKey = process.env.OPENAI_API_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY

  if (!openAiKey && !anthropicKey) {
    throw new Error(
      "No AI provider API key is configured. Please add either ANTHROPIC_API_KEY or OPENAI_API_KEY environment variable.",
    )
  }

  try {
    // Use Anthropic if the API key is available, otherwise use OpenAI
    if (anthropicKey) {
      console.log("Using Anthropic for prompt enhancement")

      const anthropic = new Anthropic({
        apiKey: anthropicKey,
      })

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        temperature: 0.7,
        system: "You are an expert prompt engineer specializing in code generation prompts.",
        messages: [
          {
            role: "user",
            content: `Your task is to enhance and improve the following user prompt to make it more detailed, specific, and effective for generating high-quality source code.

Original prompt: "${userPrompt}"

Provide an enhanced version of this prompt that:
1. Adds more specific technical details and context
2. Clarifies any ambiguous parts related to the code requirements
3. Structures the prompt in a clear way that will lead to better code generation
4. Includes any relevant constraints, patterns, or best practices to follow
5. Specifies language, framework, or library preferences if they were implied

Return ONLY the enhanced prompt without any explanations, introductions, or additional text.`,
          },
        ],
      })

      return response.content[0].text.trim()
    } else if (openAiKey) {
      console.log("Using OpenAI for prompt enhancement")

      const openai = new OpenAI({
        apiKey: openAiKey,
      })

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.7,
        max_tokens: 1000,
        messages: [
          {
            role: "system",
            content: "You are an expert prompt engineer specializing in code generation prompts.",
          },
          {
            role: "user",
            content: `Your task is to enhance and improve the following user prompt to make it more detailed, specific, and effective for generating high-quality source code.

Original prompt: "${userPrompt}"

Provide an enhanced version of this prompt that:
1. Adds more specific technical details and context
2. Clarifies any ambiguous parts related to the code requirements
3. Structures the prompt in a clear way that will lead to better code generation
4. Includes any relevant constraints, patterns, or best practices to follow
5. Specifies language, framework, or library preferences if they were implied

Return ONLY the enhanced prompt without any explanations, introductions, or additional text.`,
          },
        ],
      })

      return response.choices[0].message.content?.trim() || ""
    } else {
      // This should never happen due to the check above, but just in case
      throw new Error("No AI provider API key is configured")
    }
  } catch (error) {
    console.error("Error in enhancePrompt:", error)
    throw new Error(`Failed to enhance prompt: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

export async function generateSwaggerAPI(enhancedPrompt: string): Promise<string> {
  // Check which API keys are available
  const openAiKey = process.env.OPENAI_API_KEY
  const anthropicKey = process.env.ANTHROPIC_API_KEY

  if (!openAiKey && !anthropicKey) {
    throw new Error(
      "No AI provider API key is configured. Please add either ANTHROPIC_API_KEY or OPENAI_API_KEY environment variable.",
    )
  }

  try {
    // Use Anthropic if the API key is available, otherwise use OpenAI
    if (anthropicKey) {
      console.log("Using Anthropic for Swagger generation")

      const anthropic = new Anthropic({
        apiKey: anthropicKey,
      })

      const response = await anthropic.messages.create({
        model: "claude-3-haiku-20240307",
        max_tokens: 4096,
        temperature: 0.5,
        system: `You are an expert API designer specializing in OpenAPI (Swagger) 3.0 specifications.
Your task is to create syntactically perfect OpenAPI 3.0 YAML specifications.
Follow these strict rules:
1. NEVER include markdown code block markers like \`\`\`yaml or \`\`\` in your response
2. Start directly with the OpenAPI specification (openapi: 3.0.0)
3. Ensure all YAML is properly indented and syntactically correct
4. Use only valid OpenAPI 3.0 syntax
5. Include proper schema definitions for all data models
6. Define clear request and response objects
7. Include appropriate examples for requests and responses
8. Use proper data types (string, integer, boolean, etc.)
9. Ensure all references are valid
10. Include proper error responses (400, 401, 403, 404, 500)`,
        messages: [
          {
            role: "user",
            content: `Based on the following requirements, create a comprehensive OpenAPI (Swagger) 3.0 specification in YAML format.

Requirements:
${enhancedPrompt}

Your task:
1. Analyze the requirements thoroughly
2. Identify all the key features and functionality needed
3. Determine what API endpoints would be required
4. Create a complete OpenAPI 3.0 specification in YAML format that includes:
   - Appropriate paths and operations
   - Request parameters and bodies with proper schemas
   - Response schemas and examples
   - Clear descriptions for all components
   - Proper error responses
   - Authentication requirements if applicable

IMPORTANT:
- Do NOT include any markdown formatting or code block markers
- Start directly with 'openapi: 3.0.0'
- Ensure all YAML is properly indented and syntactically correct
- Use only valid OpenAPI 3.0 syntax
- Include proper schema definitions for all data models
- Define clear request and response objects
- Include appropriate examples for requests and responses
- Use proper data types (string, integer, boolean, etc.)
- Ensure all references are valid
- Include proper error responses (400, 401, 403, 404, 500)

Return ONLY the OpenAPI specification in YAML format, without any explanations, markdown formatting, or additional text.`,
          },
        ],
      })

      // Clean the response to remove any markdown code block markers
      let swaggerSpec = response.content[0].text.trim()
      swaggerSpec = cleanSwaggerResponse(swaggerSpec)

      return swaggerSpec
    } else if (openAiKey) {
      console.log("Using OpenAI for Swagger generation")

      const openai = new OpenAI({
        apiKey: openAiKey,
      })

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        temperature: 0.2,
        max_tokens: 4000,
        messages: [
          {
            role: "system",
            content: `You are an expert API designer specializing in OpenAPI (Swagger) 3.0 specifications.
Your task is to create syntactically perfect OpenAPI 3.0 YAML specifications.
Follow these strict rules:
1. NEVER include markdown code block markers like \`\`\`yaml or \`\`\` in your response
2. Start directly with the OpenAPI specification (openapi: 3.0.0)
3. Ensure all YAML is properly indented and syntactically correct
4. Use only valid OpenAPI 3.0 syntax
5. Include proper schema definitions for all data models
6. Define clear request and response objects
7. Include appropriate examples for requests and responses
8. Use proper data types (string, integer, boolean, etc.)
9. Ensure all references are valid
10. Include proper error responses (400, 401, 403, 404, 500)`,
          },
          {
            role: "user",
            content: `Based on the following requirements, create a comprehensive OpenAPI (Swagger) 3.0 specification in YAML format.

Requirements:
${enhancedPrompt}

Your task:
1. Analyze the requirements thoroughly
2. Identify all the key features and functionality needed
3. Determine what API endpoints would be required
4. Create a complete OpenAPI 3.0 specification in YAML format that includes:
   - Appropriate paths and operations
   - Request parameters and bodies with proper schemas
   - Response schemas and examples
   - Clear descriptions for all components
   - Proper error responses
   - Authentication requirements if applicable

IMPORTANT:
- Do NOT include any markdown formatting or code block markers
- Start directly with 'openapi: 3.0.0'
- Ensure all YAML is properly indented and syntactically correct
- Use only valid OpenAPI 3.0 syntax
- Include proper schema definitions for all data models
- Define clear request and response objects
- Include appropriate examples for requests and responses
- Use proper data types (string, integer, boolean, etc.)
- Ensure all references are valid
- Include proper error responses (400, 401, 403, 404, 500)

Return ONLY the OpenAPI specification in YAML format, without any explanations, markdown formatting, or additional text.`,
          },
        ],
      })

      // Clean the response to remove any markdown code block markers
      let swaggerSpec = response.choices[0].message.content?.trim() || ""
      swaggerSpec = cleanSwaggerResponse(swaggerSpec)

      return swaggerSpec
    } else {
      // This should never happen due to the check above, but just in case
      throw new Error("No AI provider API key is configured")
    }
  } catch (error) {
    console.error("Error in generateSwaggerAPI:", error)
    throw new Error(`Failed to generate Swagger API: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// Helper function to clean Swagger response
function cleanSwaggerResponse(response: string): string {
  // Remove markdown code block markers if present
  let cleaned = response.replace(/^```yaml\s*/i, "").replace(/```\s*$/i, "")

  // Ensure the response starts with openapi: 3.0.0
  if (!cleaned.trim().startsWith("openapi:")) {
    // If it doesn't start with openapi, try to find where the actual spec starts
    const match = cleaned.match(/openapi:\s*3\.0\.0/i)
    if (match && match.index !== undefined) {
      cleaned = cleaned.substring(match.index)
    }
  }

  return cleaned
}

export async function sendSwaggerToN8n(swaggerSpec: string): Promise<{ success: boolean; message: string }> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL
  const webhookToken = process.env.N8N_WEBHOOK_TOKEN

  if (!webhookUrl) {
    throw new Error("N8N webhook URL is not configured. Please add N8N_WEBHOOK_URL environment variable.")
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(webhookToken ? { Authorization: `Bearer ${webhookToken}` } : {}),
      },
      body: JSON.stringify({
        swaggerSpec,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Webhook responded with status: ${response.status}. Details: ${errorText}`)
    }

    return {
      success: true,
      message: "Swagger specification successfully sent to n8n",
    }
  } catch (error) {
    console.error("Error sending Swagger to n8n:", error)
    return {
      success: false,
      message: `Failed to send Swagger to n8n: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}
