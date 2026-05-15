"use client";

import { useId, useState, type InputHTMLAttributes } from "react";
import { Icon } from "@/components/Icons";
import { scorePassword } from "@/lib/auth/validation";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  required?: boolean;
  showStrength?: boolean;
  hint?: string;
  error?: string;
  successText?: string;
};

export function PasswordField({
  label,
  required,
  showStrength = false,
  hint,
  error,
  successText,
  value,
  id,
  ...rest
}: Props) {
  const [visible, setVisible] = useState(false);
  const reactId = useId();
  const fieldId = id ?? reactId;
  const hintId = `${fieldId}-hint`;
  const errId = `${fieldId}-err`;
  const pwValue = typeof value === "string" ? value : "";
  const meter = showStrength ? scorePassword(pwValue) : null;
  const invalid = Boolean(error);

  return (
    <div className="form-group">
      <label className="form-label" htmlFor={fieldId}>
        {label} {required && <span className="required">*</span>}
      </label>
      <div className="input-with-action">
        <input
          id={fieldId}
          className={`form-input${invalid ? " error" : ""}`}
          type={visible ? "text" : "password"}
          required={required}
          value={value}
          {...(invalid ? ({ "aria-invalid": "true" } as const) : {})}
          aria-describedby={invalid ? errId : hint ? hintId : undefined}
          {...rest}
        />
        <button
          type="button"
          className="input-action-btn"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible ? "true" : "false"}
          tabIndex={-1}
        >
          <Icon name={visible ? "eyeOff" : "eye"} size={16} />
        </button>
      </div>
      {showStrength && pwValue ? (
        <>
          <div className="password-meter" data-strength={meter?.strength ?? undefined} aria-hidden="true">
            <span className="password-meter-bar" />
            <span className="password-meter-bar" />
            <span className="password-meter-bar" />
          </div>
          <p className="password-meter-label" data-strength={meter?.strength ?? undefined}>
            {meter?.label}
          </p>
        </>
      ) : hint ? (
        <p id={hintId} className="form-hint">{hint}</p>
      ) : null}
      {invalid ? (
        <p id={errId} className="form-error">{error}</p>
      ) : successText ? (
        <p className="form-success">
          <Icon name="check" size={14} /> {successText}
        </p>
      ) : null}
    </div>
  );
}
