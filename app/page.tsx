"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { enhancePrompt, generateSwaggerAPI, sendSwaggerToN8n, generateCodeWithCodeGen } from "./actions"
import { Loader2, CheckCircle, Edit, Save, Download, Send, RefreshCw, Upload } from "lucide-react"
import SuggestionLabels from "@/components/suggestion-labels"
import { ThemeToggle } from "@/components/theme-toggle"
import { useToast } from "@/hooks/use-toast"
import SwaggerDisplay from "@/components/swagger-display"
import CodeGenJobTracker from "@/components/codegen-job-tracker"
import FrameworkSelector from "@/components/framework-selector"
import SwaggerUploader from "@/components/swagger-uploader"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Home() {
  const [userPrompt, setUserPrompt] = useState("")
  const [enhancedPrompt, setEnhancedPrompt] = useState("")
  const [swaggerSpec, setSwaggerSpec] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingSwagger, setIsGeneratingSwagger] = useState(false)
  const [isSendingToN8n, setIsSendingToN8n] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editedPrompt, setEditedPrompt] = useState("")
  const [showPromptInput, setShowPromptInput] = useState(true)
  const [aiProvider, setAiProvider] = useState<{ provider: string; model: string } | null>(null)
  const { toast } = useToast()
  const [isSubmittingToCodeGen, setIsSubmittingToCodeGen] = useState(false)
  const [codeGenJobIds, setCodeGenJobIds] = useState<{ backend?: string; frontend?: string } | null>(null)
  const [backendFramework, setBackendFramework] = useState("Ruby on Rails")
  const [frontendFramework, setFrontendFramework] = useState("Next.js")
  const [database, setDatabase] = useState("postgresql")
  const [backendRepo, setBackendRepo] = useState("")
  const [frontendRepo, setFrontendRepo] = useState("")
  const [hasSubmittedToCodeGen, setHasSubmittedToCodeGen] = useState(false)
  const [swaggerMode, setSwaggerMode] = useState<"generate" | "upload">("generate")
  const [generateBackend, setGenerateBackend] = useState(true)
  const [generateFrontend, setGenerateFrontend] = useState(true)
  const [includeDocker, setIncludeDocker] = useState(true)

  useEffect(() => {
    // Check which AI provider is being used
    fetch("/api/ai-provider")
      .then((res) => res.json())
      .then((data) => {
        setAiProvider(data)
      })
      .catch((err) => {
        console.error("Error fetching AI provider:", err)
      })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userPrompt.trim()) return

    setIsLoading(true)
    try {
      const enhanced = await enhancePrompt(userPrompt)
      setEnhancedPrompt(enhanced)
      setEditedPrompt(enhanced)
      setShowPromptInput(false)
      toast({
        variant: "success",
        title: "Success",
        description: "Prompt enhanced successfully",
      })
    } catch (error) {
      console.error("Error enhancing prompt:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while enhancing your prompt",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateSwagger = async () => {
    setIsGeneratingSwagger(true)

    try {
      const swagger = await generateSwaggerAPI(enhancedPrompt)
      setSwaggerSpec(swagger)
      toast({
        variant: "success",
        title: "Success",
        description: "Swagger API specification generated successfully",
      })
    } catch (error) {
      console.error("Error generating Swagger API:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "An error occurred while generating the Swagger API specification",
      })
    } finally {
      setIsGeneratingSwagger(false)
    }
  }

  const handleSendToN8n = async () => {
    setIsSendingToN8n(true)

    try {
      const result = await sendSwaggerToN8n(swaggerSpec)

      if (result.success) {
        toast({
          variant: "success",
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        })
      }
    } catch (error) {
      console.error("Error sending Swagger to n8n:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while sending the Swagger to n8n",
      })
    } finally {
      setIsSendingToN8n(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleSaveEdit = async () => {
    setEnhancedPrompt(editedPrompt)
    setIsEditing(false)
    toast({
      variant: "info",
      title: "Info",
      description: "Changes saved, generating Swagger...",
    })

    // Automatically generate Swagger after saving edits
    await handleGenerateSwagger()
  }

  const handleSuggestionClick = (suggestion: string) => {
    setUserPrompt(suggestion)
    toast({
      variant: "info",
      title: "Info",
      description: "Suggestion applied",
    })
  }

  const handleDownloadSwagger = () => {
    const blob = new Blob([swaggerSpec], { type: "text/yaml;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "swagger-api-spec.yaml"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      variant: "success",
      title: "Success",
      description: "Swagger specification downloaded",
    })
  }

  const handleReset = () => {
    setUserPrompt("")
    setEnhancedPrompt("")
    setSwaggerSpec("")
    setShowPromptInput(true)
    setIsEditing(false)
    setCodeGenJobIds(null)
    setHasSubmittedToCodeGen(false)
    setBackendFramework("Ruby on Rails")
    setFrontendFramework("Next.js")
    setDatabase("postgresql")
    setBackendRepo("")
    setFrontendRepo("")
    setSwaggerMode("generate")
    setGenerateBackend(true)
    setGenerateFrontend(true)
    setIncludeDocker(true)
    setIncludeDocker(true)
  }

  const handleSubmitToCodeGen = async () => {
    setIsSubmittingToCodeGen(true)
    setHasSubmittedToCodeGen(true)

    try {
      const result = await generateCodeWithCodeGen(swaggerSpec, {
        backend: backendFramework,
        frontend: frontendFramework,
        database: database,
        backendRepo: backendRepo,
        frontendRepo: frontendRepo,
        generateBackend,
        generateFrontend,
        includeDocker,
      })

      if (result.success) {
        setCodeGenJobIds({
          backend: result.backendJobId,
          frontend: result.frontendJobId,
        })
        toast({
          variant: "success",
          title: "Success",
          description: result.message,
        })
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.message,
        })
        setHasSubmittedToCodeGen(false)
      }
    } catch (error) {
      console.error("Error submitting to CodeGen API:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "An error occurred while submitting to CodeGen API",
      })
      setHasSubmittedToCodeGen(false)
    } finally {
      setIsSubmittingToCodeGen(false)
    }
  }

  const handleSwaggerLoaded = (swagger: string) => {
    setSwaggerSpec(swagger)
    setShowPromptInput(false)
  }

  return (
    <div className="min-h-screen bg-gradient-blue">
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      <main className="container mx-auto py-12 px-4 max-w-6xl relative z-0">
        <h1 className="text-4xl font-bold mb-2 text-center text-white drop-shadow-md">Voyager Generator AI</h1>
        {aiProvider && <p className="text-center text-white/80 text-sm mb-8">Powered by Voyager INC</p>}

        {/* CodeGen Job Status - Show at top after submission */}
        {codeGenJobIds && (
          <CodeGenJobTracker
            backendJobId={codeGenJobIds.backend}
            frontendJobId={codeGenJobIds.frontend}
            backendFramework={backendFramework}
            frontendFramework={frontendFramework}
            database={database}
          />
        )}

        {showPromptInput && !enhancedPrompt && !swaggerSpec && (
          <Tabs
            defaultValue="generate"
            value={swaggerMode}
            onValueChange={(value) => setSwaggerMode(value as "generate" | "upload")}
          >
            <TabsList className="grid w-full grid-cols-2 mb-4 max-w-md mx-auto">
              <TabsTrigger value="generate" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Generate Swagger
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Upload Swagger
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <Card className="mb-8 shadow-lg border-none bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Enter Your Prompt</CardTitle>
                  <CardDescription>
                    Please describe your request (the more clearly you specify the features, the better)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <Textarea
                      placeholder="Enter your prompt here..."
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      className="min-h-[120px] mb-4 bg-white dark:bg-gray-800"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !userPrompt.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        "Send"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload">
              <SwaggerUploader onSwaggerLoaded={handleSwaggerLoaded} />
            </TabsContent>
          </Tabs>
        )}

        {enhancedPrompt && !isEditing && !swaggerSpec && (
          <Card className="mb-8 shadow-lg border-none bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Enhanced Code Prompt</CardTitle>
              <CardDescription>Review the AI-enhanced version of your code prompt</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-gray-50 rounded-md border dark:bg-gray-800/80" style={{ whiteSpace: "pre-wrap" }}>
                {enhancedPrompt}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between gap-2">
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEdit} disabled={isGeneratingSwagger}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  onClick={handleGenerateSwagger}
                  className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
                  disabled={isGeneratingSwagger}
                >
                  {isGeneratingSwagger ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating Swagger...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Generate Swagger API
                    </>
                  )}
                </Button>
              </div>
            </CardFooter>
          </Card>
        )}

        {isEditing && (
          <Card className="mb-8 shadow-lg border-none bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Edit Enhanced Prompt</CardTitle>
              <CardDescription>Make any changes to the enhanced prompt</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={editedPrompt}
                onChange={(e) => setEditedPrompt(e.target.value)}
                className="min-h-[150px] bg-white dark:bg-gray-800"
              />
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleReset}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Start Over
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white"
              >
                <Save className="mr-2 h-4 w-4" />
                Save & Generate Swagger
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Framework Selection - Show after Swagger is generated */}
        {swaggerSpec && !hasSubmittedToCodeGen && (
          <FrameworkSelector
            backendFramework={backendFramework}
            frontendFramework={frontendFramework}
            database={database}
            backendRepo={backendRepo}
            frontendRepo={frontendRepo}
            generateBackend={generateBackend}
            generateFrontend={generateFrontend}
            includeDocker={includeDocker}
            onBackendChange={setBackendFramework}
            onFrontendChange={setFrontendFramework}
            onDatabaseChange={setDatabase}
            onBackendRepoChange={setBackendRepo}
            onFrontendRepoChange={setFrontendRepo}
            onGenerateBackendChange={setGenerateBackend}
            onGenerateFrontendChange={setGenerateFrontend}
            onIncludeDockerChange={setIncludeDocker}
            onSubmit={handleSubmitToCodeGen}
            isSubmitting={isSubmittingToCodeGen}
            disabled={hasSubmittedToCodeGen}
          />
        )}

        {swaggerSpec && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white drop-shadow-sm">
                {swaggerMode === "upload" ? "Uploaded" : "Generated"} Swagger API Specification
              </h2>
              <div className="flex flex-wrap gap-2 items-center">
                {/* Hidden n8n button - keeping the function for potential future use */}
                {false && (
                  <Button
                    onClick={handleSendToN8n}
                    disabled={isSendingToN8n}
                    className="bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white font-medium px-5 py-2 shadow-md"
                  >
                    {isSendingToN8n ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-5 w-5" />
                        Send to n8n
                      </>
                    )}
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={handleDownloadSwagger}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/20"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Start Over
                </Button>
              </div>
            </div>
            <SwaggerDisplay yamlContent={swaggerSpec} />
          </div>
        )}

        {!swaggerSpec && !enhancedPrompt && (
          <div className="mt-4 mb-8">
            <p className="text-center text-sm text-white mb-2 drop-shadow-sm">Try one of these suggestions:</p>
            <SuggestionLabels onSuggestionClick={handleSuggestionClick} />
          </div>
        )}

        {(isLoading || isGeneratingSwagger || isSubmittingToCodeGen) && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50 backdrop-blur-sm">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl flex flex-col items-center">
              <Loader2 className="h-12 w-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
              <p className="text-lg font-medium">
                {isLoading
                  ? "Enhancing your prompt..."
                  : isGeneratingSwagger
                    ? "Generating Swagger API..."
                    : "Submitting to CodeGen API..."}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                Using {aiProvider?.provider === "anthropic" ? "Anthropic" : "OpenAI"} {aiProvider?.model || ""} to{" "}
                {isLoading
                  ? "improve your prompt"
                  : isGeneratingSwagger
                    ? "create your API specification"
                    : "submit your request to CodeGen"}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}