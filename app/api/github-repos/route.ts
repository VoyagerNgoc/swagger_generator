import { NextResponse } from "next/server"

export async function GET() {
  const githubToken = process.env.GITHUB_ACCESS_TOKEN

  if (!githubToken) {
    return NextResponse.json({ error: "No GitHub token configured" }, { status: 401 })
  }

  try {
    const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch repositories")
    }

    const repos = await response.json()
    return NextResponse.json(repos)
  } catch (error) {
    console.error("Error fetching repositories:", error)
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: 500 })
  }
}
