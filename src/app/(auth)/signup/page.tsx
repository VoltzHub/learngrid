import { redirect } from "next/navigation";
import SignupRolePicker from "./role-picker";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
  const sp = await searchParams;
  if (sp.role === "teacher") redirect("/signup/teacher");
  if (sp.role === "student") redirect("/signup/student");
  return <SignupRolePicker />;
}
