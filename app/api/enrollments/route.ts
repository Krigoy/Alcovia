import { NextResponse } from "next/server";
import { getAllEnrollments } from "../../../lib/db-supabase";

// GET endpoint to retrieve all enrollments
// In production, add authentication/authorization here
export async function GET() {
  try {
    const enrollments = await getAllEnrollments();
    return NextResponse.json({ enrollments });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[/api/enrollments] Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve enrollments" },
      { status: 500 }
    );
  }
}

