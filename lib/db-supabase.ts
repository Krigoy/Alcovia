import { getSupabaseAdmin, validateSupabaseConfig } from "./supabase";

// Type for enrollment data
export interface Enrollment {
  id: number;
  name: string;
  email: string;
  context: string | null;
  created_at: string;
}

// Insert a new enrollment
export async function insertEnrollment(data: {
  name: string;
  email: string;
  context?: string | null;
}): Promise<Enrollment> {
  validateSupabaseConfig();
  // Use admin client to bypass RLS for server-side operations
  const supabaseAdmin = getSupabaseAdmin();
  const { data: enrollment, error } = await supabaseAdmin
    .from("enrollments")
    .insert([
      {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        context: data.context ? data.context.trim() : null,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to insert enrollment: ${error.message}`);
  }

  return enrollment as Enrollment;
}

// Get all enrollments (for admin purposes)
export async function getAllEnrollments(): Promise<Enrollment[]> {
  validateSupabaseConfig();
  // Use admin client to bypass RLS for server-side operations
  const supabaseAdmin = getSupabaseAdmin();
  const { data: enrollments, error } = await supabaseAdmin
    .from("enrollments")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to retrieve enrollments: ${error.message}`);
  }

  return (enrollments as Enrollment[]) || [];
}

