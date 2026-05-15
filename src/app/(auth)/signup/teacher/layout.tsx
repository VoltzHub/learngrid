import type { ReactNode } from "react";
import { TeacherSignupProvider } from "@/lib/auth/teacherSignupContext";

export default function TeacherSignupLayout({ children }: { children: ReactNode }) {
  return <TeacherSignupProvider>{children}</TeacherSignupProvider>;
}
