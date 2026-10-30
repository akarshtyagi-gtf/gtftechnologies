import React from "react";
import { cn } from "@/utils/cn";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "div" | "span";
  children: React.ReactNode;
  className?: string;
}

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  as?: "p" | "div" | "span";
  children: React.ReactNode;
  className?: string;
}

/**
 * Reusable SectionHeading component
 * Default font: Voyage (Figma spec: 170px line-height 166.4px on 2xl)
 */
export function SectionHeading({
  as: Component = "h2",
  children,
  className,
  ...props
}: HeadingProps) {
  return (
    <Component
      className={cn(
        "font-voyage text-center font-normal tracking-normal text-[#121212] select-none leading-none",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Reusable SubHeading component
 * Default font: Segoe UI (Figma spec: 32px line-height 110% uppercase)
 */
export function SubHeading({
  as: Component = "h3",
  children,
  className,
  ...props
}: HeadingProps) {
  return (
    <Component
      className={cn(
        "font-segoe uppercase text-center font-normal tracking-normal text-[#171717] select-none",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

/**
 * Reusable Paragraph component
 * Default font: Segoe UI, clean editorial body styling
 */
export function Paragraph({
  as: Component = "p",
  children,
  className,
  ...props
}: ParagraphProps) {
  return (
    <Component
      className={cn(
        "font-segoe font-normal text-[#404040] leading-relaxed",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}
