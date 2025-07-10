"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Code, Loader2, Github, Server, Monitor, Layers } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { BACKEND_FRAMEWORKS, FRONTEND_FRAMEWORKS } from "@/lib/constants"
import GitHubRepoSelector from "./github-repo-selector"
import DatabaseSelector from "./database-selector"

interface FrameworkSelectorProps {
  backendFramework: string
  frontendFramework: string
  database: string
  backendRepo: string
  frontendRepo: string
  generateBackend: boolean
  generateFrontend: boolean
  onBackendChange: (value: string) => void
  onFrontendChange: (value: string) => void
  onDatabaseChange: (value: string) => void
  onBackendRepoChange: (value: string) => void
  onFrontendRepoChange: (value: string) => void
  onGenerateBackendChange: (value: boolean) => void
  onGenerateFrontendChange: (value: boolean) => void
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
  generateBackend,
  generateFrontend,
  onBackendChange,
  onFrontendChange,
  onDatabaseChange,
  onBackendRepoChange,
  onFrontendRepoChange,
  onGenerateBackendChange,
  onGenerateFrontendChange,
  onSubmit,
  isSubmitting,
  disabled,
}: FrameworkSelectorProps) {
  const isBackendValid = !generateBackend || (backendFramework && database && backendRepo)
  const isFrontendValid = !generateFrontend || (frontendFramework && frontendRepo)
  const isFormValid = (generateBackend || generateFrontend) && isBackendValid && isFrontendValid

  const getButtonText = () => {
    if (generateBackend && generateFrontend) return 'Generate Backend & Frontend'
    if (generateBackend) return 'Generate Backend'
    if (generateFrontend) return 'Generate Frontend'
    return 'Generate Code'
  }

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
        {/* Generation Options */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Generation Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-4 border rounded-lg bg-blue-50 dark:bg-blue-950/20">
              <Checkbox
                id="generate-backend"
                checked={generateBackend}
                onCheckedChange={onGenerateBackendChange}
                disabled={disabled}
              />
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-600" />
                <label htmlFor="generate-backend" className="text-sm font-medium cursor-pointer">
                  Generate Backend
                </label>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-4 border rounded-lg bg-green-50 dark:bg-green-950/20">
              <Checkbox
                id="generate-frontend"
                checked={generateFrontend}
                onCheckedChange={onGenerateFrontendChange}
                disabled={disabled}
              />
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-green-600" />
                <label htmlFor="generate-frontend" className="text-sm font-medium cursor-pointer">
                  Generate Frontend
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Backend Section */}
          <div className={`space-y-4 transition-opacity duration-200 ${!generateBackend ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Server className="h-4 w-4 text-blue-600" />
              Backend Configuration
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Backend Framework</label>
              <Select value={backendFramework} onValueChange={onBackendChange} disabled={disabled || !generateBackend}>
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
              disabled={disabled || !generateBackend}
            />
          </div>

          {/* Frontend Section */}
          <div className={`space-y-4 transition-opacity duration-200 ${!generateFrontend ? 'opacity-50 pointer-events-none' : ''}`}>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Monitor className="h-4 w-4 text-green-600" />
              Frontend Configuration
            </h3>

            <div className="space-y-2">
              <label className="text-sm font-medium">Frontend Framework</label>
              <Select value={frontendFramework} onValueChange={onFrontendChange} disabled={disabled || !generateFrontend}>
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
              disabled={disabled || !generateFrontend}
            />
          </div>
        </div>

        {/* Database Selection - Only show when backend is selected */}
        {generateBackend && (
          <div className="transition-all duration-200">
            <DatabaseSelector
              value={database}
              onChange={onDatabaseChange}
              disabled={disabled}
            />
          </div>
        )}

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
                {getButtonText()}
              </>
            )}
          </Button>

          {!isFormValid && (
            <p className="text-sm text-muted-foreground mt-2 text-center">
              {!generateBackend && !generateFrontend 
                ? "Please select at least one generation option (Backend or Frontend)"
                : generateBackend && !isBackendValid
                ? "Please complete backend configuration (framework, database, and repository)"
                : generateFrontend && !isFrontendValid
                ? "Please complete frontend configuration (framework and repository)"
                : "Please complete the required configuration"}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}