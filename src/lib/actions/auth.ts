"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { Role } from "@prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { dashboardPathFor } from "@/lib/auth";

const signUpSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  fullName: z.string().min(2, "Enter your full name."),
  role: z.enum(["STUDENT", "TEACHER"]),
  phone: z.string().optional(),
});

const signInSchema = z.object({
  email: z.string().email("Enter a valid email."),
  password: z.string().min(1, "Enter your password."),
});

export type AuthFormState = { error?: string } | undefined;

export async function signUp(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    fullName: formData.get("fullName"),
    role: formData.get("role"),
    phone: formData.get("phone") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = createSupabaseServerClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback`,
      data: {
        full_name: parsed.data.fullName,
        role: parsed.data.role,
        phone: parsed.data.phone ?? null,
        subject: (formData.get("subject") as string) ?? null,
        bio: (formData.get("bio") as string) ?? null,
      },
    },
  });

  if (error) return { error: error.message };

  redirect(`/verify-email?email=${encodeURIComponent(parsed.data.email)}`);
}

export async function signIn(_prev: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) return { error: error.message };

  let profile = await prisma.profile.findUnique({ where: { id: data.user.id } });
  if (!profile) {
    await ensureProfileForUser(
      data.user.id,
      data.user.email!,
      data.user.user_metadata ?? {},
    );
    profile = await prisma.profile.findUnique({ where: { id: data.user.id } });
  }
  redirect(profile ? dashboardPathFor(profile.role) : "/");
}

export async function signOut() {
  const supabase = createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/");
}

// Used by /auth/callback to ensure the Profile row exists after email verification.
export async function ensureProfileForUser(userId: string, email: string, metadata: Record<string, unknown>) {
  const rawRole = metadata.role;
  const role: Role =
    rawRole === "TEACHER" || rawRole === "ADMIN" ? (rawRole as Role) : Role.STUDENT;

  await prisma.profile.upsert({
    where: { id: userId },
    create: {
      id: userId,
      email,
      fullName: typeof metadata.full_name === "string" ? metadata.full_name : null,
      phone: typeof metadata.phone === "string" ? metadata.phone : null,
      role,
    },
    update: {},
  });

  if (role === Role.TEACHER) {
    const subjectTags = typeof metadata.subject === "string" && metadata.subject
      ? metadata.subject.split(",").map((s: string) => s.trim())
      : [];
    const bio = typeof metadata.bio === "string" ? metadata.bio : null;
    await prisma.teacherProfile.upsert({
      where: { userId },
      create: { userId, subjectTags, bio },
      update: {},
    });
  }

  return role;
}
