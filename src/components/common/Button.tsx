"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "circle-arrow" | "pill" | "outline" | "solid";
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  loadingText?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Universal luxury Button component for GTF Technologies website.
 * Default variant "circle-arrow" matches the signature Figma design:
 * An arrow inside an outlined circle with uppercase tracked label.
 */
export default function Button({
  href,
  variant = "circle-arrow",
  iconPosition = "left",
  isLoading = false,
  loadingText,
  icon,
  children,
  className,
  disabled,
  type = "button",
  onClick,
  ...props
}: ButtonProps) {
  // Arrow Icon inside circular badge
  const renderCircleArrow = () => (
    <span
      className={cn(
        "relative w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full border border-black/40 flex items-center justify-center shrink-0 transition-all duration-300",
        "group-hover:border-[#121212] group-hover:bg-[#121212] group-hover:shadow-[0_2px_10px_rgba(0,0,0,0.15)]",
        "active:scale-90"
      )}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-3.5 w-3.5 text-[#121212] group-hover:text-white"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          />
        </svg>
      ) : icon ? (
        icon
      ) : (
        <svg
          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#121212] group-hover:text-white transition-all duration-300 transform group-hover:translate-x-0.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14" />
          <path d="M12 5l7 7-7 7" />
        </svg>
      )}
    </span>
  );

  const content = (
    <>
      {variant === "circle-arrow" && iconPosition === "left" && renderCircleArrow()}
      <span className="transition-transform duration-300 group-hover:translate-x-0.5">
        {isLoading && loadingText ? loadingText : children}
      </span>
      {variant === "circle-arrow" && iconPosition === "right" && renderCircleArrow()}
    </>
  );

  // Variant styling classes
  const variantStyles = {
    "circle-arrow":
      "inline-flex items-center gap-3 sm:gap-3.5 bg-transparent text-[#121212] font-segoe font-medium text-xs sm:text-[13px] tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed group",
    pill:
      "inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full bg-[#121212] text-white hover:bg-black font-segoe text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-50 group",
    outline:
      "inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-black/30 hover:border-black text-[#121212] font-segoe text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 hover:bg-black hover:text-white active:scale-95 disabled:opacity-50 group",
    solid:
      "inline-flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-[6px] bg-[#121212] text-white hover:bg-black font-segoe text-xs sm:text-[13px] font-semibold tracking-[0.14em] uppercase transition-all duration-300 shadow-sm active:scale-95 disabled:opacity-50 group",
  };

  const combinedClassName = cn(variantStyles[variant], className);

  if (href && !disabled) {
    if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
      return (
        <a href={href} className={combinedClassName}>
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={combinedClassName}
      {...props}
    >
      {content}
    </button>
  );
}
