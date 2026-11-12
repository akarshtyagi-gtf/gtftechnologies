"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";
import { SectionHeading, SubHeading } from "@/components/common/Typography";
import { WorkCenterSlider } from "./WorkCenterSlider";
import type { OurWorkData, WorkCard } from "@/types/home";

interface OurWorkProps {
  data: OurWorkData;
}

export default function OurWork({ data }: OurWorkProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const headingWrapperRef = useRef<HTMLDivElement>(null);
  const subheadingRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);

  const galleryWrapperRef = useRef<HTMLDivElement>(null);
  const colLeftRef = useRef<HTMLDivElement>(null);
  const colCenterRef = useRef<HTMLDivElement>(null);
  const colRightRef = useRef<HTMLDivElement>(null);
  const sliderWrapperRef = useRef<HTMLDivElement>(null);
  const sliderSlotRef = useRef<HTMLDivElement>(null);
  const centerRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const line1Chars = gsap.utils.toArray<HTMLElement>(".work-char-l1");
      const line2Chars = gsap.utils.toArray<HTMLElement>(".work-char-l2");
      const allChars = [...line1Chars, ...line2Chars];

      // 1. Initial State: Characters come noticeably from the TOP with high scale & forward Z-index
      gsap.set(allChars, {
        opacity: 0,
        filter: "blur(36px)",
        scale: 3.5,
        z: 500,
        y: -220,
        transformOrigin: "center center",
      });

      if (subheadingRef.current) {
        gsap.set(subheadingRef.current, {
          opacity: 0,
          filter: "blur(14px)",
          y: 16,
        });
      }

      // 2. Fast Heading Animation: Explicit stagger ensures EVERY character (including R) animates
      const headingTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate Line 1 ("Explore") with center-origin stagger
      headingTl.to(
        line1Chars,
        {
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
        },
        0
      );

      // Animate Line 2 ("Work") with its own center-origin stagger (R is never skipped)
      headingTl.to(
        line2Chars,
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          z: 0,
          y: 0,
          duration: 1.0,
          ease: "power3.out",
          stagger: {
            from: "center",
            amount: 0.25,
            ease: "power2.out",
          },
        },
        0.1
      );

      // Subheading reveals smoothly
      if (subheadingRef.current) {
        headingTl.to(
          subheadingRef.current,
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.6,
            ease: "power2.out",
          },
          0.38
        );
      }

      // 3. Subtle slow rotation of ambient circle
      if (circleRef.current) {
        gsap.to(circleRef.current, {
          rotate: 200,
          scale: 1.04,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }

      // 4. Desktop Scroll Animation: Heading Upward Parallax Dissolve & 3-Column Full 100vh Card Reveal
      ScrollTrigger.matchMedia({
        // DESKTOP (>= 1024px): Stage 1 Centering + Stage 2 Full-Screen Slider Expansion
        "(min-width: 1024px)": () => {
          const scrollTl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "+=220%",
              pin: pinContainerRef.current,
              pinSpacing: true,
              scrub: 1.2,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            },
          });

          // Helper to get exact slot position relative to pinContainer
          const getSlotRect = () => {
            if (!pinContainerRef.current || !sliderSlotRef.current) {
              return { top: 380, left: 360, width: 720, height: 296 };
            }
            const cRect = pinContainerRef.current.getBoundingClientRect();
            const sRect = sliderSlotRef.current.getBoundingClientRect();
            return {
              top: Math.round(sRect.top - cRect.top),
              left: Math.round(sRect.left - cRect.left),
              width: Math.round(sRect.width),
              height: Math.round(sRect.height),
            };
          };

          const getGalleryShift = () => {
            if (!pinContainerRef.current || !galleryWrapperRef.current) return -170;
            const containerH = pinContainerRef.current.offsetHeight;
            const galleryH = galleryWrapperRef.current.offsetHeight;
            const currentTop = galleryWrapperRef.current.offsetTop;
            const targetTop = Math.max(0, (containerH - galleryH) / 2);
            return -(currentTop - targetTop);
          };

          // Position desktop sliderWrapperRef initially exactly over sliderSlotRef
          if (sliderWrapperRef.current && sliderSlotRef.current && pinContainerRef.current) {
            const initRect = getSlotRect();
            gsap.set(sliderWrapperRef.current, {
              top: initRect.top,
              left: initRect.left,
              width: initRect.width,
              height: initRect.height,
              borderRadius: "18px",
              x: 0,
              y: 0,
            });

            ScrollTrigger.addEventListener("refreshInit", () => {
              if (sliderWrapperRef.current && sliderSlotRef.current && pinContainerRef.current) {
                if (scrollTl.progress() < 0.05) {
                  const r = getSlotRect();
                  gsap.set(sliderWrapperRef.current, {
                    top: r.top,
                    left: r.left,
                    width: r.width,
                    height: r.height,
                  });
                }
              }
            });
          }

          // ====================================================
          // STAGE 1: Heading Dissolve + Gallery Centering (0.0 -> 0.8)
          // ====================================================

          // 1. Heading glides upwards with smooth dissolve and soft blur
          if (headingWrapperRef.current) {
            scrollTl.to(
              headingWrapperRef.current,
              {
                y: -150,
                opacity: 0,
                filter: "blur(14px)",
                scale: 0.94,
                duration: 0.6,
                ease: "power2.inOut",
              },
              0
            );
          }

          // 2. 3-Column gallery moves upward with scroll parallax to settle in the exact center of the screen
          if (galleryWrapperRef.current) {
            scrollTl.to(
              galleryWrapperRef.current,
              {
                y: getGalleryShift,
                duration: 0.8,
                ease: "power2.out",
              },
              0
            );
          }

          // 3. Slider follows the gallery upward during Stage 1 to remain locked on slot
          if (sliderWrapperRef.current) {
            scrollTl.to(
              sliderWrapperRef.current,
              {
                y: getGalleryShift,
                duration: 0.8,
                ease: "power2.out",
              },
              0
            );
          }

          // ====================================================
          // STAGE 2: Side Columns Parallax Ejection + Center Slider Fullscreen Reveal (0.9 -> 2.0)
          // ====================================================

          // 4. Col 1 (left) slides outside viewport to the left with parallax
          if (colLeftRef.current) {
            scrollTl.to(
              colLeftRef.current,
              {
                x: -750,
                opacity: 0,
                duration: 1.0,
                ease: "power2.inOut",
              },
              0.9
            );
          }

          // 5. Col 3 (right) slides outside viewport to the right with parallax
          if (colRightRef.current) {
            scrollTl.to(
              colRightRef.current,
              {
                x: 750,
                opacity: 0,
                duration: 1.0,
                ease: "power2.inOut",
              },
              0.9
            );
          }

          // 6. Center lower row cards slide downwards outside the viewport
          if (centerRowRef.current) {
            scrollTl.to(
              centerRowRef.current,
              {
                y: 400,
                opacity: 0,
                duration: 0.8,
                ease: "power2.inOut",
              },
              0.9
            );
          }

          // 7. Main Center Slider expands to cover full 100vh viewport screen without scaling the image
          if (sliderWrapperRef.current) {
            // Remove rounded corners immediately at the start of scaling to eliminate corner white space
            scrollTl.to(
              sliderWrapperRef.current,
              {
                borderRadius: "0px",
                duration: 0.08,
                ease: "power1.out",
              },
              0.9
            );

            scrollTl.to(
              sliderWrapperRef.current,
              {
                top: 0,
                left: 0,
                y: 0,
                x: 0,
                width: "100%",
                height: "100%",
                duration: 1.1,
                ease: "power2.inOut",
              },
              0.9
            );
          }
        },

        // MOBILE / TABLET (< 1024px): Staggered card fade-in on scroll
        "(max-width: 1023px)": () => {
          const cards = gsap.utils.toArray<HTMLElement>(".work-card-wrapper");
          gsap.fromTo(
            cards,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.08,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: galleryWrapperRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const renderCharSpan = (
    text: string,
    prefix: string,
    charClass: string,
    gradient = false
  ) => {
    return splitTextChars(text).map((item, idx) => (
      <span
        key={`${prefix}-${idx}`}
        className={`inline-block will-change-[transform,filter,opacity] ${charClass}`}
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
    ));
  };

  // Borderless image card (preserves full image without cutting)
  const renderCard = (
    card: WorkCard,
    customClass = "",
    imgClass = "object-cover object-center"
  ) => {
    return (
      <div
        key={card.id}
        className={`work-card-wrapper group relative rounded-[14px] lg:rounded-[18px] 2xl:rounded-[20px] overflow-hidden shadow-[0_6px_20px_-4px_rgba(0,0,0,0.1)] transition-all duration-400 hover:shadow-[0_14px_28px_-6px_rgba(0,0,0,0.16)] hover:-translate-y-1 ${customClass}`}
      >
        <div className="relative w-full h-full overflow-hidden rounded-[14px] lg:rounded-[18px] 2xl:rounded-[20px]">
          <Image
            src={card.image}
            alt={card.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`${imgClass} rounded-[14px] lg:rounded-[18px] 2xl:rounded-[20px] transition-transform duration-700 ease-out group-hover:scale-105`}
          />
        </div>
      </div>
    );
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      className="relative w-full bg-transparent overflow-hidden"
    >
      {/* Pinned Viewport Container - Exactly covers 100vh with both Heading and Cards WITHOUT cutting */}
      <div
        ref={pinContainerRef}
        className="relative w-full min-h-screen lg:h-screen lg:max-h-screen overflow-hidden"
      >
        {/* Inner Content Wrapper preserving exact padding and layout */}
        <div className="relative w-full h-full flex flex-col justify-between container-padding pt-3 sm:pt-4 lg:pt-5 pb-3 sm:pb-4 lg:pb-5">
          {/* Concentric Ambient Circles rotated 180deg so the curved arch crowns the top */}
          <div
            ref={circleRef}
            className="absolute -top-12 lg:-top-16 left-1/2 -translate-x-1/2 w-[580px] h-[580px] xl:w-[720px] xl:h-[720px] 2xl:w-[820px] 2xl:h-[820px] pointer-events-none z-0 select-none opacity-25 transform rotate-[180deg]"
          >
            <Image
              src="/images/texture/circle.png"
              alt="Concentric Circle Arc"
              width={820}
              height={820}
              className="absolute inset-0 w-full h-full object-contain"
              loading="lazy"
            />
            <Image
              src="/images/texture/circle-dotted.png"
              alt="Concentric Circle Dotted Arc"
              width={940}
              height={940}
              className="absolute inset-[-6%] w-[112%] h-[112%] object-contain"
              loading="lazy"
            />
          </div>

          {/* Top Header Row: SCROLL TO EXPLORE indicator */}
         

          {/* Heading & Subheading Area - Centered and Grand with breathing space */}
          <div
            ref={headingWrapperRef}
            className="relative z-20 flex flex-col items-center justify-center text-center mt-1 sm:mt-2 lg:mt-2.5 mb-auto  "
          >
            {/* Section Heading: "Explore Work" in Voyage Font (Majestic Grand Scale) */}
            <SectionHeading
              as="h2"
              className="text-[58px] sm:text-[76px] md:text-[98px] lg:text-[122px] xl:text-[142px] 2xl:text-[164px] leading-[0.86] tracking-normal text-[#121212] select-none text-center mt-8"
            >
              {/* Line 1: Explore */}
              <div className="block leading-[0.84] overflow-visible">
                {renderCharSpan(data.headingLine1, "line1", "work-char-l1")}
              </div>

              {/* Line 2: Work with Figma exact linear gradient text fill (fades to transparent at bottom) */}
              <div className="block leading-[0.84] overflow-visible mt-[-0.04em]">
                {renderCharSpan(data.headingLine2, "line2", "work-char-l2", true)}
              </div>
            </SectionHeading>

            {/* Subheading: "IDEAS BEYOND ORDINARY" */}
            <div
              ref={subheadingRef}
              className="mt-1.5 lg:mt-2 xl:mt-2.5 text-center select-none w-[170px] sm:w-[190px] lg:w-[210px] mx-auto"
            >
              <SubHeading
                as="h3"
                className="text-[12px] sm:text-[14px] lg:text-[16px] xl:text-[18px] 2xl:text-[20px] leading-[115%] font-normal text-[#171717] tracking-[0.03em] uppercase text-left"
              >
                <span className="block text-left pl-[86px]">IDEAS</span>
                <span className="block text-right pr-2">BEYOND</span>
                <span className="block text-left pl-[86px]">ORDINARY</span>
              </SubHeading>
            </div>
          </div>

          {/* 3-Column Showcase Cards Layout - Generous breathing gap above gallery */}
          <div
            ref={galleryWrapperRef}
            className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto mt-auto pt-3 sm:pt-5 lg:pt-16 will-change-transform"
          >
            {/* Desktop 3-Column Layout (>= 1024px) */}
            <div className="hidden lg:grid lg:grid-cols-12 gap-3 xl:gap-3.5 2xl:gap-4 items-end">
              
              {/* COLUMN 1: LEFT COLUMN (3 cols) - Placed at y-position 45 */}
              <div
                ref={colLeftRef}
                className="lg:col-span-3 flex flex-col justify-end gap-2.5 xl:gap-3 lg:-translate-y-[45px] will-change-transform"
              >
                {/* Card 1: Trump Residences (work-left1) */}
                <div className="w-full h-[250px] lg:h-[250px] xl:h-[285px] 2xl:h-[316px]">
                  {renderCard(data.columns.left[0], "w-full h-full", "object-cover object-top")}
                </div>
                {/* Card 2: Lady overlooking night skyline (work-left2) */}
                <div className="w-full h-[130px] lg:h-[130px] xl:h-[143px] 2xl:h-[158px]">
                  {renderCard(data.columns.left[1], "w-full h-full", "object-cover object-center")}
                </div>
              </div>

              {/* COLUMN 2: CENTER COLUMN (6 cols) - Exact Aspect Ratios to NEVER CUT images */}
              <div
                ref={colCenterRef}
                className="lg:col-span-6 flex flex-col justify-end gap-2.5 xl:gap-3 relative z-30"
              >
                {/* Desktop Slot Placeholder for WorkCenterSlider */}
                <div
                  ref={sliderSlotRef}
                  className="w-full aspect-[906/373] rounded-[14px] lg:rounded-[18px] 2xl:rounded-[20px] invisible pointer-events-none"
                />

                {/* Center Row: 2 Cards Side-by-Side (work-c2left and work-c3right - no crop) */}
                <div
                  ref={centerRowRef}
                  className="grid grid-cols-2 gap-2.5 xl:gap-3 w-full will-change-transform"
                >
                <div className="w-full aspect-[442/218]">
                  {renderCard(
                    data.columns.centerRow[0],
                    "w-full h-full",
                    "object-cover object-center"
                  )}
                </div>
                <div className="w-full aspect-[442/218]">
                  {renderCard(
                    data.columns.centerRow[1],
                    "w-full h-full",
                    "object-cover object-center"
                  )}
                </div>
              </div>
            </div>

            {/* COLUMN 3: RIGHT COLUMN (3 cols) - Placed at y-position 45 */}
            <div
              ref={colRightRef}
              className="lg:col-span-3 flex flex-col justify-end gap-2.5 xl:gap-3 lg:-translate-y-[45px] will-change-transform"
            >
              {/* Card 1: Eldeco 7 Peaks Billboard (work-right1) */}
              <div className="w-full h-[175px] lg:h-[175px] xl:h-[200px] 2xl:h-[220px]">
                {renderCard(data.columns.right[0], "w-full h-full", "object-cover object-center")}
              </div>
              {/* Card 2: M3M Antalya Hills (work-right2) */}
              <div className="w-full h-[205px] lg:h-[205px] xl:h-[228px] 2xl:h-[254px]">
                {renderCard(data.columns.right[1], "w-full h-full", "object-cover object-top")}
              </div>
            </div>
          </div>

          {/* Mobile & Tablet Responsive Layout (< 1024px) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 lg:hidden w-full mt-3">
            <div className="sm:col-span-2 w-full">
              <WorkCenterSlider />
            </div>

            <div className="w-full aspect-[442/370]">
              {renderCard(data.columns.left[0], "w-full h-full", "object-cover object-top")}
            </div>

            <div className="w-full aspect-[442/278]">
              {renderCard(data.columns.right[0], "w-full h-full", "object-cover object-center")}
            </div>

            <div className="w-full aspect-[442/218]">
              {renderCard(data.columns.centerRow[0], "w-full h-full", "object-cover object-center")}
            </div>

            <div className="w-full aspect-[442/218]">
              {renderCard(data.columns.centerRow[1], "w-full h-full", "object-cover object-center")}
            </div>

            <div className="w-full aspect-[442/221]">
              {renderCard(data.columns.left[1], "w-full h-full", "object-cover object-center")}
            </div>

            <div className="w-full aspect-[442/369]">
              {renderCard(data.columns.right[1], "w-full h-full", "object-cover object-top")}
            </div>
          </div>
        </div>

        {/* DESKTOP Center Slider: Starts exactly over sliderSlotRef and expands to full 100vh viewport without scale */}
        <div
          ref={sliderWrapperRef}
          className="hidden lg:block absolute z-40 overflow-hidden shadow-[0_6px_20px_-4px_rgba(0,0,0,0.1)] will-change-[top,left,width,height,transform]"
        >
          <WorkCenterSlider isFullscreen />
        </div>
      </div>
      </div>
    </section>
  );
}
