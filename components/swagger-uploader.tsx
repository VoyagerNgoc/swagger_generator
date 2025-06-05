"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, AlertTriangle, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SwaggerUploaderProps {
  onSwaggerLoaded: (swagger: string) => void
}

export default function SwaggerUploader({ onSwaggerLoaded }: SwaggerUploaderProps) {
  const [activeTab, setActiveTab] = useState<"file" | "paste">("file")
  const [dragActive, setDragActive] = useState(false)
  const [pastedContent, setPastedContent] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const validateSwagger = (content: string): boolean => {
    if (!content.trim().startsWith("openapi:") && !content.trim().startsWith("swagger:")) {
      setValidationError("The content doesn't appear to be a valid OpenAPI/Swagger specification.")
      return false
    }

    setValidationError(null)
    return true
  }

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFileUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileUpload = async (file: File) => {
    setIsLoading(true)

    try {
      // Check if file is YAML or JSON
      if (!file.name.endsWith(".yaml") && !file.name.endsWith(".yml") && !file.name.endsWith(".json")) {
        setValidationError("Please upload a YAML or JSON file (.yaml, .yml, or .json)")
        setIsLoading(false)
        return
      }

      const content = await file.text()
      setFileName(file.name)
      setFileContent(content)

      if (validateSwagger(content)) {
        onSwaggerLoaded(content)
        toast({
          variant: "success",
          title: "Success",
          description: `Swagger specification loaded from ${file.name}`,
        })
      }
    } catch (error) {
      console.error("Error reading file:", error)
      setValidationError("Error reading file. Please try again.")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to read the uploaded file",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0])
    }
  }

  const handlePasteSubmit = () => {
    if (!pastedContent.trim()) {
      setValidationError("Please paste some content first")
      return
    }

    if (validateSwagger(pastedContent)) {
      onSwaggerLoaded(pastedContent)
      toast({
        variant: "success",
        title: "Success",
        description: "Swagger specification loaded from pasted content",
      })
    }
  }

  return (
    <Card className="shadow-lg border-none bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Upload Existing Swagger
        </CardTitle>
        <CardDescription>Upload or paste your existing Swagger/OpenAPI specification</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="file" value={activeTab} onValueChange={(value) => setActiveTab(value as "file" | "paste")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="file">Upload File</TabsTrigger>
            <TabsTrigger value="paste">Paste Content</TabsTrigger>
          </TabsList>

          <TabsContent value="file" className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-primary bg-primary/10"
                  : "border-gray-300 dark:border-gray-600 hover:border-primary/50"
              }`}
              onDragOver={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setDragActive(true)
              }}
              onDragLeave={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setDragActive(false)
              }}
              onDrop={handleFileDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".yaml,.yml,.json"
                className="hidden"
                onChange={handleFileInputChange}
              />
              <div className="flex flex-col items-center justify-center space-y-3 cursor-pointer">
                <Upload className="h-10 w-10 text-gray-400" />
                <p className="text-lg font-medium">
                  {isLoading ? "Loading..." : "Drag & drop your Swagger file or click to browse"}
                </p>
                <p className="text-sm text-muted-foreground">Supports YAML (.yaml, .yml) and JSON (.json) files</p>
              </div>
            </div>

            {fileName && fileContent && !validationError && (
              <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-900 rounded-md">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium">File loaded: {fileName}</span>
              </div>
            )}
          </TabsContent>

          <TabsContent value="paste" className="space-y-4">
            <Textarea
              placeholder="Paste your Swagger/OpenAPI specification here..."
              value={pastedContent}
              onChange={(e) => setPastedContent(e.target.value)}
              className="min-h-[200px] font-mono text-sm"
            />
            <Button onClick={handlePasteSubmit} disabled={!pastedContent.trim() || isLoading} className="w-full">
              Load Pasted Content
            </Button>
          </TabsContent>
        </Tabs>

        {validationError && (
          <Alert variant="destructive" className="mt-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Validation Error</AlertTitle>
            <AlertDescription>{validationError}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
