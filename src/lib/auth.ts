import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function getCurrentUser() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  return prisma.profile.findUnique({ where: { id: user.id } });
}

export async function requireProfile() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/signin");
  return profile;
}

export function dashboardPathFor(role: Role) {
  switch (role) {
    case Role.TEACHER:
      return "/dashboard/teacher";
    case Role.ADMIN:
      return "/dashboard/admin";
    case Role.STUDENT:
    default:
      return "/dashboard/student";
  }
}
