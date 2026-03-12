import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

function errorPage(status: number, message: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Error ${status}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background: #f8f9fa;
      color: #333;
    }
    .card {
      text-align: center;
      padding: 3rem 2rem;
      background: #fff;
      border-radius: 12px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.08);
      max-width: 420px;
    }
    .code { font-size: 3rem; font-weight: 700; color: #e74c3c; }
    .message { margin-top: 0.75rem; font-size: 1rem; color: #555; }
  </style>
</head>
<body>
  <div class="card">
    <div class="code">${status}</div>
    <div class="message">${message}</div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return errorPage(400, "Missing token parameter.");
  }

  try {
    const backendUrl = `${API_BASE_URL}/resources/${encodeURIComponent(id)}/html?token=${encodeURIComponent(token)}`;

    const res = await fetch(backendUrl, {
      headers: { Accept: "text/html" },
    });

    if (!res.ok) {
      const status = res.status;
      if (status === 401 || status === 403) {
        return errorPage(403, "Access denied. The token may have expired.");
      }
      if (status === 404) {
        return errorPage(404, "Resource not found.");
      }
      return errorPage(
        status,
        "An error occurred while loading this resource.",
      );
    }

    const html = await res.text();

    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return errorPage(
      502,
      "Unable to reach the content server. Please try again later.",
    );
  }
}
