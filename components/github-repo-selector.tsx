"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Github, Plus, X, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Repository {
  id: number
  name: string
  full_name: string
  private: boolean
  html_url: string
}

interface GitHubRepoSelectorProps {
  label: string
  value: string
  onChange: (value: string) => void
  disabled: boolean
}

export default function GitHubRepoSelector({ label, value, onChange, disabled }: GitHubRepoSelectorProps) {
  const [repositories, setRepositories] = useState<Repository[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showManualInput, setShowManualInput] = useState(false)
  const [manualRepo, setManualRepo] = useState("")
  const [githubToken, setGithubToken] = useState("")
  const [hasToken, setHasToken] = useState(false)
  const [isAutoConnected, setIsAutoConnected] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // First check if there's an environment variable token
    checkEnvironmentToken()
  }, [])

  const checkEnvironmentToken = async () => {
    try {
      // Check if server has GITHUB_ACCESS_TOKEN
      const response = await fetch("/api/github-token")
      if (response.ok) {
        const data = await response.json()
        if (data.hasToken) {
          setIsAutoConnected(true)
          setHasToken(true)
          fetchRepositoriesFromServer()
          toast({
            variant: "success",
            title: "GitHub Connected",
            description: "Automatically connected using environment token",
          })
          return
        }
      }
    } catch (error) {
      console.log("No environment token available, checking localStorage")
    }

    // Fallback to localStorage token
    const localToken = localStorage.getItem("github_token")
    if (localToken) {
      setGithubToken(localToken)
      setHasToken(true)
      fetchRepositories(localToken)
    }
  }

  const fetchRepositoriesFromServer = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/github-repos")
      if (!response.ok) {
        throw new Error("Failed to fetch repositories from server")
      }
      const repos = await response.json()
      setRepositories(repos)
    } catch (error) {
      console.error("Error fetching repositories from server:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch GitHub repositories from server.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRepositories = async (token: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch repositories")
      }

      const repos = await response.json()
      setRepositories(repos)
    } catch (error) {
      console.error("Error fetching repositories:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch GitHub repositories. Please check your token.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTokenSubmit = () => {
    if (!githubToken.trim()) return

    localStorage.setItem("github_token", githubToken)
    setHasToken(true)
    fetchRepositories(githubToken)
    toast({
      variant: "success",
      title: "Success",
      description: "GitHub token saved and repositories loaded",
    })
  }

  const handleManualSubmit = () => {
    if (!manualRepo.trim()) return

    onChange(manualRepo)
    setShowManualInput(false)
    toast({
      variant: "success",
      title: "Success",
      description: "Repository manually added",
    })
  }

  const clearToken = () => {
    if (isAutoConnected) {
      toast({
        variant: "info",
        title: "Info",
        description: "Cannot disconnect environment token. Remove GITHUB_ACCESS_TOKEN from environment variables.",
      })
      return
    }

    localStorage.removeItem("github_token")
    setGithubToken("")
    setHasToken(false)
    setRepositories([])
    onChange("")
  }

  if (!hasToken) {
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="space-y-3 p-4 border rounded-md bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Github className="h-4 w-4" />
            Connect GitHub to select repositories
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="GitHub Personal Access Token"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
              disabled={disabled}
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={handleTokenSubmit} disabled={!githubToken.trim() || disabled}>
                Connect GitHub
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowManualInput(true)} disabled={disabled}>
                Enter Manually
              </Button>
            </div>
          </div>
          {showManualInput && (
            <div className="space-y-2">
              <Input
                placeholder="owner/repository-name"
                value={manualRepo}
                onChange={(e) => setManualRepo(e.target.value)}
                disabled={disabled}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleManualSubmit} disabled={!manualRepo.trim() || disabled}>
                  Add Repository
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowManualInput(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2">
          {label}
          {isAutoConnected && (
            <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
              <CheckCircle className="h-3 w-3" />
              Auto-connected
            </span>
          )}
        </Label>
        <Button size="sm" variant="ghost" onClick={clearToken} disabled={disabled || isAutoConnected}>
          <X className="h-4 w-4 mr-1" />
          {isAutoConnected ? "Environment" : "Disconnect"}
        </Button>
      </div>
      <Select value={value} onValueChange={onChange} disabled={disabled || isLoading}>
        <SelectTrigger>
          <SelectValue placeholder={isLoading ? "Loading repositories..." : "Select repository"} />
        </SelectTrigger>
        <SelectContent>
          {repositories.map((repo) => (
            <SelectItem key={repo.id} value={repo.full_name}>
              <div className="flex items-center gap-2">
                <span>{repo.name}</span>
                {repo.private && <span className="text-xs bg-gray-200 px-1 rounded">Private</span>}
              </div>
            </SelectItem>
          ))}
          <SelectItem value="manual">
            <div className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Enter manually
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
      {value === "manual" && (
        <Input
          placeholder="owner/repository-name"
          value={manualRepo}
          onChange={(e) => {
            setManualRepo(e.target.value)
            onChange(e.target.value)
          }}
          disabled={disabled}
        />
      )}
    </div>
  )
}
