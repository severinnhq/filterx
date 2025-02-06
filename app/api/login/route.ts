// app/api/login/route.ts
import { NextResponse, NextRequest } from "next/server";
import { validateUser } from "@/lib/auth";

export const dynamic = 'force-dynamic'; // Add this line

interface LoginBody {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  // Safely get and normalize Content-Type
  const contentType = String(request.headers?.get("content-type")?.toLowerCase() ?? "");

  let body: LoginBody;
  try {
    if (contentType.startsWith("application/json")) {
      body = await request.json();
    } else {
      const text = await request.text();
      body = JSON.parse(text);
    }
  } catch {
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
