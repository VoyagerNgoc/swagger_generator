"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Loader2, CheckCircle, XCircle, Clock, ExternalLink, GitPullRequest } from "lucide-react"
import { checkCodeGenJobStatus, type CodeGenJob } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

interface CodeGenJobTrackerProps {
  backendJobId?: string
  frontendJobId?: string
}

export default function CodeGenJobTracker({ backendJobId, frontendJobId }: CodeGenJobTrackerProps) {
  const [backendJob, setBackendJob] = useState<CodeGenJob | null>(null)
  const [frontendJob, setFrontendJob] = useState<CodeGenJob | null>(null)
  const [isPolling, setIsPolling] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!backendJobId && !frontendJobId) return

    const pollJobs = async () => {
      try {
        if (backendJobId) {
          const backendStatus = await checkCodeGenJobStatus(backendJobId)
          if (backendStatus) {
            setBackendJob(backendStatus)
          }
        }

        if (frontendJobId) {
          const frontendStatus = await checkCodeGenJobStatus(frontendJobId)
          if (frontendStatus) {
            setFrontendJob(frontendStatus)
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
      } else {
        pollJobs()
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [backendJobId, frontendJobId, toast])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
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
      case "pending":
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
    <Card className="mt-4 shadow-lg border-none bg-white/95 dark:bg-gray-900/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitPullRequest className="h-5 w-5" />
          CodeGen Job Status
        </CardTitle>
        <CardDescription>Track the progress of your code generation jobs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {backendJobId && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Backend (Ruby on Rails)</h4>
              <Badge variant={getStatusColor(backendJob?.status || "pending")} className="flex items-center gap-1">
                {getStatusIcon(backendJob?.status || "pending")}
                {backendJob?.status || "pending"}
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

        {frontendJobId && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Frontend (NuxtJS)</h4>
              <Badge variant={getStatusColor(frontendJob?.status || "pending")} className="flex items-center gap-1">
                {getStatusIcon(frontendJob?.status || "pending")}
                {frontendJob?.status || "pending"}
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

        {isPolling && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking status every 5 seconds...
          </div>
        )}
      </CardContent>
    </Card>
  )
}
