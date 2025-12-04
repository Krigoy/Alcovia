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

    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
    
    const trimmedEmail = email.trim().toLowerCase();
    
    // Split email into local and domain parts
    const emailParts = trimmedEmail.split("@");
    if (emailParts.length !== 2) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    
    const [localPart, domain] = emailParts;
    
    // Validate local part (before @)
    if (!localPart || localPart.length === 0 || localPart.length > 64) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    
    // Validate local part doesn't start/end with dot or have consecutive dots
    if (localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..")) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    
    // Validate domain part (after @)
    if (!domain || domain.length === 0 || domain.length > 255) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    
    // Domain must have at least one dot and a valid TLD
    const domainParts = domain.split(".");
    if (domainParts.length < 2) {
      return NextResponse.json(
        { error: "Please enter a valid email address with a domain" },
        { status: 400 }
      );
    }
    
    // Check for double TLDs (e.g., .com.com, .gmail.com.com)
    const tld = domainParts[domainParts.length - 1];
    const secondLast = domainParts[domainParts.length - 2];
    
    // Reject if the last two parts are the same (e.g., com.com)
    if (tld === secondLast) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    
    // Check for patterns like gmail.com.com (where domain has duplicate TLD)
    if (domainParts.length > 2) {
      // Check if any two consecutive parts are the same
      for (let i = 0; i < domainParts.length - 1; i++) {
        if (domainParts[i] === domainParts[i + 1]) {
          return NextResponse.json(
            { error: "Please enter a valid email address" },
            { status: 400 }
          );
        }
      }
    }
    
    // TLD must be at least 2 characters and only letters
    if (!/^[a-zA-Z]{2,}$/.test(tld)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }
    
    // Domain parts cannot be empty or start/end with hyphen
    for (const part of domainParts) {
      if (!part || part.length === 0 || part.startsWith("-") || part.endsWith("-")) {
        return NextResponse.json(
          { error: "Please enter a valid email address" },
          { status: 400 }
        );
      }
    }
    
    // Final regex validation for overall format
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Sanitize inputs (email already trimmed and lowercased above)
    const sanitizedData = {
      name: name.trim(),
      email: trimmedEmail,
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


