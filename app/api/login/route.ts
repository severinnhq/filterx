import { NextResponse, NextRequest } from "next/server";
import { validateUser } from "@/lib/auth";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  let body: LoginBody | undefined;
  // Get the content-type header (defaulting to an empty string if not present)
  const contentType = request.headers.get("content-type") || "";

  // Check if the request is JSON
  if (contentType.startsWith("application/json")) {
    body = (await request.json()) as LoginBody;
  } else {
    // Fallback: try to parse the body as text then JSON.
    try {
      const text = await request.text();
      body = JSON.parse(text) as LoginBody;
    } catch (_error) {
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
