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

// User type
export type User = {
  id: number;
  clerk_id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  created_at: string;
};

// Insert a new user (from Clerk authentication)
export async function insertUser(data: {
  clerkId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  createdAt: string;
}): Promise<User> {
  validateSupabaseConfig();
  const supabaseAdmin = getSupabaseAdmin();
  
  const { data: user, error } = await supabaseAdmin
    .from("users")
    .insert([
      {
        clerk_id: data.clerkId.trim(),
        email: data.email.trim().toLowerCase(),
        first_name: data.firstName?.trim() || null,
        last_name: data.lastName?.trim() || null,
        created_at: data.createdAt,
      },
    ])
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to insert user: ${error.message}`);
  }

  return user as User;
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

