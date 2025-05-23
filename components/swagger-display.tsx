"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface SwaggerDisplayProps {
  yamlContent: string
}

export default function SwaggerDisplay({ yamlContent }: SwaggerDisplayProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

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

  return (
    <>
      {validationError && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Validation Warning</AlertTitle>
          <AlertDescription>{validationError}</AlertDescription>
        </Alert>
      )}
      <Card className="bg-gray-900 text-gray-100 p-4 rounded-lg shadow-lg overflow-auto max-h-[70vh]">
        <pre
          ref={preRef}
          className="font-mono text-sm whitespace-pre-wrap"
          style={{ fontFamily: "Consolas, Monaco, 'Andale Mono', monospace" }}
        >
          {yamlContent}
        </pre>
      </Card>
    </>
  )
}
