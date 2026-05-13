import { redirect } from "next/navigation";
import SignupRolePicker from "./role-picker";

export default function SignupPage({
  searchParams,
}: {
  searchParams: { role?: string };
}) {
  if (searchParams.role === "teacher") redirect("/signup/teacher");
  if (searchParams.role === "student") redirect("/signup/student");
  return <SignupRolePicker />;
}
