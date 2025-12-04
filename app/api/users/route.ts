import { NextResponse } from "next/server";
import { insertUser } from "../../../lib/db-supabase";

export async function POST(request: Request) {
  try {
    const data = await request.json().catch(() => null);

    if (!data) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { clerkId, email, firstName, lastName, createdAt } = data;

    // Validate required fields
    if (!clerkId || typeof clerkId !== "string") {
      return NextResponse.json(
        { error: "Clerk ID is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Save user to database
    const user = await insertUser({
      clerkId: clerkId.trim(),
      email: email.trim().toLowerCase(),
      firstName: firstName?.trim() || null,
      lastName: lastName?.trim() || null,
      createdAt: createdAt || new Date().toISOString(),
    });

    return NextResponse.json({
      ok: true,
      message: "User saved successfully",
      id: user.id,
    });
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error("[/api/users] Error:", error);

    // Handle duplicate user (already exists)
    if (error.message?.includes("duplicate") || error.message?.includes("unique")) {
      return NextResponse.json({
        ok: true,
        message: "User already exists",
      });
    }

    return NextResponse.json(
      {
        error: "Failed to save user. Please try again later.",
      },
      { status: 500 }
    );
  }
}

