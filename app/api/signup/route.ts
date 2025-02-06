import { NextRequest, NextResponse } from "next/server";
import { createUser } from "@/lib/auth";

// Define an interface for the expected request body
interface SignupBody {
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("Content-Type") ?? "";

  let body: SignupBody;

  try {
    if (contentType.startsWith("application/json")) {
      body = await req.json();
    } else {
      const text = await req.text();
      body = JSON.parse(text);
    }
  } catch {
    return NextResponse.json(
      { error: "Invalid or missing JSON body" },
      { status: 400 }
    );
  }

  // Validate required fields
  if (!body.email || !body.password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  // Validate email format
  if (typeof body.email !== "string" || !body.email.includes("@")) {
    return NextResponse.json(
      { error: "Invalid email format" },
      { status: 400 }
    );
  }

  // Validate password length
  if (typeof body.password !== "string" || body.password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters long" },
      { status: 400 }
    );
  }

  try {
    const result = await createUser(body);

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
