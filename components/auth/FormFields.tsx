"use client";

import { useId, useState, type InputHTMLAttributes, type SelectHTMLAttributes, type ReactNode } from "react";

type FieldWrapperProps = {
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  floated?: boolean;
  success?: boolean;
  loading?: boolean;
  children: (id: string) => ReactNode;
};

export function FieldWrapper({ label, error, hint, required, floated, success, loading, children }: FieldWrapperProps) {
  const id = useId();
  return (
    <div className="auth-field auth-field-float">
      <div className="auth-input-wrap">
        {children(id)}
        <label htmlFor={id} className={floated ? "is-floated" : ""}>
          {label}
          {required && <span style={{ color: "#e5484d" }}> *</span>}
        </label>
        {loading && <span className="auth-field-spinner" aria-hidden="true" />}
        {!loading && success && !error && (
          <span className="auth-field-success" aria-hidden="true">
            <SuccessIcon />
          </span>
        )}
      </div>
      {error && (
        <p className="auth-error-text" role="alert">
          <ErrorIcon /> {error}
        </p>
      )}
      {!error && hint && <p className="auth-hint-text">{hint}</p>}
    </div>
  );
}

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  label: string;
  error?: string;
  hint?: string;
  success?: boolean;
  loading?: boolean;
};

export function TextField({ label, error, hint, required, success, loading, className, value, onFocus, onBlur, ...rest }: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} floated={focused || hasValue} success={success} loading={loading}>
      {(id) => (
        <input
          id={id}
          value={value}
          placeholder=" "
          className={`auth-input${error ? " has-error" : ""}${success && !error ? " has-success" : ""}${className ? " " + className : ""}`}
          required={required}
          disabled={loading || rest.disabled}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
      )}
    </FieldWrapper>
  );
}

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> & {
  label: string;
  error?: string;
  hint?: string;
};

export function PasswordField({ label, error, hint, required, value, onFocus, onBlur, ...rest }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [focused, setFocused] = useState(false);
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} floated={focused || hasValue}>
      {(id) => (
        <>
          <input
            id={id}
            value={value}
            type={visible ? "text" : "password"}
            placeholder=" "
            className={`auth-input${error ? " has-error" : ""}`}
            style={{ paddingRight: 44 }}
            required={required}
            onFocus={(e) => {
              setFocused(true);
              onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              onBlur?.(e);
            }}
            {...rest}
          />
          <button
            type="button"
            className="auth-password-toggle"
            aria-label={visible ? "Hide password" : "Show password"}
            aria-pressed={visible}
            onClick={() => setVisible((v) => !v)}
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </>
      )}
    </FieldWrapper>
  );
}

type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id"> & {
  label: string;
  error?: string;
  hint?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

export function SelectField({ label, error, hint, required, options, placeholder, ...rest }: SelectFieldProps) {
  return (
    <FieldWrapper label={label} error={error} hint={hint} required={required} floated>
      {(id) => (
        <select id={id} className={`auth-select${error ? " has-error" : ""}`} required={required} {...rest}>
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      )}
    </FieldWrapper>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="auth-checkbox">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

export function ErrorIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8v5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill="currentColor" />
    </svg>
  );
}

export function SuccessIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
      <path d="M8 12.5l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.4 5.3A10.6 10.6 0 0 1 12 5c6.5 0 10 7 10 7a13.2 13.2 0 0 1-3.15 3.9M6.5 6.9C4 8.6 2 12 2 12a13.4 13.4 0 0 0 5.6 5.7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Spinner({ dark }: { dark?: boolean }) {
  return <span className={`auth-spinner${dark ? " dark" : ""}`} role="status" aria-label="Loading" />;
}
