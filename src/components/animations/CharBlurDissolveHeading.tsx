"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";

/**
 * Shared initial and animation parameters for the signature Char Blur Dissolve effect
 * Exactly matching the OurWork section heading animation.
 */
export const charBlurInitialVars: gsap.TweenVars = {
  opacity: 0,
  filter: "blur(36px)",
  scale: 3.5,
  z: 500,
  y: -220,
  transformOrigin: "center center",
};

export const charBlurAnimateVars: gsap.TweenVars = {
  opacity: 1,
  filter: "blur(0px)",
  scale: 1,
  z: 0,
  y: 0,
  duration: 1.0,
  ease: "power3.out",
  stagger: {
    from: "center",
    amount: 0.3,
    ease: "power2.out",
  },
};

export interface CharBlurDissolveHeadingProps {
  text: string;
  className?: string;
  charClassName?: string;
  triggerRef?: React.RefObject<HTMLElement | null>;
  start?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "h4" | "div" | "span";
  gradient?: boolean;
}

/**
 * Reusable CharBlurDissolveHeading Component
 * Implements the grand, character-by-character blur dissolve hero intro animation
 * as seen on OurWork and OurServices.
 */
export default function CharBlurDissolveHeading({
  text,
  className = "",
  charClassName = "char-blur-item",
  triggerRef,
  start = "top 75%",
  delay = 0,
  as: Component = "h2",
  gradient = false,
}: CharBlurDissolveHeadingProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLElement>(`.${charClassName}`);
    if (!chars || chars.length === 0) return;

    // Apply the exact signature initial state
    gsap.set(chars, charBlurInitialVars);

    const trigger = triggerRef?.current || el;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start,
        toggleActions: "play none none reverse",
      },
      delay,
    });

    tl.to(chars, charBlurAnimateVars, 0);

    return () => {
      tl.kill();
    };
  }, [triggerRef, start, delay, charClassName]);

  const items = splitTextChars(text);

  return (
    <Component
      ref={containerRef as any}
      className={`will-change-[transform,opacity,filter] [perspective:1200px] [transform-style:preserve-3d] ${className}`}
    >
      {items.map((item, idx) => (
        <span
          key={`char-${idx}`}
          className={`inline-block will-change-[transform,filter,opacity] ${charClassName}`}
          style={
            gradient
              ? {
                  background:
                    "linear-gradient(183.05deg, #000000 2.53%, rgba(0, 0, 0, 0.62) 70.11%, rgba(0, 0, 0, 0) 94.16%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
              : undefined
          }
        >
          {item.char}
        </span>
      ))}
    </Component>
  );
}
