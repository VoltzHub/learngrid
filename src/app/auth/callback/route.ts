import { NextResponse, type NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureProfileForUser } from "@/lib/actions/auth";
import { dashboardPathFor } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${url.origin}/signin?error=missing_code`);
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    const msg = error?.message ?? "Could not verify your email link.";
    return NextResponse.redirect(`${url.origin}/signin?error=${encodeURIComponent(msg)}`);
  }

  const role = await ensureProfileForUser(
    data.user.id,
    data.user.email!,
    data.user.user_metadata ?? {},
  );

  const dest = next ?? dashboardPathFor(role);
  return NextResponse.redirect(`${url.origin}${dest}`);
}
