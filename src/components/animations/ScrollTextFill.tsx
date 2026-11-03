"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

export interface ScrollTextFillProps {
  text: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "div" | "span";
  className?: string;
  wordClassName?: string;
  unfillColor?: string;
  fillColor?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Reusable ScrollTextFill Component
 * Splits paragraph text into individual words that progressively transition from
 * an unfilled/muted color to a solid filled color as the user scrolls into view.
 */
export default function ScrollTextFill({
  text,
  as: Component = "p",
  className = "",
  wordClassName = "",
  unfillColor = "rgba(21, 20, 21, 0.2)",
  fillColor = "#151415",
  start = "top 85%",
  end = "bottom 45%",
  scrub = 0.8,
  triggerRef,
}: ScrollTextFillProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    const words = el.querySelectorAll<HTMLElement>(".scroll-fill-word");
    if (!words || words.length === 0) return;

    // Set initial unfill state
    gsap.set(words, {
      color: unfillColor,
      opacity: 0.35,
    });

    const trigger = triggerRef?.current || el;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start,
        end,
        scrub,
      },
    });

    tl.to(words, {
      color: fillColor,
      opacity: 1,
      stagger: {
        amount: 1.0,
        ease: "none",
      },
      ease: "none",
    });

    return () => {
      tl.kill();
    };
  }, [unfillColor, fillColor, start, end, scrub, triggerRef]);

  const words = text.split(/\s+/).filter(Boolean);

  return (
    <Component
      ref={containerRef as any}
      className={`leading-relaxed select-none ${className}`}
    >
      {words.map((word, idx) => (
        <span
          key={`stf-${idx}-${word}`}
          className={`scroll-fill-word inline-block will-change-[color,opacity] transition-colors ${wordClassName}`}
        >
          {word}
          {idx < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </Component>
  );
}
