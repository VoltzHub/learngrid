import { createSupabaseServerClient } from "@/lib/supabase/server";

const BUCKET = "verification-docs";
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export async function uploadVerificationDoc(
  userId: string,
  file: File,
  docType: "qualification" | "government-id"
): Promise<{ path: string; url: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only PDF, JPG, and PNG files are allowed.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("File must be smaller than 5 MB.");
  }

  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${userId}/${docType}-${Date.now()}.${ext}`;

  const supabase = createSupabaseServerClient();
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  return { path, url: `${BUCKET}/${path}` };
}

export function getDocUrl(path: string): string {
  // For admin access, we generate a signed URL server-side
  return path;
}

export async function getSignedUrl(path: string): Promise<string | null> {
  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, 3600); // 1 hour

  if (error) return null;
  return data.signedUrl;
}
