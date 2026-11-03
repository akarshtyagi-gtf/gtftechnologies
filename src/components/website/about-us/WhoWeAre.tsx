"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { SubHeading } from "@/components/common/Typography";
import ContentReveal from "@/components/animations/ContentReveal";
import CharBlurDissolveHeading from "@/components/animations/CharBlurDissolveHeading";

export interface WhoWeAreData {
  heading: string;
  subtitlePrefix: string;
  subtitleHighlight: string;
  description: string;
  missionBadge: string;
  missionHeadingPart1: string;
  missionHeadingPart2: string;
  missionParagraph1: string;
  missionParagraph2: string;
  missionImageSrc: string;
  missionImageAlt: string;
}

export interface WhoWeAreProps {
  data: WhoWeAreData;
}

export default function WhoWeAre({ data }: WhoWeAreProps) {
  const {
    heading,
    subtitlePrefix,
    subtitleHighlight,
    description,
    missionBadge,
    missionHeadingPart1,
    missionHeadingPart2,
    missionParagraph1,
    missionParagraph2,
    missionImageSrc,
    missionImageAlt,
  } = data;

  const sectionRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);
  const imageMotionRef = useRef<HTMLDivElement>(null);
  const imageInnerRef = useRef<HTMLDivElement>(null);
  const rightContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const sectionEl = sectionRef.current;
    const imageEl = imageMotionRef.current;
    const rightEl = rightContentRef.current;

    if (!sectionEl || !imageEl || !rightEl) return;

    // Use GSAP MatchMedia for seamless responsive behavior
    const mm = gsap.matchMedia();

    // 1. Desktop & Large Screens (>= 1024px): The WHOLE "Who we are" section is pinned at top top
    mm.add("(min-width: 1024px)", () => {
      // Calculate exact pixel offset so the mission image reveals in the dead horizontal center of the section
      const calculateCenterDelta = () => {
        const showcase = showcaseRef.current;
        const imageInner = imageInnerRef.current;
        if (!showcase || !imageInner) return 0;
        gsap.set(imageEl, { x: 0, clearProps: "transform" });
        const showcaseRect = showcase.getBoundingClientRect();
        const imageRect = imageInner.getBoundingClientRect();
        const showcaseCenterX = showcaseRect.left + showcaseRect.width / 2;
        const imageCenterX = imageRect.left + imageRect.width / 2;
        return showcaseCenterX - imageCenterX;
      };

      const centerDelta = calculateCenterDelta();

      // Set initial positions:
      // image starts perfectly centered horizontally directly under section header
      gsap.set(imageEl, {
        x: centerDelta,
        scale: 0.96,
        opacity: 0,
        y: 10,
        filter: "blur(6px)",
      });

      // right content starts hidden on the right
      gsap.set(rightEl, {
        opacity: 0,
        x: 60,
        filter: "blur(10px)",
      });

      // Master ScrollTrigger Timeline: Pin the WHOLE "Who we are" section!
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 1,
          anticipatePin: 0.3,
          invalidateOnRefresh: true,
        },
      });

      // Step 1: Image reveals in the exact center smoothly
      tl.to(imageEl, {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        duration: 0.4,
        ease: "power2.out",
      });

      // Step 2: Image glides from center to the left
      tl.to(
        imageEl,
        {
          x: 0,
          duration: 0.7,
          ease: "power2.inOut",
        },
        0.4
      );

      // Step 3: Right content reveals smoothly with blur dissolve
      tl.to(
        rightEl,
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.6,
          ease: "power2.out",
        },
        0.5
      );

      // Step 4: Hold for reading before unpinning
      tl.to({}, { duration: 0.3 });
    });

    // 2. Mobile & Tablet (< 1024px): Smooth sequential scroll-triggered reveals without locking scroll
    mm.add("(max-width: 1023px)", () => {
      gsap.set([imageEl, rightEl], {
        opacity: 0,
        y: 30,
        filter: "blur(6px)",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      tl.to(imageEl, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 0.85,
        ease: "power3.out",
      }).to(
        rightEl,
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.85,
          ease: "power3.out",
        },
        "-=0.4"
      );
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen lg:h-screen bg-[#F8F6F0] overflow-hidden select-none flex flex-col justify-center pt-12 sm:pt-14 lg:pt-12 pb-4 sm:pb-6 lg:pb-4 px-4 sm:px-6 lg:px-8"
    >
      {/* Background Texture Overlay: Exact match across GTF website */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <Image
          src="/images/texture/bg-texture.png"
          alt="Texture"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center opacity-85 mix-blend-multiply"
        />
      </div>

      <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto flex flex-col items-center justify-center my-auto">
        {/* ========================================================= */}
        {/* SECTION HEADER: Typography matching GTF common design      */}
        {/* ========================================================= */}
        <div className="w-full text-center max-w-[920px] mx-auto mb-2 sm:mb-3 lg:mb-2 xl:mb-4">
          {/* Main Heading: Who we are (Voyage + Char Blur Dissolve) */}
          <div className="mb-1">
            <CharBlurDissolveHeading
              text={heading}
              as="h2"
              start="top 85%"
              className="font-voyage text-4xl sm:text-5xl md:text-6xl lg:text-[62px] xl:text-[80px] text-[#121212] font-normal leading-[1.05] tracking-tight text-center"
            />
          </div>

          {/* Subtitle with highlighted badge: Building Brands. Driving Growth. */}
          <ContentReveal
            triggerOnScroll
            duration={0.65}
            yOffset={8}
            blurAmount={6}
            className="text-center mb-1.5 sm:mb-2"
          >
            <p className="font-segoe text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-[#121212] font-normal leading-snug">
              {subtitlePrefix}
              <span className="inline-block bg-[#E7EE7D] text-[#121212] px-2 py-0.5 rounded-[4px] font-medium ml-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                {subtitleHighlight}
              </span>
            </p>
          </ContentReveal>

          {/* Header Description Paragraph */}
          <ContentReveal
            triggerOnScroll
            duration={0.7}
            yOffset={10}
            blurAmount={8}
            className="text-center"
          >
            <p className="font-segoe text-xs sm:text-[13px] lg:text-[13px] xl:text-sm text-[#484848] font-normal max-w-[620px] mx-auto leading-relaxed">
              {description}
            </p>
          </ContentReveal>
        </div>

        {/* ========================================================= */}
        {/* SHOWCASE: Center -> Left Glide + Right Reveal             */}
        {/* ========================================================= */}
        <div
          ref={showcaseRef}
          className="relative w-full max-w-[1240px] xl:max-w-[1320px] mx-auto flex items-center justify-center"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center w-full">
            {/* Left Column: Strategic Chess Pieces Image (Glides from Center to Left) */}
            <div
              ref={imageMotionRef}
              className="w-full flex justify-center lg:justify-start will-change-[transform,opacity,filter]"
            >
              <div
                ref={imageInnerRef}
                className="relative flex items-center justify-center w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] xl:max-w-[580px]"
              >
                <Image
                  src={missionImageSrc}
                  alt={missionImageAlt}
                  width={838}
                  height={690}
                  priority
                  sizes="(max-width: 640px) 90vw, (max-width: 1024px) 55vw, 580px"
                  className="w-auto h-auto max-h-[40vh] sm:max-h-[44vh] lg:max-h-[48vh] xl:max-h-[520px] object-contain select-none pointer-events-none drop-shadow-[0_18px_38px_rgba(0,0,0,0.06)]"
                />
              </div>
            </div>

            {/* Right Column: Mission Content (Reveals Smoothly from Right) */}
            <div
              ref={rightContentRef}
              className="w-full flex flex-col justify-center will-change-[transform,opacity,filter] max-w-[540px] mx-auto lg:mx-0"
            >
              {/* Row 1: Pill Badge + Turning Brand (Horizontally Aligned on Same Line) */}
              <div className="flex items-center gap-3 sm:gap-3.5 mb-1 sm:mb-1.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-black/35 text-[10px] sm:text-[11px] tracking-[0.16em] uppercase font-segoe font-medium text-[#121212] shrink-0 bg-[#F8F6F0]/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                  {missionBadge}
                </div>
                <h3 className="font-voyage text-3xl sm:text-4xl md:text-[42px] lg:text-[40px] xl:text-[48px] text-[#121212] font-normal leading-[1.08] tracking-tight">
                  {missionHeadingPart1}
                </h3>
              </div>

              {/* Row 2: Vision Into Reality. */}
              <h3 className="font-voyage text-3xl sm:text-4xl md:text-[42px] lg:text-[40px] xl:text-[48px] text-[#121212] font-normal leading-[1.08] tracking-tight mb-5 sm:mb-6 lg:mb-5 xl:mb-7">
                {missionHeadingPart2}
              </h3>

              {/* Mission Paragraphs: Exact 3 Lines Each Matching Figma Specifications */}
              <div className="space-y-4 text-xs sm:text-[13.5px] lg:text-[14px] xl:text-[15px] font-segoe text-[#4a4a4a] font-normal leading-[1.65] max-w-[485px]">
                <p>{missionParagraph1}</p>
                <p>{missionParagraph2}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
