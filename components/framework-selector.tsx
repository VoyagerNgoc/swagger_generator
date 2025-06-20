"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Code, Loader2, Github } from "lucide-react"
import { BACKEND_FRAMEWORKS, FRONTEND_FRAMEWORKS } from "@/lib/constants"
import GitHubRepoSelector from "./github-repo-selector"
import DatabaseSelector from "./database-selector"

interface FrameworkSelectorProps {
  backendFramework: string
  frontendFramework: string
  database: string
  backendRepo: string
  frontendRepo: string
  onBackendChange: (value: string) => void
  onFrontendChange: (value: string) => void
  onDatabaseChange: (value: string) => void
  onBackendRepoChange: (value: string) => void
  onFrontendRepoChange: (value: string) => void
  onSubmit: () => void
  isSubmitting: boolean
  disabled: boolean
}

export default function FrameworkSelector({
  backendFramework,
  frontendFramework,
  database,
  backendRepo,
  frontendRepo,
  onBackendChange,
  onFrontendChange,
  onDatabaseChange,
  onBackendRepoChange,
  onFrontendRepoChange,
  onSubmit,
  isSubmitting,
  disabled,
}: FrameworkSelectorProps) {
  const isFormValid = backendFramework && frontendFramework && database && backendRepo && frontendRepo

  return (
    <Card className="mb-8 shadow-lg border-none bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          Framework, Database & Repository Selection
        </CardTitle>
        <CardDescription>Choose your preferred frameworks, database, and target repositories for code generation</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backend Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Github className="h-4 w-4" />
              Backend Configuration
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Backend Framework</label>
              <Select value={backendFramework} onValueChange={onBackendChange} disabled={disabled}>
                <SelectTrigger>
                  <SelectValue placeholder="Select backend framework" />
                </SelectTrigger>
                <SelectContent>
                  {BACKEND_FRAMEWORKS.map((framework) => (
                    <SelectItem key={framework} value={framework}>
                      {framework}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <GitHubRepoSelector
              label="Backend Repository"
              value={backendRepo}
              onChange={onBackendRepoChange}
              disabled={disabled}
            />
          </div>

          {/* Frontend Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Github className="h-4 w-4" />
              Frontend Configuration
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Frontend Framework</label>
              <Select value={frontendFramework} onValueChange={onFrontendChange} disabled={disabled}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frontend framework" />
                </SelectTrigger>
                <SelectContent>
                  {FRONTEND_FRAMEWORKS.map((framework) => (
                    <SelectItem key={framework} value={framework}>
                      {framework}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <GitHubRepoSelector
              label="Frontend Repository"
              value={frontendRepo}
              onChange={onFrontendRepoChange}
              disabled={disabled}
            />
          </div>
        </div>

        {/* Database Selection */}
        <DatabaseSelector
          value={database}
          onChange={onDatabaseChange}
          disabled={disabled}
        />

        <div className="pt-4 border-t">
          <Button
            onClick={onSubmit}
            disabled={isSubmitting || disabled || !isFormValid}
            className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700 text-white font-medium py-3 shadow-md"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Submitting to CodeGen...
              </>
            ) : (
              <>
                <Code className="mr-2 h-5 w-5" />
                Submit to CodeGen API
              </>
            )}
          </Button>

          {!isFormValid && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Please select frameworks, database, and repositories for both backend and frontend
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}