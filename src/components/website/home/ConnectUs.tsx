"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";
import { setHeaderTheme } from "@/utils/headerTheme";
import {
  charBlurInitialVars,
  charBlurAnimateVars,
} from "@/components/animations/CharBlurDissolveHeading";
import type { ConnectUsData } from "@/types/home";

interface ConnectUsProps {
  data: ConnectUsData;
}

export default function ConnectUs({ data }: ConnectUsProps) {
  const { prefixText, title, imageSrc, imageAlt } = data;

  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const prefixCharsRef = useRef<HTMLDivElement>(null);
  const titleCharsRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Heading chars initial state (Char Blur Dissolve)
      const prefixChars =
        prefixCharsRef.current?.querySelectorAll<HTMLElement>(
          ".connect-prefix-char"
        );
      const titleChars =
        titleCharsRef.current?.querySelectorAll<HTMLElement>(
          ".connect-title-char"
        );

      if (prefixChars && prefixChars.length > 0) {
        gsap.set(prefixChars, charBlurInitialVars);
      }
      if (titleChars && titleChars.length > 0) {
        gsap.set(titleChars, charBlurInitialVars);
      }

      // 2. Card container initial state
      if (cardRef.current) {
        gsap.set(cardRef.current, {
          opacity: 0,
          y: 35,
          scale: 0.98,
        });
      }

      // Master ScrollTrigger timeline
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // A. Card reveal
      if (cardRef.current) {
        masterTl.to(
          cardRef.current,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.0,
            ease: "power2.out",
          },
          0
        );
      }

      // B. Reveal "Where" prefix characters
      if (prefixChars && prefixChars.length > 0) {
        masterTl.to(
          prefixChars,
          {
            ...charBlurAnimateVars,
            duration: 0.85,
            stagger: {
              from: "start",
              amount: 0.22,
              ease: "power2.out",
            },
          },
          0.15
        );
      }

      // C. Reveal "Ideas Connect." title characters
      if (titleChars && titleChars.length > 0) {
        masterTl.to(
          titleChars,
          {
            ...charBlurAnimateVars,
            duration: 1.05,
            stagger: {
              from: "start",
              amount: 0.38,
              ease: "power2.out",
            },
          },
          0.28
        );
      }

      // Parallax effect on image inside card during scroll
      if (imageInnerRef.current) {
        gsap.to(imageInnerRef.current, {
          yPercent: 8,
          ease: "none",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // Dynamic header logo theme: White logo when dark card is under header, dark logo when outside
      if (cardRef.current) {
        ScrollTrigger.create({
          trigger: cardRef.current,
          start: "top 75px",
          end: "bottom 25px",
          onEnter: () => setHeaderTheme("dark"),
          onEnterBack: () => setHeaderTheme("dark"),
          onLeave: () => setHeaderTheme("light"),
          onLeaveBack: () => setHeaderTheme("light"),
        });
      }
    }, sectionRef);

    return () => {
      setHeaderTheme("light");
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="connect-us"
      ref={sectionRef}
      className="relative w-full bg-transparent overflow-hidden select-none py-12 sm:py-16 lg:py-20 xl:py-24"
    >
      {/* Main Container */}
      <div className="relative z-10 w-full max-w-[1440px] xl:max-w-[1560px] 2xl:max-w-[1680px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* Rounded Image Card Banner */}
        <div
          ref={cardRef}
          data-header-theme="dark"
          className="relative w-full aspect-[16/9] min-h-[360px] sm:min-h-[460px] lg:min-h-[560px] xl:min-h-[640px] rounded-[20px] sm:rounded-[28px] lg:rounded-[36px] overflow-hidden shadow-[0_16px_50px_-15px_rgba(0,0,0,0.18)] will-change-[transform,opacity]"
        >
          {/* Inner Image with subtle Parallax */}
          <div
            ref={imageInnerRef}
            className="absolute inset-[-8%] w-[116%] h-[116%] will-change-transform"
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 1680px"
              className="object-cover object-center"
            />
          </div>

          {/* Vignette Gradient Overlay for Editorial Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/5 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none z-10" />

          {/* Bottom Left Editorial Title */}
          <div className="absolute bottom-0 left-0 p-6 sm:p-10 lg:p-14 xl:p-16 z-20 text-white">
            {/* Line 1: Where */}
            <div
              ref={prefixCharsRef}
              className="font-voyage italic text-2xl sm:text-3xl lg:text-4xl xl:text-[55px] leading-tight text-white/95 mb-0.5 sm:mb-1 will-change-[transform,opacity,filter] [perspective:1200px]"
            >
              {splitTextChars(prefixText).map((item, idx) => (
                <span
                  key={`pref-${idx}`}
                  className="connect-prefix-char inline-block will-change-[transform,filter,opacity]"
                >
                  {item.char}
                </span>
              ))}
            </div>

            {/* Line 2: Ideas Connect. */}
            <h2
              ref={titleCharsRef}
              className="font-voyage text-4xl sm:text-6xl lg:text-[76px] xl:text-[140px] 2xl:text-[150px] text-white font-normal leading-[0.98] sm:leading-[1.0] tracking-tight will-change-[transform,opacity,filter] [perspective:1200px]"
            >
              {splitTextChars(title).map(
                (item, idx) => (
                  <span
                    key={`tit-${idx}`}
                    className="connect-title-char inline-block will-change-[transform,filter,opacity]"
                  >
                    {item.char}
                  </span>
                )
              )}
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
