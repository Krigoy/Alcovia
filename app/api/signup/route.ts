import { NextResponse } from "next/server";
import { insertEnrollment } from "../../../lib/db-supabase";

export async function POST(request: Request) {
  try {
    const data = await request.json().catch(() => null);

    if (!data) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Validate required fields
    const { name, email, context } = data;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      context: context ? context.trim() : null,
    };

    // Save to database
    const enrollment = await insertEnrollment(sanitizedData);

    // Log for debugging (optional)
    // eslint-disable-next-line no-console
    console.log("[/api/signup] New enrollment saved:", {
      id: enrollment.id,
      email: enrollment.email,
      createdAt: enrollment.created_at,
    });

    return NextResponse.json({
      ok: true,
      message: "Enrollment submitted successfully",
      id: enrollment.id,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[/api/signup] Error:", error);

    return NextResponse.json(
      {
        error: "Failed to process enrollment. Please try again later.",
      },
      { status: 500 }
    );
  }
}


