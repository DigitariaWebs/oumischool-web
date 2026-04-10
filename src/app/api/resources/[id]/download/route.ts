import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: resourceId } = await params;

    console.log("[Resources Download API] Raw params:", { params });
    console.log("[Resources Download API] Fetching resource:", {
      resourceId,
      isUndefined: resourceId === "undefined",
      isEmpty: resourceId.trim() === "",
      type: typeof resourceId,
      length: resourceId?.length,
    });

    // Validate resourceId
    if (!resourceId || resourceId === "undefined" || resourceId.trim() === "") {
      console.error("[Resources Download API] ❌ Invalid resourceId:", {
        resourceId,
        isUndefined: resourceId === "undefined",
      });
      return NextResponse.json(
        { error: "Invalid resource ID" },
        { status: 400 },
      );
    }

    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

    console.log("[Resources Download API] Fetching resource:", resourceId);

    // Get token from multiple sources
    let authToken = request.headers.get("authorization");

    // Try cookies if no authorization header
    if (!authToken) {
      const cookies = request.headers.get("cookie");
      if (cookies) {
        const tokenMatch = cookies.match(/auth_token=([^;]+)/);
        if (tokenMatch) {
          authToken = `Bearer ${tokenMatch[1]}`;
          console.log("[Resources Download API] Token extracted from cookies");
        }
      }
    }

    // Try query parameter as fallback
    const { searchParams } = new URL(request.url);
    const tokenParam = searchParams.get("token");
    if (!authToken && tokenParam) {
      authToken = `Bearer ${tokenParam}`;
      console.log("[Resources Download API] Token from query param");
    }

    if (!authToken) {
      console.warn("[Resources Download API] No auth token found");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log(
      "[Resources Download API] Calling backend to get file (download-secure endpoint)",
    );

    // Call backend endpoint to get file directly with auth
    // Note: download-secure is a GET endpoint that returns the file directly
    const fileResponse = await fetch(
      `${backendUrl}/resources/${resourceId}/download-secure`,
      {
        method: "GET",
        headers: {
          Authorization: authToken,
        },
      },
    );

    console.log(
      "[Resources Download API] Backend response status:",
      fileResponse.status,
    );

    if (!fileResponse.ok) {
      const errorText = await fileResponse.text();
      console.error("[Resources Download API] Failed to fetch file:", {
        status: fileResponse.status,
        error: errorText.substring(0, 200),
      });
      return NextResponse.json(
        { error: `Backend returned ${fileResponse.status}` },
        { status: fileResponse.status },
      );
    }

    // Get content type from response
    const contentType =
      fileResponse.headers.get("content-type") || "application/octet-stream";
    const buffer = await fileResponse.arrayBuffer();

    console.log(
      "[Resources Download API] ✅ File fetched successfully, size:",
      buffer.byteLength,
      "bytes",
    );

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=3600",
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin",
      },
    });
  } catch (error) {
    console.error("[Resources Download API] Error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
