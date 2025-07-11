"use server"

import { OpenAI } from "openai"
import { Anthropic } from "@anthropic-ai/sdk"
import { BASE_PROMPTS, FRAMEWORK_CONFIGS, DATABASE_OPTIONS, type FrameworkOptions, type CodeGenJob } from "@/lib/constants"

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
    // Use OpenAI first if available, then fallback to Anthropic
    if (openAiKey) {
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
    } else if (anthropicKey) {
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
    } else {
      // This should never happen due to the check above, but just in case
      throw new Error("No AI provider API key is configured")
    }
  } catch (error) {
    console.error("Error in enhancePrompt:", error)
    
    // If it's an Anthropic API error and we have OpenAI as fallback, try OpenAI
    if (error instanceof Error && error.message.includes("403") && anthropicKey && openAiKey) {
      console.log("Anthropic API failed, falling back to OpenAI")
      try {
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
      } catch (fallbackError) {
        console.error("OpenAI fallback also failed:", fallbackError)
        throw new Error(`Both AI providers failed. Anthropic: ${error.message}. OpenAI: ${fallbackError instanceof Error ? fallbackError.message : "Unknown error"}`)
      }
    }
    
    // Provide more specific error messages
    if (error instanceof Error && error.message.includes("403")) {
      throw new Error(`API access denied (403). Please check your API key permissions and ensure it's valid. Original error: ${error.message}`)
    }
    
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
    // Use OpenAI first if available, then fallback to Anthropic
    if (openAiKey) {
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
    } else if (anthropicKey) {
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
    } else {
      // This should never happen due to the check above, but just in case
      throw new Error("No AI provider API key is configured")
    }
  } catch (error) {
    console.error("Error in generateSwaggerAPI:", error)
    
    // If it's an Anthropic API error and we have OpenAI as fallback, try OpenAI
    if (error instanceof Error && error.message.includes("403") && anthropicKey && openAiKey) {
      console.log("Anthropic API failed, falling back to OpenAI for Swagger generation")
      try {
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

        let swaggerSpec = response.choices[0].message.content?.trim() || ""
        swaggerSpec = cleanSwaggerResponse(swaggerSpec)
        return swaggerSpec
      } catch (fallbackError) {
        console.error("OpenAI fallback also failed:", fallbackError)
        throw new Error(`Both AI providers failed. Anthropic: ${error.message}. OpenAI: ${fallbackError instanceof Error ? fallbackError.message : "Unknown error"}`)
      }
    }
    
    // Provide more specific error messages
    if (error instanceof Error && error.message.includes("403")) {
      throw new Error(`API access denied (403). Please check your API key permissions and ensure it's valid. Original error: ${error.message}`)
    }
    
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

function generatePrompt(
  type: "backend" | "frontend",
  framework: string,
  swaggerSpec: string,
  database?: string,
  repository?: string,
  includeDocker: boolean = true,
): string {
  // Special handling for Laravel frameworks
  if (framework === "PHP Laravel 11" || framework === "PHP Laravel 12") {
    const databaseName = database === "postgresql" ? "PostgreSQL" : 
                        database === "mysql" ? "MySQL 8.0+" :
                        database === "mariadb" ? "MariaDB" :
                        database === "sqlite" ? "SQLite" : "MySQL 8.0+"
    
    const laravelVersion = framework === "PHP Laravel 11" ? "11" : "12"
    
    if (includeDocker) {
      // Original Docker prompt
      return `In the repository ${repository}, please implement fully functional Laravel ${laravelVersion} PHP RESTful API backend based on the provided Swagger documentation with new branch and new pull-request.

1. Update rule: This is an implement new feature — do not overwrite current Dockerfile, docker-compose if not need (IMPORTANT).
2. Manual step required:  run migrations and generate key manually after container is running.
3. Scope:
    - Laravel ${laravelVersion} API-only project
    - Swagger-based API endpoints and documents
    - Fully dockerized:
        - PHP 8.3+ FPM
        - ${databaseName}
        - Composer
    - No Nginx needed for development
    - Use php artisan serve --host=0.0.0.0 --port=9000 for dev server
4. Health check route: /api/ping returns { "status": "ok" }
5. README.md must include:
    - How to run with docker-compose up -d --build
    - Manual step after container is running:
        - Run php artisan migrate --force
        - Run generate key
        - Run seed
    - How to run tests
    - Expected API endpoints
6. Success criteria:
    - docker-compose up --build runs successfully, app available at http://localhost:9000/
    - No manual steps except migrations
    - vendor/autoload.php exists
    - .env is set
    - /api/ping works
    - No errors
    - No migration duplication/conflict
    - All Swagger-defined endpoints are implemented

This is swagger documents:
${swaggerSpec}

repo: ${repository}`
    } else {
      // Non-Docker prompt
      return `Please implement a fully functional Laravel ${laravelVersion} PHP RESTful API backend in the repository ${repository} based on the provided Swagger documentation, using a new branch and creating a new pull request.

Requirements Important Note (DO NOT CREATE DOCKER FILES): This task is to implement a new feature. Do not create Dockerfile, docker-compose.yml, or any Docker-related setup unless absolutely necessary. It must run on local environment.

Scope:

Laravel ${laravelVersion} API-only project Implement all API endpoints and documentation based on Swagger Project must run correctly in: PHP 8.3+ FPM ${databaseName} Composer No Nginx required for development Health Check Route: /api/ping returns { "status": "ok" }

README.md must include: How to run Manual post-start steps:

Run migrations

Generate app key

Run seeders

How to run tests

Description of all implemented API endpoints

Success Criteria: App is accessible at http://localhost:9000/ Only manual steps are migrations/key/seed

vendor/autoload.php exists

.env is set correctly

/api/ping returns correct response

No migration conflicts or duplications

All Swagger-documented endpoints are fully implemented

This is swagger documents:
${swaggerSpec}

repo: ${repository}`
    }
  }

  const config = FRAMEWORK_CONFIGS[type][framework]
  const basePrompt = BASE_PROMPTS[type]

  if (!config) {
    throw new Error(`Unsupported ${type} framework: ${framework}`)
  }

  const repositoryInstruction = repository
    ? `

REPOSITORY CONFIGURATION:
- Target repository: ${repository}
- Create a pull request to this repository with all the generated code
- Follow the repository's existing structure and conventions if any
- Include proper commit messages and PR description
- Ensure all files are properly organized in the repository structure`
    : ""

  // Database configuration for backend
  let databaseInstruction = ""
  if (type === "backend" && database && config.databases) {
    const selectedDb = DATABASE_OPTIONS.find(db => db.value === database)
    const dbConfig = config.databases[database]
    
    if (selectedDb && dbConfig) {
      databaseInstruction = `

DATABASE CONFIGURATION:
- Database System: ${selectedDb.label} (${selectedDb.description})
- Integration: ${dbConfig}
- Database Features: ${selectedDb.features.join(", ")}
- Ensure proper database connection configuration
- Include database migrations and schema setup
- Implement proper connection pooling and error handling
- Add database health checks and monitoring
- Include proper indexing strategies for performance
- Implement database backup and recovery procedures`
    }
  }

  const featuresText = config.features.length > 0 ? `\n- ${config.features.join("\n- ")}` : ""

  const prompt = `${basePrompt.prefix} ${config.name} ${basePrompt.suffix(includeDocker)}

FRAMEWORK-SPECIFIC FEATURES:${featuresText}${databaseInstruction}${repositoryInstruction}

SWAGGER SPECIFICATION:
${swaggerSpec}`

  // Add repository name at the end
  if (repository) {
    return `${prompt}

repo: ${repository}`
  }

  return prompt
}

export async function generateCodeWithCodeGen(
  swaggerSpec: string,
  frameworks: FrameworkOptions,
): Promise<{
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
    let backendJobId: string | undefined
    let frontendJobId: string | undefined

    // Generate backend if requested
    if (frameworks.generateBackend) {
      const backendPrompt = generatePrompt("backend", frameworks.backend, swaggerSpec, frameworks.database, frameworks.backendRepo, frameworks.includeDocker)

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
      backendJobId = backendData.jobId || backendData.id || backendData.runId || "unknown"
    }

    // Generate frontend if requested
    if (frameworks.generateFrontend) {
      const frontendPrompt = generatePrompt("frontend", frameworks.frontend, swaggerSpec, undefined, frameworks.frontendRepo, frameworks.includeDocker)

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
      frontendJobId = frontendData.jobId || frontendData.id || frontendData.runId || "unknown"
    }

    const generatedTypes = []
    if (frameworks.generateBackend) generatedTypes.push("backend")
    if (frameworks.generateFrontend) generatedTypes.push("frontend")
    
    return {
      success: true,
      message: `${generatedTypes.join(" and ")} code generation job${generatedTypes.length > 1 ? 's' : ''} submitted successfully to CodeGen API`,
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

function mapApiStatusToJobStatus(apiStatus: string): "loading_processing" | "running" | "completed" | "failed" {
  switch (apiStatus?.toLowerCase()) {
    case "pending":
    case "queued":
    case "waiting":
      return "loading_processing"
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
      return "loading_processing"
  }
}