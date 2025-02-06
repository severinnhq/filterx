import { NextResponse } from "next/server";
import { validateUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || !body.email || !body.password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const result = await validateUser({
      email: body.email,
      password: body.password
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: "An error occurred during login" },
      { status: 500 }
    );
  }
}