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

      // Updated to use the correct model name
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
        temperature: 0.2, // Lower temperature for more precise output
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

export interface CodeGenJob {
  id: string
  status: "pending" | "running" | "completed" | "failed"
  type: "backend" | "frontend"
  createdAt: string
  completedAt?: string
  pullRequestUrl?: string
  repositoryUrl?: string
  error?: string
  progress?: number
}

export async function generateCodeWithCodeGen(swaggerSpec: string): Promise<{
  success: boolean
  message: string
  backendJobId?: string
  frontendJobId?: string
}> {
  const apiKey = process.env.CODEGEN_API_KEY
  const orgId = process.env.CODEGEN_ORG_ID

  if (!apiKey) {
    throw new Error("CodeGen API key is not configured. Please add CODEGEN_API_KEY environment variable.")
  }

  if (!orgId) {
    throw new Error("CodeGen Org ID is not configured. Please add CODEGEN_ORG_ID environment variable.")
  }

  try {
    // Call the backend generation API
    const backendPrompt = "Generate a basic Node.js Express API with a GET /health endpoint."

    const backendResponse = await fetch(`https://api.codegen.com/v1/organizations/${orgId}/agent/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: backendPrompt,
      }),
    })

    if (!backendResponse.ok) {
      const errorText = await backendResponse.text()
      throw new Error(`Backend generation API responded with status: ${backendResponse.status}. Details: ${errorText}`)
    }

    const backendData = await backendResponse.json()
    const backendJobId = backendData.jobId || backendData.id || backendData.runId || "unknown"

    // Call the frontend generation API
    const frontendPrompt = `Generate a complete, professional-grade NuxtJS front-end application based on the Swagger specification provided below. The application should include fully functional UI pages for all available API endpoints, using modern design best practices (e.g., responsive layout, clean UI/UX, reusable components, modular structure) and setup dockerFile, docker-compose. Please include full routing, state management (e.g., Pinia), and API integration logic using axios or composables. Use Tailwind CSS for styling. This is swagger document:
${swaggerSpec}`

    const frontendResponse = await fetch(`https://api.codegen.com/v1/organizations/${orgId}/agent/run`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: frontendPrompt,
      }),
    })

    if (!frontendResponse.ok) {
      const errorText = await frontendResponse.text()
      throw new Error(
        `Frontend generation API responded with status: ${frontendResponse.status}. Details: ${errorText}`,
      )
    }

    const frontendData = await frontendResponse.json()
    const frontendJobId = frontendData.jobId || frontendData.id || frontendData.runId || "unknown"

    return {
      success: true,
      message: "Code generation jobs submitted successfully to CodeGen API",
      backendJobId,
      frontendJobId,
    }
  } catch (error) {
    console.error("Error submitting to CodeGen API:", error)
    return {
      success: false,
      message: `Failed to submit to CodeGen API: ${error instanceof Error ? error.message : "Unknown error"}`,
    }
  }
}

export async function checkCodeGenJobStatus(jobId: string): Promise<CodeGenJob | null> {
  const apiKey = process.env.CODEGEN_API_KEY
  const orgId = process.env.CODEGEN_ORG_ID

  if (!apiKey) {
    throw new Error("CodeGen API key is not configured.")
  }

  if (!orgId) {
    throw new Error("CodeGen Org ID is not configured.")
  }

  try {
    const response = await fetch(`https://api.codegen.com/v1/organizations/${orgId}/agent/runs/${jobId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return null
      }
      const errorText = await response.text()
      throw new Error(`Job status API responded with status: ${response.status}. Details: ${errorText}`)
    }

    const data = await response.json()

    // Map the API response to our CodeGenJob interface
    return {
      id: jobId,
      status: mapApiStatusToJobStatus(data.status),
      type: data.type || "backend", // Default to backend if not specified
      createdAt: data.createdAt || data.created_at || new Date().toISOString(),
      completedAt: data.completedAt || data.completed_at,
      pullRequestUrl: data.pullRequestUrl || data.pull_request_url || data.pr_url,
      repositoryUrl: data.repositoryUrl || data.repository_url || data.repo_url,
      error: data.error || data.errorMessage,
      progress: data.progress || (data.status === "completed" ? 100 : data.status === "running" ? 50 : 0),
    }
  } catch (error) {
    console.error("Error checking job status:", error)
    throw new Error(`Failed to check job status: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

function mapApiStatusToJobStatus(apiStatus: string): "pending" | "running" | "completed" | "failed" {
  switch (apiStatus?.toLowerCase()) {
    case "pending":
    case "queued":
    case "waiting":
      return "pending"
    case "running":
    case "in_progress":
    case "processing":
      return "running"
    case "completed":
    case "success":
    case "finished":
    case "done":
      return "completed"
    case "failed":
    case "error":
    case "cancelled":
      return "failed"
    default:
      return "pending"
  }
}
