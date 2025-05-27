"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Download, Copy, Code } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CodeDisplayProps {
  code: string
  title: string
  framework: "remix" | "rails"
}

export default function CodeDisplay({ code, title, framework }: CodeDisplayProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("code")

  // Parse the code into separate files
  const files = parseCodeIntoFiles(code, framework)

  const handleDownload = () => {
    // Create a zip file with all the code files
    // For simplicity, we're just downloading as a text file for now
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${framework === "remix" ? "remix-frontend" : "rails-backend"}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast({
      variant: "success",
      title: "Success",
      description: `${framework === "remix" ? "Remix frontend" : "Rails backend"} code downloaded`,
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    toast({
      variant: "success",
      title: "Success",
      description: "Code copied to clipboard",
    })
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white drop-shadow-sm">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleCopy}
            className="bg-white/20 hover:bg-white/30 text-white border-white/20"
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy All
          </Button>
          <Button
            variant="outline"
            onClick={handleDownload}
            className="bg-white/20 hover:bg-white/30 text-white border-white/20"
          >
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>
      </div>

      <Tabs defaultValue="code" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="bg-white/20 text-white mb-4">
          <TabsTrigger value="code" className="data-[state=active]:bg-white/30">
            <Code className="mr-2 h-4 w-4" />
            Code
          </TabsTrigger>
          {files.map((file, index) => (
            <TabsTrigger key={index} value={`file-${index}`} className="data-[state=active]:bg-white/30">
              {getShortFileName(file.path)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="code" className="mt-0">
          <Card className="bg-gray-900 text-gray-100 p-4 rounded-lg shadow-lg overflow-auto max-h-[70vh]">
            <pre className="font-mono text-sm whitespace-pre-wrap">{code}</pre>
          </Card>
        </TabsContent>

        {files.map((file, index) => (
          <TabsContent key={index} value={`file-${index}`} className="mt-0">
            <Card className="bg-gray-900 text-gray-100 p-4 rounded-lg shadow-lg overflow-auto max-h-[70vh]">
              <div className="mb-2 pb-2 border-b border-gray-700">
                <span className="text-gray-400 text-sm">{file.path}</span>
              </div>
              <pre className="font-mono text-sm whitespace-pre-wrap">{file.content}</pre>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

// Helper function to parse code into files
function parseCodeIntoFiles(code: string, framework: "remix" | "rails") {
  const files: { path: string; content: string }[] = []

  // Different regex patterns based on framework
  const filePattern =
    framework === "remix"
      ? /\/\/ File: ([^\n]+)\n([\s\S]*?)(?=\/\/ File:|$)/g
      : /# File: ([^\n]+)\n([\s\S]*?)(?=# File:|$)/g

  let match
  while ((match = filePattern.exec(code)) !== null) {
    const [_, path, content] = match
    files.push({
      path: path.trim(),
      content: content.trim(),
    })
  }

  return files
}

// Helper function to get a short file name for tabs
function getShortFileName(path: string) {
  const parts = path.split("/")
  return parts[parts.length - 1]
}
