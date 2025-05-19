"use client"

import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"

interface SwaggerDisplayProps {
  yamlContent: string
}

export default function SwaggerDisplay({ yamlContent }: SwaggerDisplayProps) {
  const preRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    // Apply syntax highlighting if needed
    // This is a simple implementation - you could use a library like highlight.js for better highlighting
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
    <Card className="bg-gray-900 text-gray-100 p-4 rounded-lg shadow-lg overflow-auto max-h-[70vh]">
      <pre
        ref={preRef}
        className="font-mono text-sm whitespace-pre-wrap"
        style={{ fontFamily: "Consolas, Monaco, 'Andale Mono', monospace" }}
      >
        {yamlContent}
      </pre>
    </Card>
  )
}
