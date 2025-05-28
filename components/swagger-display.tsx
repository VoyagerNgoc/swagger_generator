"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface SwaggerDisplayProps {
  yamlContent: string
}

export default function SwaggerDisplay({ yamlContent }: SwaggerDisplayProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Basic validation - check if the YAML starts with openapi: 3.0.0
    if (!yamlContent.trim().startsWith("openapi:")) {
      setValidationError("Warning: The Swagger specification may not be valid. It should start with 'openapi: 3.0.0'.")
    } else {
      setValidationError(null)
    }

    // Apply syntax highlighting if needed
    if (preRef.current) {
      // Basic YAML syntax highlighting
      const highlighted = yamlContent
        // Highlight keys
        .replace(/^([a-zA-Z0-9_-]+):/gm, '<span style="color: #569cd6">$1:</span>')
        // Highlight values
        .replace(/: ([a-zA-Z0-9_-]+)/g, ': <span style="color: #ce9178">$1</span>')
        // Highlight numbers
        .replace(/: (\d+)/g, ': <span style="color: #b5cea8">$1</span>')
        // Highlight comments
        .replace(/(#.*)$/gm, '<span style="color: #6a9955">$1</span>')

      preRef.current.innerHTML = highlighted
    }
  }, [yamlContent])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(yamlContent)
      setIsCopied(true)
      toast({
        variant: "success",
        title: "Success",
        description: "Swagger specification copied to clipboard",
      })

      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to copy:", error)

      // Fallback for older browsers
      try {
        const textArea = document.createElement("textarea")
        textArea.value = yamlContent
        textArea.style.position = "fixed"
        textArea.style.left = "-999999px"
        textArea.style.top = "-999999px"
        document.body.appendChild(textArea)
        textArea.focus()
        textArea.select()
        document.execCommand("copy")
        document.body.removeChild(textArea)

        setIsCopied(true)
        toast({
          variant: "success",
          title: "Success",
          description: "Swagger specification copied to clipboard",
        })

        setTimeout(() => {
          setIsCopied(false)
        }, 2000)
      } catch (fallbackError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to copy to clipboard. Please copy manually.",
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      {validationError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Validation Warning</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}

      <div className="relative">
        <Card className="bg-gray-900 text-gray-100 p-4 rounded-lg shadow-lg overflow-auto max-h-[70vh]">
          <div className="absolute top-2 right-2 z-10">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="bg-gray-800/80 hover:bg-gray-700/80 text-gray-100 border-gray-600"
            >
              {isCopied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-green-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </>
              )}
            </Button>
          </div>

          <pre
            ref={preRef}
            className="font-mono text-sm whitespace-pre-wrap pr-20"
            style={{ fontFamily: "Consolas, Monaco, 'Andale Mono', monospace" }}
          >
            {yamlContent}
          </pre>
        </Card>
      </div>
    </div>
  )
}
