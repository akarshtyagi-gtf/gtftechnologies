"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/utils/gsap";

export interface ContentRevealProps {
  children: React.ReactNode;
  triggerKey?: string | number;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  yOffset?: number;
  blurAmount?: number;
  stagger?: number;
  triggerOnScroll?: boolean;
  scrollTriggerStart?: string;
}

/**
 * Common ContentReveal Component
 * Reusable across the website for silky-smooth content transitions (headings, paragraphs, badges).
 * Provides a graceful blur-and-slide transition with stagger animation across child elements.
 */
export default function ContentReveal({
  children,
  triggerKey,
  as: Component = "div",
  className = "",
  duration = 0.5,
  yOffset = 16,
  blurAmount = 10,
  stagger = 0.05,
  triggerOnScroll = false,
  scrollTriggerStart = "top 80%",
}: ContentRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [displayChildren, setDisplayChildren] = useState(children);
  const isFirstRender = useRef(true);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      setDisplayChildren(children);
      return;
    }

    // Scroll-triggered common content reveal animation
    if (triggerOnScroll) {
      if (typeof window !== "undefined") {
        gsap.registerPlugin(ScrollTrigger);
      }
      const targets = el.children.length > 1 ? Array.from(el.children) : el;
      gsap.set(targets, {
        opacity: 0,
        y: yOffset,
        filter: `blur(${blurAmount}px)`,
      });

      const st = ScrollTrigger.create({
        trigger: el,
        start: scrollTriggerStart,
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration,
            ease: "power2.out",
            stagger: el.children.length > 1 ? stagger : 0,
          });
        },
      });

      return () => {
        st.kill();
      };
    }

    if (isFirstRender.current) {
      isFirstRender.current = false;
      setDisplayChildren(children);
      return;
    }

    const tl = gsap.timeline();

    // 1. Exit animation: subtle upward fade & blur
    const targets = el.children.length > 1 ? Array.from(el.children) : el;
    tl.to(targets, {
      opacity: 0,
      y: -yOffset * 0.5,
      filter: `blur(${blurAmount}px)`,
      duration: duration * 0.35,
      ease: "power2.in",
      stagger: el.children.length > 1 ? stagger * 0.5 : 0,
      onComplete: () => {
        setDisplayChildren(children);
      },
    });

    // 2. Entry animation: staggered reveal with blur clearing
    tl.add(() => {
      const currentTargets =
        el.children.length > 1 ? Array.from(el.children) : el;
      gsap.fromTo(
        currentTargets,
        {
          opacity: 0,
          y: yOffset,
          filter: `blur(${blurAmount}px)`,
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: duration * 0.65,
          ease: "power2.out",
          stagger: el.children.length > 1 ? stagger : 0,
        }
      );
    });

    return () => {
      tl.kill();
    };
  }, [
    triggerKey,
    children,
    duration,
    yOffset,
    blurAmount,
    stagger,
    triggerOnScroll,
    scrollTriggerStart,
  ]);

  return (
    <Component
      ref={containerRef}
      className={`will-change-[transform,opacity,filter] ${className}`}
    >
      {displayChildren}
    </Component>
  );
}
