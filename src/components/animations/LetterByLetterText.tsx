"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

export interface LetterByLetterTextProps {
  text: string;
  as?: "p" | "h1" | "h2" | "h3" | "h4" | "div" | "span";
  className?: string;
  charClassName?: string;
  start?: string;
  end?: string;
  delay?: number;
  stagger?: number;
  scrub?: boolean | number;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

/**
 * Reusable LetterByLetterText Component
 * Types / reveals text letter-by-letter with word-break safety,
 * triggered when scrolled into view or scrubbed with scroll.
 */
export default function LetterByLetterText({
  text,
  as: Component = "p",
  className = "",
  charClassName = "",
  start = "top 78%",
  end = "bottom 55%",
  delay = 0.1,
  stagger = 0.018,
  scrub = false,
  triggerRef,
}: LetterByLetterTextProps) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    const chars = el.querySelectorAll<HTMLElement>(".letter-char-item");
    if (!chars || chars.length === 0) return;

    // Initial state: letter is offset in wave position with soft blur and 3D angle
    gsap.set(chars, {
      opacity: 0,
      y: 22,
      rotateX: -25,
      filter: "blur(5px)",
      transformOrigin: "50% 100%",
    });

    const trigger = triggerRef?.current || el;

    let tl: gsap.core.Timeline;

    if (scrub) {
      tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start,
          end,
          scrub: scrub === true ? 0.6 : scrub,
        },
      });

      tl.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        stagger: {
          amount: 1.2,
          ease: "none",
        },
        ease: "power2.out",
      });
    } else {
      tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start,
          toggleActions: "play none none none",
        },
        delay,
      });

      // Smooth wave motion that ripples across letters and settles with a soft spring
      tl.to(chars, {
        opacity: 1,
        y: 0,
        rotateX: 0,
        filter: "blur(0px)",
        duration: 0.55,
        stagger: {
          each: stagger,
          ease: "sine.inOut",
        },
        ease: "back.out(1.2)",
      });
    }

    return () => {
      tl.kill();
    };
  }, [start, end, delay, stagger, scrub, triggerRef]);

  // Split into words first to preserve natural line wrapping and prevent mid-word breaks
  const words = text.split(" ");

  const hasLeading = className.includes("leading-");

  return (
    <Component
      ref={containerRef as any}
      className={`${hasLeading ? "" : "leading-relaxed"} select-none [perspective:1000px] ${className}`}
    >
      {words.map((word, wIdx) => (
        <span
          key={`lbl-w-${wIdx}-${word}`}
          className="inline-block whitespace-nowrap"
        >
          {word.split("").map((char, cIdx) => (
            <span
              key={`lbl-c-${wIdx}-${cIdx}`}
              className={`letter-char-item inline-block will-change-[transform,opacity,filter] ${charClassName}`}
            >
              {char}
            </span>
          ))}
          {wIdx < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </Component>
  );
}
