"use client";

import React, {
  forwardRef,
  InputHTMLAttributes,
  ReactNode,
  useState,
  useId,
} from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Label for the input */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Optional helper text */
  helperText?: string;
  /** Icon displayed on the left side */
  leftIcon?: ReactNode;
  /** Icon displayed on the right side */
  rightIcon?: ReactNode;
  /** If true, renders a password field with a show/hide toggle */
  isPassword?: boolean;
  /** Whether the field is full width */
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      isPassword = false,
      fullWidth = true,
      className = "",
      id,
      type = "text",
      disabled,
      required,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const [showPassword, setShowPassword] = useState(false);

    // Determine the actual type for password toggle
    const inputType = isPassword
      ? showPassword
        ? "text"
        : "password"
      : type;

    const hasError = Boolean(error);

    return (
      <div className={`${fullWidth ? "w-full" : "inline-block"} space-y-1.5`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs sm:text-sm font-semibold text-slate-700 select-none"
          >
            {label}
            {required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative flex items-center">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}

          {/* Native Input */}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            disabled={disabled}
            required={required}
            aria-invalid={hasError ? "true" : undefined}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-helper`
                : undefined
            }
            className={`w-full h-11 rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-150 focus:outline-none ${
              leftIcon ? "pl-11" : ""
            } ${isPassword || rightIcon ? "pr-11" : ""} ${
              hasError
                ? "border-rose-400 bg-rose-50/20 text-rose-950 placeholder:text-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                : "border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20"
            } ${
              disabled
                ? "opacity-60 bg-slate-50 cursor-not-allowed hover:border-slate-300"
                : ""
            } ${className}`}
            {...props}
          />

          {/* Right Icon / Password Toggle */}
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          ) : rightIcon ? (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-slate-400">
              {rightIcon}
            </div>
          ) : null}
        </div>

        {/* Error Message */}
        {hasError ? (
          <p
            id={`${inputId}-error`}
            className="flex items-center gap-1.5 text-xs font-medium text-rose-500 mt-1"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : helperText ? (
          <p
            id={`${inputId}-helper`}
            className="text-xs text-slate-500 mt-1"
          >
            {helperText}
          </p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
