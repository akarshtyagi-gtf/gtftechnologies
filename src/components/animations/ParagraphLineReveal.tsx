"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { cn } from "@/utils/cn";

export interface ParagraphLineRevealProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  text?: string;
  children?: React.ReactNode;
  as?: React.ElementType;
  className?: string;
  triggerOnScroll?: boolean;
  animateOn?: boolean;
  start?: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  yOffset?: string | number;
  triggerRef?: React.RefObject<HTMLElement | null>;
  onComplete?: () => void;
}

/**
 * Reusable ParagraphLineReveal Component
 *
 * Implements a modern, masked paragraph line reveal animation.
 * Splits paragraph text line-by-line based on actual rendered dimensions.
 *
 * Key Features:
 * 1. Complete Typography Freedom: Font size, weight, color, line height,
 *    and alignment are 100% preserved and inherited from parent classes.
 * 2. Standalone or Timeline-Driven: Supports standalone ScrollTrigger
 *    or can be smoothly controlled by a master GSAP timeline via `.line-reveal-inner`.
 * 3. Responsive Re-calculation: Dynamically re-groups words into lines on window resize.
 * 4. SSR Safe: Initial HTML renders text cleanly for SEO with zero layout shift.
 */
export default function ParagraphLineReveal({
  text,
  children,
  as: Component = "p",
  className,
  triggerOnScroll = true,
  animateOn,
  start = "top 85%",
  delay = 0,
  duration = 0.75,
  stagger = 0.08,
  yOffset = "115%",
  triggerRef,
  onComplete,
  ...props
}: ParagraphLineRevealProps) {
  const containerRef = useRef<HTMLElement>(null);
  const isAnimatedRef = useRef<boolean>(false);
  const rawText = typeof children === "string" ? children : text || "";

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const el = containerRef.current;
    if (!el) return;

    // Preserve the original raw text for accurate resize recalculations
    const originalText = el.getAttribute("data-original-text") || rawText || el.innerText;
    if (!originalText || !originalText.trim()) return;
    el.setAttribute("data-original-text", originalText.trim());

    let resizeTimer: NodeJS.Timeout | null = null;
    let st: ScrollTrigger | null = null;

    const splitIntoLines = (preserveRevealedState: boolean = false) => {
      if (!el) return [];

      const words = originalText.trim().split(/\s+/);
      el.innerHTML = "";

      // Step 1: Render temporary word spans to measure offsetTop
      const wordSpans: HTMLSpanElement[] = [];
      const frag = document.createDocumentFragment();

      words.forEach((word, idx) => {
        const span = document.createElement("span");
        span.style.display = "inline-block";
        span.style.whiteSpace = "pre";
        span.textContent = word + (idx < words.length - 1 ? " " : "");
        frag.appendChild(span);
        wordSpans.push(span);
      });

      el.appendChild(frag);

      // Step 2: Group words with the same offsetTop into lines (tolerance 4px)
      const linesMap: { top: number; words: string[] }[] = [];
      wordSpans.forEach((span) => {
        const top = span.offsetTop;
        const existingLine = linesMap.find((line) => Math.abs(line.top - top) < 4);
        if (existingLine) {
          existingLine.words.push(span.textContent || "");
        } else {
          linesMap.push({ top, words: [span.textContent || ""] });
        }
      });

      // Step 3: Rebuild DOM with line-mask overflow containers
      el.innerHTML = "";
      const lineInnerElements: HTMLElement[] = [];
      const linesFrag = document.createDocumentFragment();

      linesMap.forEach((line) => {
        const maskSpan = document.createElement("span");
        maskSpan.className = "line-mask block overflow-hidden leading-normal";
        maskSpan.style.display = "block";
        maskSpan.style.overflow = "hidden";
        maskSpan.style.lineHeight = "inherit";

        const innerSpan = document.createElement("span");
        innerSpan.className = "line-reveal-inner block will-change-transform";
        innerSpan.style.display = "block";
        innerSpan.style.lineHeight = "inherit";
        innerSpan.textContent = line.words.join("");

        maskSpan.appendChild(innerSpan);
        linesFrag.appendChild(maskSpan);
        lineInnerElements.push(innerSpan);
      });

      el.appendChild(linesFrag);

      // If already revealed before resize, keep crisp visible state
      if (preserveRevealedState || isAnimatedRef.current) {
        gsap.set(lineInnerElements, {
          y: "0%",
          opacity: 1,
          filter: "blur(0px)",
        });
      } else {
        gsap.set(lineInnerElements, {
          y: yOffset,
          opacity: 0,
          filter: "blur(4px)",
        });
      }

      return lineInnerElements;
    };

    // Initial Split
    const lineElements = splitIntoLines(animateOn ?? false);

    // External animated state control (e.g. for dynamic portals/modals)
    if (animateOn !== undefined && lineElements.length > 0) {
      if (animateOn) {
        gsap.to(lineElements, {
          y: "0%",
          opacity: 1,
          filter: "blur(0px)",
          duration,
          ease: "power3.out",
          stagger,
          delay,
          onComplete: () => {
            isAnimatedRef.current = true;
            onComplete?.();
          },
        });
      } else {
        isAnimatedRef.current = false;
        gsap.to(lineElements, {
          y: yOffset,
          opacity: 0,
          filter: "blur(4px)",
          duration: duration * 0.5,
          ease: "power2.in",
        });
      }
    } else if (triggerOnScroll && lineElements.length > 0) {
      // Self-triggered mode using ScrollTrigger
      const trigger = triggerRef?.current || el;

      st = ScrollTrigger.create({
        trigger,
        start,
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(lineElements, {
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            duration,
            ease: "power3.out",
            stagger,
            delay,
            onComplete: () => {
              isAnimatedRef.current = true;
              onComplete?.();
            },
          });
        },
        onLeaveBack: () => {
          isAnimatedRef.current = false;
          gsap.to(lineElements, {
            y: yOffset,
            opacity: 0,
            filter: "blur(4px)",
            duration: duration * 0.5,
            ease: "power2.in",
          });
        },
      });
    }

    // Handle responsive resize with debouncing
    const handleResize = () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        splitIntoLines(isAnimatedRef.current);
      }, 150);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (resizeTimer) clearTimeout(resizeTimer);
      window.removeEventListener("resize", handleResize);
      if (st) st.kill();
    };
  }, [rawText, triggerOnScroll, animateOn, start, delay, duration, stagger, yOffset, triggerRef, onComplete]);

  return (
    <Component
      ref={containerRef as any}
      className={cn(
        "font-segoe font-normal text-[#404040] leading-relaxed",
        className
      )}
      {...props}
    >
      {rawText || children}
    </Component>
  );
}

