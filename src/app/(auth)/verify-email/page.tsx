import Link from "next/link";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="auth-card">
      <h1>Check your inbox</h1>
      <p className="lead">
        We sent a verification link
        {sp.email ? <> to <strong>{sp.email}</strong></> : ""}.
        Click the link in the email to confirm your account and finish setup.
      </p>
      <p className="auth-foot">
        Didn&apos;t get an email? Check your spam folder, or{" "}
        <Link href="/signup">try signing up again</Link>.
      </p>
    </div>
  );
}
