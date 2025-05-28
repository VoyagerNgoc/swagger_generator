import { NextResponse } from "next/server"

export async function GET() {
  const githubToken = process.env.GITHUB_ACCESS_TOKEN

  return NextResponse.json({
    hasToken: !!githubToken,
  })
}
