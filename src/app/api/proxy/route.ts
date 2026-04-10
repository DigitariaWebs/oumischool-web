import { NextRequest, NextResponse } from "next/server";

function normalizeUrl(url: string): string {
  // Handle cases like http://localhost:4000uploads/...
  if (!url.startsWith("http")) return url;

  try {
    const urlObj = new URL(url);
    if (!urlObj.pathname.startsWith("/")) {
      urlObj.pathname = "/" + urlObj.pathname;
    }
    return urlObj.toString();
  } catch {
    return url.replace(/^(https?:\/\/[^/]+)([a-zA-Z])/g, "$1/$2");
  }
}

function getMimeType(url: string, contentType?: string): string {
  if (contentType && !contentType.includes("octet-stream")) {
    return contentType;
  }

  // Try to infer from URL extension
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.includes(".mp4")) return "video/mp4";
  if (lowerUrl.includes(".webm")) return "video/webm";
  if (lowerUrl.includes(".avi")) return "video/avi";
  if (lowerUrl.includes(".mov")) return "video/quicktime";
  if (lowerUrl.includes(".mkv")) return "video/x-matroska";
  if (lowerUrl.includes(".ogg") || lowerUrl.includes(".ogv"))
    return "video/ogg";

  if (lowerUrl.includes(".mp3")) return "audio/mpeg";
  if (lowerUrl.includes(".wav")) return "audio/wav";
  if (lowerUrl.includes(".m4a")) return "audio/mp4";

  if (lowerUrl.includes(".pdf")) return "application/pdf";
  if (lowerUrl.includes(".html")) return "text/html";
  if (lowerUrl.includes(".svg")) return "image/svg+xml";
  if (lowerUrl.includes(".png")) return "image/png";
  if (lowerUrl.includes(".jpg") || lowerUrl.includes(".jpeg"))
    return "image/jpeg";
  if (lowerUrl.includes(".gif")) return "image/gif";
  if (lowerUrl.includes(".webp")) return "image/webp";

  return contentType || "application/octet-stream";
}

export async function GET(request: NextRequest) {
  console.log("[Proxy] Request received:", request.url);

  const { searchParams } = new URL(request.url);
  const resourceId = searchParams.get("resourceId");
  const fileUrl = searchParams.get("url");
  const tokenParam = searchParams.get("token");
  const authHeader = request.headers.get("authorization");

  console.log("[Proxy] 🔍 Token diagnostics:", {
    resourceId: !!resourceId,
    fileUrl: !!fileUrl,
    tokenParam: !!tokenParam,
    tokenParamValue: tokenParam?.substring(0, 30),
    authHeader: !!authHeader,
    authHeaderValue: authHeader?.substring(0, 30),
  });

  // Determine what we're proxying
  let proxyUrl: string;
  let method: "GET" | "POST" = "GET";
  let isResourceDownloadEndpoint = false;

  if (resourceId) {
    // Use /resources/{id}/download-secure GET endpoint to fetch file directly with auth
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    proxyUrl = `${backendUrl}/resources/${resourceId}/download-secure`;
    method = "GET";
    isResourceDownloadEndpoint = false;
    console.log(
      "[Proxy] ✅ MODE: Resource download-secure endpoint (GET):",
      proxyUrl,
    );
  } else if (fileUrl) {
    // Direct file URL
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
    if (fileUrl.startsWith("http")) {
      proxyUrl = normalizeUrl(fileUrl);
    } else {
      if (!fileUrl.startsWith("/")) {
        proxyUrl = `${backendUrl}/${fileUrl}`;
      } else {
        proxyUrl = `${backendUrl}${fileUrl}`;
      }
    }
    console.log("[Proxy] Using direct file URL:", proxyUrl);
  } else {
    console.error("[Proxy] Neither resourceId nor url provided");
    return NextResponse.json(
      { error: "resourceId or url parameter required" },
      { status: 400 },
    );
  }

  try {
    const headers: HeadersInit = {
      "User-Agent": "OumiSchool-Proxy/1.0",
    };

    // Use token from query param or Authorization header
    let authToken = tokenParam || authHeader;

    if (!authToken) {
      const cookies = request.headers.get("cookie");
      if (cookies) {
        const tokenMatch = cookies.match(/token=([^;]+)/);
        if (tokenMatch) {
          authToken = `Bearer ${tokenMatch[1]}`;
          console.log("[Proxy] Token extracted from cookies");
        }
      }
    }

    if (authToken) {
      if (!authToken.startsWith("Bearer ")) {
        headers.Authorization = `Bearer ${authToken}`;
      } else {
        headers.Authorization = authToken;
      }
      console.log("[Proxy] Auth header set");
    } else {
      console.warn("[Proxy] No authentication token found");
    }

    console.log("[Proxy] Fetching from:", proxyUrl, "method:", method);
    let response = await fetch(proxyUrl, {
      method,
      headers,
      body: method === "POST" ? JSON.stringify({}) : undefined,
      credentials: "include",
    });

    console.log(
      "[Proxy] Response status:",
      response.status,
      response.statusText,
    );

    // If we get 403 with auth, try without auth
    if (response.status === 403 && authToken) {
      console.log(
        "[Proxy] Got 403 with auth, retrying without authentication...",
      );
      const headersWithoutAuth = { ...headers };
      delete headersWithoutAuth["Authorization"];

      response = await fetch(proxyUrl, {
        method,
        headers: headersWithoutAuth,
        body: method === "POST" ? JSON.stringify({}) : undefined,
      });
      console.log(
        "[Proxy] Retry status:",
        response.status,
        response.statusText,
      );
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Proxy] Failed:", {
        status: response.status,
        statusText: response.statusText,
        url: proxyUrl,
        errorBody: errorText.substring(0, 200),
      });
      return NextResponse.json(
        { error: `Backend returned ${response.status}` },
        { status: response.status },
      );
    }

    console.log("[Proxy] Reading buffer...");
    const buffer = await response.arrayBuffer();
    console.log("[Proxy] Buffer size:", buffer.byteLength);

    // Use getMimeType to infer content type from URL and response headers
    const backendContentType = response.headers.get("content-type");
    const finalContentType = getMimeType(proxyUrl, backendContentType);
    console.log(
      "[Proxy] Content-Type:",
      finalContentType,
      "(from:",
      backendContentType,
      ")",
    );

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": finalContentType,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("[Proxy] Error:", error);
    console.error(
      "[Proxy] Error type:",
      error instanceof Error ? error.message : String(error),
    );
    return NextResponse.json(
      {
        error: "Failed to proxy request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
