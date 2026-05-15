export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Nigerian mobile (after stripping country code/leading 0): 10 digits, starts
// with 7/8/9 and second digit is 0 or 1. Covers MTN, Glo, Airtel, 9mobile.
export const NG_MOBILE_LOCAL_RE = /^[789][01]\d{8}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

/** Accept "08012345678", "8012345678", "+2348012345678", "2348012345678" → "8012345678". */
export function normalizeLocalPhone(raw: string): string {
  let n = raw.replace(/\D/g, "");
  if (n.startsWith("234")) n = n.slice(3);
  if (n.startsWith("0")) n = n.slice(1);
  return n.slice(0, 10);
}

export function isValidNigerianMobile(local: string): boolean {
  return NG_MOBILE_LOCAL_RE.test(local);
}

export type PasswordStrength = "weak" | "fair" | "strong" | null;

export function scorePassword(pw: string): { strength: PasswordStrength; label: string } {
  if (!pw) return { strength: null, label: "" };
  const hasLength = pw.length >= 8;
  const hasNumber = /\d/.test(pw);
  const hasLetter = /[a-zA-Z]/.test(pw);
  const hasSymbol = /[^a-zA-Z0-9]/.test(pw);
  const hasLong = pw.length >= 12;
  const passing = [hasLength, hasNumber, hasLetter, hasSymbol, hasLong].filter(Boolean).length;
  if (!hasLength || !hasNumber) return { strength: "weak", label: "Weak — needs 8+ chars and a number" };
  if (passing >= 4) return { strength: "strong", label: "Strong password" };
  return { strength: "fair", label: "Fair — add a symbol for a stronger password" };
}

/** Find the first invalid field in a form (aria-invalid="true") and focus + scroll it. */
export function focusFirstInvalid(formEl: HTMLFormElement | null): void {
  if (!formEl) return;
  const target = formEl.querySelector<HTMLElement>(
    '[aria-invalid="true"]:not([disabled])',
  );
  if (!target) return;
  target.focus({ preventScroll: true });
  target.scrollIntoView({ behavior: "smooth", block: "center" });
}
