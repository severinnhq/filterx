// app/api/login/route.ts
import { NextResponse, NextRequest } from "next/server";
import { validateUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  let body: any;
  // Get the content-type header
  const contentType = request.headers.get("content-type") || "";
  
  // Check if the request is JSON
  if (contentType.startsWith("application/json")) {
    body = await request.json();
  } else {
    // Fallback: try to parse the body as text then JSON.
    try {
      body = JSON.parse(await request.text());
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid or missing JSON body" },
        { status: 400 }
      );
    }
  }

  // Validate that both email and password are provided
  if (!body || !body.email || !body.password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  try {
    const result = await validateUser({
      email: body.email,
      password: body.password,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}
