import Link from "next/link";

export default function VerifyEmailPage({
  searchParams,
}: {
  searchParams: { email?: string };
}) {
  return (
    <div className="auth-card">
      <h1>Check your inbox</h1>
      <p className="lead">
        We sent a verification link
        {searchParams.email ? <> to <strong>{searchParams.email}</strong></> : ""}.
        Click the link in the email to confirm your account and finish setup.
      </p>
      <p className="auth-foot">
        Didn&apos;t get an email? Check your spam folder, or{" "}
        <Link href="/signup">try signing up again</Link>.
      </p>
    </div>
  );
}
