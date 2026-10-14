"use client";

import React, { forwardRef, ButtonHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "underline"
  | "danger";

export type ButtonSize = "xs" | "sm" | "md" | "lg" | "xl" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual variant style of the button */
  variant?: ButtonVariant;
  /** Size variant */
  size?: ButtonSize;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Optional text to display while loading */
  loadingText?: string;
  /** Icon to display on the left side */
  leftIcon?: ReactNode;
  /** Icon to display on the right side */
  rightIcon?: ReactNode;
  /** Stretch button to full width of parent container */
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 hover:from-blue-500 hover:via-blue-400 hover:to-indigo-500 text-white shadow-lg shadow-blue-600/25 border border-blue-400/30 hover:shadow-blue-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
  secondary:
    "bg-slate-800 hover:bg-slate-700 text-slate-100 hover:text-white border border-slate-700/70 hover:border-slate-600 shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
  outline:
    "bg-transparent hover:bg-blue-600/10 text-blue-400 hover:text-blue-300 border border-blue-500/40 hover:border-blue-400 active:scale-[0.98]",
  ghost:
    "bg-transparent hover:bg-white/10 text-slate-300 hover:text-white border border-transparent active:scale-[0.98]",
  underline:
    "bg-transparent text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-500/60 hover:decoration-blue-400 p-0 h-auto font-medium hover:opacity-90 active:scale-[0.98]",
  danger:
    "bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white shadow-lg shadow-rose-600/25 border border-rose-400/30 hover:shadow-rose-500/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]",
};

const sizeStyles: Record<ButtonSize, string> = {
  xs: "px-2.5 py-1 text-xs rounded-md gap-1.5",
  sm: "px-3 py-1.5 text-xs sm:text-sm rounded-lg gap-2",
  md: "px-4 py-2 text-sm sm:text-base rounded-xl gap-2.5",
  lg: "px-5 py-2.5 text-base sm:text-lg rounded-xl gap-3",
  xl: "px-6 py-3.5 text-lg sm:text-xl rounded-2xl gap-3.5 font-semibold",
  icon: "h-10 w-10 p-0 rounded-xl justify-center items-center",
};

const spinnerSizes: Record<ButtonSize, string> = {
  xs: "w-3 h-3",
  sm: "w-3.5 h-3.5",
  md: "w-4 h-4",
  lg: "w-5 h-5",
  xl: "w-6 h-6",
  icon: "w-5 h-5",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = "",
      children,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isUnderline = variant === "underline";
    const isDisabled = disabled || isLoading;

    return (
      <button
        ref={ref}
        type={type}
        disabled={isDisabled}
        aria-busy={isLoading}
        className={`inline-flex items-center justify-center font-medium transition-all duration-200 select-none cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
          variantStyles[variant]
        } ${!isUnderline ? sizeStyles[size] : ""} ${
          fullWidth ? "w-full" : ""
        } ${
          isDisabled
            ? "opacity-55 cursor-not-allowed pointer-events-none filter grayscale-[25%]"
            : ""
        } ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2
              className={`animate-spin shrink-0 ${spinnerSizes[size]}`}
            />
            {loadingText ? (
              <span>{loadingText}</span>
            ) : isUnderline ? (
              children
            ) : (
              <span>{children}</span>
            )}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="shrink-0 flex items-center justify-center">
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span className="shrink-0 flex items-center justify-center">
                {rightIcon}
              </span>
            )}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
