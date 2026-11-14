

"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";
import ContentReveal from "@/components/animations/ContentReveal";
import { setHeaderTheme } from "@/utils/headerTheme";
import type { OurTrustData } from "@/types/home";

interface OurTrustProps {
  data: OurTrustData;
}

const COLS = 3;
const ROWS = 5;
const MAX_PILLS = COLS * ROWS; // 15 pills = 5 rows x 3

export default function OurTrust({ data }: OurTrustProps) {
  const { tagline, headingPrefix, headingHighlight, description, items } = data;

  // only the first 15 logos are shown (3 per row, 5 rows)
  const pillItems = items.slice(0, MAX_PILLS);

  const sectionRef = useRef<HTMLElement>(null);
  const headingCharsRef = useRef<HTMLHeadingElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const pills = pillRefs.current.filter(Boolean) as HTMLDivElement[];

    const ctx = gsap.context(() => {
      // ---- Heading char reveal (unchanged) ----
      const headingChars =
        headingCharsRef.current?.querySelectorAll<HTMLElement>(".trust-char-item");

      if (headingChars && headingChars.length > 0) {
        gsap.fromTo(
          headingChars,
          { opacity: 0, y: 30, filter: "blur(10px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.025,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // ---- Pills: respect reduced motion ----
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        gsap.set(pills, { y: 0, rotation: 0, opacity: 1 });
        return;
      }

      // ---- Pills: drop from the top, last row first ----
      // 1) measure how far each pill must start above the section's top edge
      gsap.set(pills, { y: 0, rotation: 0 });
      const sectionTop = section.getBoundingClientRect().top;
      const startY = pills.map((el) => {
        const r = el.getBoundingClientRect();
        return -(r.top - sectionTop + r.height + 20);
      });

      // 2) park them above the section (section has overflow-hidden, so they are clipped)
      pills.forEach((el, i) => {
        gsap.set(el, { y: startY[i], rotation: gsap.utils.random(-8, 8), opacity: 0 });
      });

      // 3) order: bottom row first (left -> right), then the row above, ... up to row 1
      const rowCount = Math.ceil(pills.length / COLS);
      const order: number[] = [];
      for (let r = rowCount - 1; r >= 0; r--) {
        for (let c = 0; c < COLS; c++) {
          const idx = r * COLS + c;
          if (idx < pills.length) order.push(idx);
        }
      }

      // 4) one-by-one timeline
      const tl = gsap.timeline({ paused: true });
      order.forEach((idx, k) => {
        const at = k * 0.14; // delay between each pill
        tl.to(pills[idx], { opacity: 1, duration: 0.5, ease: "power1.out" }, at);
        tl.to(
          pills[idx],
          { y: 0, rotation: 0, duration: 1.1, ease: "power3.out" }, // smooth glide, no bounce
          at
        );
      });
      tlRef.current = tl;

      // 5) play once when the section enters the viewport
      ScrollTrigger.create({
        trigger: section,
        start: "top 75%",
        once: true,
        onEnter: () => tl.play(),
      });

      // 6) Ensure header logo is in black theme when OurTrust arrives under header (<= 75px),
      // and returns to white theme when scrolling back up into OurWork's dark slider
      ScrollTrigger.create({
        trigger: section,
        start: "top 75px",
        end: "bottom top",
        onEnter: () => setHeaderTheme("light"),
        onEnterBack: () => setHeaderTheme("light"),
        onLeaveBack: () => setHeaderTheme("dark"),
      });
    }, section);

    return () => {
      ctx.revert();
      tlRef.current = null;
    };
  }, [pillItems.length]);

  return (
    <section
      id="trust"
      ref={sectionRef}
      className="relative w-full min-h-[480px] sm:min-h-[510px] lg:min-h-[540px] xl:min-h-[560px] bg-transparent overflow-hidden pt-14 sm:pt-16 lg:pt-28 pb-8 sm:pb-20 flex flex-col justify-start"
    >
      {/* Content: left text + right 3x4 pill grid */}
      <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto container-padding">
        <div className="flex flex-col lg:flex-row lg:items-stretch gap-10 lg:gap-10">

          {/* Left: Tagline, Heading, Paragraph */}
          <div className="w-full lg:w-[42%] max-w-xl flex flex-col justify-between min-h-[300px] sm:min-h-[340px] lg:min-h-[410px]">
            <div className="pt-2 sm:pt-4">
              <span className="font-segoe text-[11px] sm:text-xs font-semibold tracking-[0.24em] text-[#121212]/80 uppercase">
                {tagline}
              </span>

              <div className="mt-3 sm:mt-4 lg:mt-4.5">
                <h2
                  ref={headingCharsRef}
                  className="font-voyage text-4xl sm:text-5xl lg:text-[56px] xl:text-[66px] text-[#121212] font-normal tracking-tight flex flex-wrap items-baseline gap-x-2.5 sm:gap-x-3.5 will-change-[transform,filter,opacity]"
                  style={{ fontFamily: "var(--font-voyage), Voyage, serif" }}
                >
                  <span className="inline-flex items-baseline">
                    {splitTextChars(headingPrefix).map((item, idx) => (
                      <span
                        key={`pre-${idx}`}
                        className="trust-char-item inline-block will-change-[transform,filter,opacity]"
                      >
                        {item.char}
                      </span>
                    ))}
                  </span>

                  <span className="relative inline-flex items-baseline px-2.5 sm:px-3.5 py-0.5 sm:py-1 bg-[#FFF078] text-[#121212] rounded-[6px] shadow-[0_2px_10px_-2px_rgba(253,224,71,0.4)]">
                    {splitTextChars(headingHighlight).map((item, idx) => (
                      <span
                        key={`high-${idx}`}
                        className="trust-char-item inline-block will-change-[transform,filter,opacity]"
                      >
                        {item.char}
                      </span>
                    ))}
                  </span>
                </h2>
              </div>
            </div>

            <div className="mt-10 sm:mt-14 lg:mt-12 pb-2 sm:pb-3 max-w-sm sm:max-w-md">
              <ContentReveal triggerOnScroll duration={0.7} yOffset={14} blurAmount={6}>
                <p className="font-segoe text-xs sm:text-sm lg:text-[17px] text-[#444444] font-normal leading-relaxed">
                  {description}
                </p>
              </ContentReveal>
            </div>
          </div>

          {/* Right: 3 pills per row, 4 rows */}
          <div className="w-full lg:flex-1 grid grid-cols-3 gap-3 sm:gap-4 lg:gap-5 content-center justify-items-center">
            {pillItems.map((item, idx) => (
              <div
                key={item.id}
                ref={(el) => {
                  pillRefs.current[idx] = el;
                }}
                className="w-full max-w-[174px]  will-change-transform"
                style={{ opacity: 0 }} // hidden until its turn (GSAP shows it)
              >
                <div className="relative w-full h-[48px] sm:h-[52px] lg:h-[56px] xl:h-[62px] rounded-full bg-white shadow-[0_4px_16px_-3px_rgba(0,0,0,0.08),0_1px_4px_-1px_rgba(0,0,0,0.03)] border border-black/[0.04] flex items-center justify-center px-2 py-0.5 overflow-hidden">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={140}
                      height={48}
                      className="w-full h-full object-contain scale-[1.30] select-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}