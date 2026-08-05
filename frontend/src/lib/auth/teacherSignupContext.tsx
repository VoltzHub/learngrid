"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type TeacherSignupState = {
  password: string;
  setPassword: (pw: string) => void;
  clear: () => void;
};

const TeacherSignupContext = createContext<TeacherSignupState | null>(null);

export function useTeacherSignup(): TeacherSignupState {
  const ctx = useContext(TeacherSignupContext);
  if (!ctx) {
    throw new Error("useTeacherSignup must be used inside the teacher signup layout");
  }
  return ctx;
}

export function TeacherSignupProvider({ children }: { children: ReactNode }) {
  const [password, setPassword] = useState("");
  const clear = () => setPassword("");
  return (
    <TeacherSignupContext.Provider value={{ password, setPassword, clear }}>
      {children}
    </TeacherSignupContext.Provider>
  );
}
