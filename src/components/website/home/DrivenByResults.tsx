"use client";

import React, { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";
import { Paragraph } from "@/components/common/Typography";
import ContentReveal from "@/components/animations/ContentReveal";
import {
  charBlurInitialVars,
  charBlurAnimateVars,
} from "@/components/animations/CharBlurDissolveHeading";
import type { DrivenByResultsData } from "@/types/home";

interface DrivenByResultsProps {
  data: DrivenByResultsData;
}

export default function DrivenByResults({ data }: DrivenByResultsProps) {
  const {
    tagline,
    headingLine1,
    headingLine2Highlight,
    description,
    videoSrc,
    posterSrc,
  } = data;

  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);
  const headingCharsRef = useRef<HTMLHeadingElement>(null);
  const highlightBoxRef = useRef<HTMLSpanElement>(null);

  // 1. Video Lazy Loading & Viewport-aware Play/Pause
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Lazy load video source on approach
            if (!video.src && video.dataset.src) {
              video.src = video.dataset.src;
              video.load();
            }
            video.play().catch(() => {
              // Gracefully handle browser autoplay policies
            });
          } else {
            // Pause when out of view to save CPU and battery
            if (video.src) {
              video.pause();
            }
          }
        });
      },
      {
        rootMargin: "250px 0px", // Preload slightly before scrolling into view
        threshold: 0.1,
      }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  // 2. Master ScrollTrigger Animations
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Heading characters initial state
      const headingChars =
        headingCharsRef.current?.querySelectorAll<HTMLElement>(
          ".results-char-item"
        );
      if (headingChars && headingChars.length > 0) {
        gsap.set(headingChars, charBlurInitialVars);
      }

      // Tagline initial state
      if (taglineRef.current) {
        gsap.set(taglineRef.current, {
          opacity: 0,
          y: 16,
          filter: "blur(6px)",
        });
      }

      // Highlight capsule initial state
      if (highlightBoxRef.current) {
        gsap.set(highlightBoxRef.current, {
          opacity: 0,
          scale: 0.94,
          filter: "blur(8px)",
        });
      }

      // Master ScrollTrigger Timeline
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // A. Reveal Tagline
      if (taglineRef.current) {
        masterTl.to(
          taglineRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            ease: "power2.out",
          },
          0
        );
      }

      // B. Reveal Heading Characters
      if (headingChars && headingChars.length > 0) {
        masterTl.to(
          headingChars,
          {
            ...charBlurAnimateVars,
            duration: 0.9,
            stagger: {
              from: "start",
              amount: 0.35,
              ease: "power2.out",
            },
          },
          0.08
        );
      }

      // C. Reveal Highlight Box on "Results"
      if (highlightBoxRef.current) {
        masterTl.to(
          highlightBoxRef.current,
          {
            opacity: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
          },
          0.2
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="driven-by-results"
      ref={sectionRef}
      className="relative z-[2] w-full bg-[#F8F6F0] overflow-hidden select-none flex items-center py-14 sm:py-16 md:py-0 md:aspect-[16/9] md:max-h-[850px] 2xl:max-h-[920px]"
    >
      {/* ============================================================== */}
      {/* 1. BACKGROUND 3D VIDEO (16:9 aspect ratio, Autoplay & Lazy)    */}
      {/* ============================================================== */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <video
          ref={videoRef}
          data-src={videoSrc}
          poster={posterSrc}
          muted
          loop
          playsInline
          autoPlay
          preload="none"
          className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none will-change-transform"
          aria-hidden="true"
        />
      </div>

      {/* ============================================================== */}
      {/* 2. FOREGROUND CONTENT (Left Aligned matching Figma layout)    */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-[1440px] xl:max-w-[1600px] 2xl:max-w-[1760px] mx-auto container-padding flex flex-col justify-center">
        <div className="w-full max-w-[540px] lg:max-w-[480px] xl:max-w-[540px] flex flex-col items-start text-left">
          {/* A. Tagline */}
          <div
            ref={taglineRef}
            className="will-change-[transform,opacity,filter] mb-2 sm:mb-2.5 lg:mb-3.5"
          >
            <span className="font-segoe uppercase text-[10px] sm:text-[11px] lg:text-xs tracking-[0.24em] text-[#6E6E6E] font-medium">
              {tagline}
            </span>
          </div>

          {/* B. Main Heading: Driven By (line 1) + Results (line 2 highlight) */}
          <h2
            ref={headingCharsRef}
            className="font-voyage text-[36px] sm:text-[46px] md:text-[48px] lg:text-[56px] xl:text-[68px] 2xl:text-[76px] text-[#121212] font-normal leading-[1.06] tracking-tight will-change-[transform,opacity,filter] [perspective:1200px]"
          >
            <span className="block">
              {splitTextChars(headingLine1).map(
                (item, idx) => (
                  <span
                    key={`res-l1-${idx}`}
                    className="results-char-item inline-block will-change-[transform,filter,opacity]"
                  >
                    {item.char}
                  </span>
                )
              )}
            </span>

            <span className="inline-block mt-0.5 sm:mt-1">
              <span
                ref={highlightBoxRef}
                className="inline-block bg-[#FDEBB5] px-2 sm:px-3 py-0.5 sm:py-0.5 rounded-[4px] sm:rounded-[6px] text-[#121212] shadow-[0_2px_12px_rgba(253,235,181,0.45)] will-change-[transform,opacity,filter]"
              >
                {splitTextChars(headingLine2Highlight).map(
                  (item, idx) => (
                    <span
                      key={`res-l2-${idx}`}
                      className="results-char-item inline-block will-change-[transform,filter,opacity]"
                    >
                      {item.char}
                    </span>
                  )
                )}
              </span>
            </span>
          </h2>

          {/* C. Proportional Spacing matching Figma + Description Paragraph */}
          <div className="w-full max-w-[320px] sm:max-w-[360px] lg:max-w-[540px] pt-8 sm:pt-12 md:pt-14 lg:pt-20 xl:pt-28 2xl:pt-36">
            <ContentReveal
              triggerOnScroll
              duration={0.7}
              yOffset={18}
              blurAmount={8}
            >
              <Paragraph className="text-[#333333]/90 text-[12px] sm:text-[13px] lg:text-[16px] leading-[1.65] font-segoe font-normal">
                {description}
              </Paragraph>
            </ContentReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
