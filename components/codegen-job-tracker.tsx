"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, XCircle, Clock, ExternalLink, GitPullRequest, Database } from "lucide-react"
import { checkCodeGenJobStatus, type CodeGenJob } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { DATABASE_OPTIONS } from "@/lib/constants"

interface CodeGenJobTrackerProps {
  backendJobId?: string
  frontendJobId?: string
  backendFramework?: string
  frontendFramework?: string
  database?: string
}

export default function CodeGenJobTracker({
  backendJobId,
  frontendJobId,
  backendFramework,
  frontendFramework,
  database,
}: CodeGenJobTrackerProps) {
  const [backendJob, setBackendJob] = useState<CodeGenJob | null>(null)
  const [frontendJob, setFrontendJob] = useState<CodeGenJob | null>(null)
  const [isPolling, setIsPolling] = useState(true)
  const { toast } = useToast()

  const selectedDatabase = DATABASE_OPTIONS.find(db => db.value === database)

  useEffect(() => {
    if (!backendJobId && !frontendJobId) return

    const pollJobs = async () => {
      try {
        if (backendJobId) {
          const backendStatus = await checkCodeGenJobStatus(backendJobId)
          if (backendStatus) {
            setBackendJob({ ...backendStatus, framework: backendFramework, database })
          }
        }

        if (frontendJobId) {
          const frontendStatus = await checkCodeGenJobStatus(frontendJobId)
          if (frontendStatus) {
            setFrontendJob({ ...frontendStatus, framework: frontendFramework })
          }
        }
      } catch (error) {
        console.error("Error polling job status:", error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to check job status",
        })
      }
    }

    // Initial poll
    pollJobs()

    // Set up polling interval
    const interval = setInterval(() => {
      const allJobsCompleted =
        (!backendJobId || (backendJob && ["completed", "failed"].includes(backendJob.status))) &&
        (!frontendJobId || (frontendJob && ["completed", "failed"].includes(frontendJob.status)))

      if (allJobsCompleted) {
        setIsPolling(false)
        clearInterval(interval)
        console.log("All jobs completed, stopping polling")
      } else {
        pollJobs()
      }
    }, 3000) // Poll every 3 seconds for faster updates

    return () => clearInterval(interval)
  }, [backendJobId, frontendJobId, backendFramework, frontendFramework, database, toast, backendJob, frontendJob])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "loading_processing":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "loading_processing":
        return "secondary"
      case "running":
        return "default"
      case "completed":
        return "default"
      case "failed":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "loading_processing":
        return "Processing"
      case "running":
        return "Running"
      case "completed":
        return "Completed"
      case "failed":
        return "Failed"
      default:
        return "Processing"
    }
  }

  const formatDuration = (startTime: string, endTime?: string) => {
    const start = new Date(startTime)
    const end = endTime ? new Date(endTime) : new Date()
    const duration = Math.floor((end.getTime() - start.getTime()) / 1000)

    if (duration < 60) return `${duration}s`
    if (duration < 3600) return `${Math.floor(duration / 60)}m ${duration % 60}s`
    return `${Math.floor(duration / 3600)}h ${Math.floor((duration % 3600) / 60)}m`
  }

  if (!backendJobId && !frontendJobId) return null

  return (
    <Card className="mb-8 shadow-lg border-none bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitPullRequest className="h-5 w-5" />
          CodeGen Job Status
        </CardTitle>
        <CardDescription>Track the progress of your code generation jobs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {backendJobId && backendFramework && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h4 className="font-medium">Backend ({backendFramework})</h4>
                {selectedDatabase && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Database className="h-3 w-3" />
                    <span>{selectedDatabase.icon}</span>
                    <span>{selectedDatabase.label}</span>
                  </div>
                )}
              </div>
              <Badge
                variant={getStatusColor(backendJob?.status || "loading_processing")}
                className="flex items-center gap-1"
              >
                {getStatusIcon(backendJob?.status || "loading_processing")}
                {getStatusLabel(backendJob?.status || "loading_processing")}
              </Badge>
            </div>

            {backendJob && (
              <>
                <Progress value={backendJob.progress || 0} className="w-full" />
                <div className="text-sm text-muted-foreground">
                  Duration: {formatDuration(backendJob.createdAt, backendJob.completedAt)}
                </div>

                {backendJob.status === "completed" && backendJob.pullRequestUrl && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(backendJob.pullRequestUrl, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Pull Request
                    </Button>
                    {backendJob.repositoryUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(backendJob.repositoryUrl, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Repository
                      </Button>
                    )}
                  </div>
                )}

                {backendJob.status === "failed" && backendJob.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:border-red-800">
                    <p className="text-sm text-red-800 dark:text-red-200">{backendJob.error}</p>
                  </div>
                )}
              </>
            )}

            <div className="text-xs text-muted-foreground">Job ID: {backendJobId}</div>
          </div>
        )}

        {frontendJobId && frontendFramework && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Frontend ({frontendFramework})</h4>
              <Badge
                variant={getStatusColor(frontendJob?.status || "loading_processing")}
                className="flex items-center gap-1"
              >
                {getStatusIcon(frontendJob?.status || "loading_processing")}
                {getStatusLabel(frontendJob?.status || "loading_processing")}
              </Badge>
            </div>

            {frontendJob && (
              <>
                <Progress value={frontendJob.progress || 0} className="w-full" />
                <div className="text-sm text-muted-foreground">
                  Duration: {formatDuration(frontendJob.createdAt, frontendJob.completedAt)}
                </div>

                {frontendJob.status === "completed" && frontendJob.pullRequestUrl && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(frontendJob.pullRequestUrl, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Pull Request
                    </Button>
                    {frontendJob.repositoryUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(frontendJob.repositoryUrl, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Repository
                      </Button>
                    )}
                  </div>
                )}

                {frontendJob.status === "failed" && frontendJob.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:border-red-800">
                    <p className="text-sm text-red-800 dark:text-red-200">{frontendJob.error}</p>
                  </div>
                )}
              </>
            )}

            <div className="text-xs text-muted-foreground">Job ID: {frontendJobId}</div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}