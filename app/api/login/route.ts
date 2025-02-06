// app/api/login/route.ts
import { NextResponse, NextRequest } from "next/server";
import { validateUser } from "@/lib/auth";

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  // Try getting the Content-Type header using both common capitalizations.
  const headerContentType =
    request.headers.get("Content-Type") ||
    request.headers.get("content-type") ||
    "";
  // Ensure we have a string value.
  const contentType = typeof headerContentType === "string" ? headerContentType : "";

  // (Optional) Log the Content-Type to help debug in your environment.
  console.log("Content-Type header:", contentType);

  let body: LoginBody;
  try {
    if (contentType.startsWith("application/json")) {
      body = await request.json();
    } else {
      // Fallback: try to parse the request body as text then JSON.
      const text = await request.text();
      body = JSON.parse(text);
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid or missing JSON body" },
      { status: 400 }
    );
  }

  // Validate that both email and password are provided.
  if (!body.email || !body.password) {
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
      return NextResponse.json({ error: result.error }, { status: 401 });
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
