import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (!path || path.length === 0) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const endpoint = path.join("/");
  const url = new URL(request.url);
  const search = url.search;
  const targetUrl = `https://api.github.com/${endpoint}${search}`;

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "DevDeck-Portfolio-App",
  };

  const token = process.env.GITHUB_TOKEN;
  if (token && token.trim().length > 0) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  try {
    const upstreamRes = await fetch(targetUrl, {
      headers,
      next: { revalidate: 60 },
    });

    const rateLimitHeader = {
      limit: Number(upstreamRes.headers.get("x-ratelimit-limit") ?? "60"),
      remaining: Number(upstreamRes.headers.get("x-ratelimit-remaining") ?? "60"),
      reset: Number(upstreamRes.headers.get("x-ratelimit-reset") ?? "0"),
    };

    if (upstreamRes.status === 404) {
      return NextResponse.json(
        { error: "GitHub resource not found.", rateLimit: rateLimitHeader },
        {
          status: 404,
          headers: {
            "x-ratelimit-remaining": String(rateLimitHeader.remaining),
            "x-ratelimit-reset": String(rateLimitHeader.reset),
          },
        }
      );
    }

    if (upstreamRes.status === 403) {
      return NextResponse.json(
        {
          error:
            "GitHub API rate limit exceeded. Set GITHUB_TOKEN in your environment or wait for reset.",
          rateLimit: rateLimitHeader,
        },
        {
          status: 403,
          headers: {
            "x-ratelimit-remaining": String(rateLimitHeader.remaining),
            "x-ratelimit-reset": String(rateLimitHeader.reset),
          },
        }
      );
    }

    if (!upstreamRes.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${upstreamRes.statusText}`, rateLimit: rateLimitHeader },
        { status: upstreamRes.status }
      );
    }

    const data = await upstreamRes.json();
    return NextResponse.json(
      { data, rateLimit: rateLimitHeader },
      {
        status: 200,
        headers: {
          "x-ratelimit-remaining": String(rateLimitHeader.remaining),
          "x-ratelimit-reset": String(rateLimitHeader.reset),
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch from GitHub";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
