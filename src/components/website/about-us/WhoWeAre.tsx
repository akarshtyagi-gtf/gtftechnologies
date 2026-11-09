"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { Paragraph } from "@/components/common/Typography";
import ParagraphLineReveal from "@/components/animations/ParagraphLineReveal";
import ContentReveal from "@/components/animations/ContentReveal";
import CharBlurDissolveHeading from "@/components/animations/CharBlurDissolveHeading";

export interface WhoWeAreData {
  heading: string;
  subtitlePrefix: string;
  subtitleHighlight: string;
  description: string;
  // Mission Data
  missionBadge: string;
  missionHeadingPart1: string;
  missionHeadingPart2: string;
  missionParagraph1: string;
  missionParagraph2: string;
  missionImageSrc: string;
  missionImageAlt: string;
  // Vision Data
  visionBadge?: string;
  visionHeadingPart1?: string;
  visionHeadingPart2?: string;
  visionParagraph1?: string;
  visionParagraph2?: string;
  visionImageSrc?: string;
  visionImageAlt?: string;
  // Values Data
  valuesBadge?: string;
  valuesHeadingPart1?: string;
  valuesHeadingPart2?: string;
  valuesParagraph1?: string;
  valuesParagraph2?: string;
  valuesImageSrc?: string;
  valuesImageAlt?: string;
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
    // Mission
    missionBadge,
    missionHeadingPart1,
    missionHeadingPart2,
    missionParagraph1,
    missionParagraph2,
    missionImageSrc,
    missionImageAlt,
    // Vision
    visionBadge = "OUR VISION",
    visionHeadingPart1 = "Built on Trust.",
    visionHeadingPart2 = "Driven by Purpose.",
    visionParagraph1 = "At GTF Technologies, we redefine real estate marketing by creating digital ecosystems where brands inspire. We merge creativity, technology, and strategy into",
    visionParagraph2 = "impactful experiences. Through storytelling and data-driven strategies, we envision a future where our partners achieve visibility, engagement, and market leadership.",
    visionImageSrc = "/images/about-us/our_vision.webp",
    visionImageAlt = "GTF Technologies Vision Binoculars Built on Trust",
    // Values
    valuesBadge = "OUR VALUES",
    valuesHeadingPart1 = "Shaping Future",
    valuesHeadingPart2 = "of Real Estate Branding,",
    valuesParagraph1 = "We build our business's best abilities, share information, and provide essential tools to keep up with today's technology. We aim for excellence in our work and are trusted by clients",
    valuesParagraph2 = "to deliver results. Our planning is consultative and strategic, executed with creativity and integrity, becoming an extension of the client's team.",
    valuesImageSrc = "/images/about-us/our_value.webp",
    valuesImageAlt = "GTF Technologies Partnership Shaping Future of Real Estate Branding",
  } = data;

  const sectionRef = useRef<HTMLElement>(null);
  const showcaseRef = useRef<HTMLDivElement>(null);

  // Mission Refs
  const missionStageRef = useRef<HTMLDivElement>(null);
  const missionImageMotionRef = useRef<HTMLDivElement>(null);
  const missionImageInnerRef = useRef<HTMLDivElement>(null);
  const missionRightContentRef = useRef<HTMLDivElement>(null);

  // Vision Refs
  const visionStageRef = useRef<HTMLDivElement>(null);
  const visionImageMotionRef = useRef<HTMLDivElement>(null);
  const visionImageInnerRef = useRef<HTMLDivElement>(null);
  const visionLeftContentRef = useRef<HTMLDivElement>(null);

  // Values Refs
  const valuesStageRef = useRef<HTMLDivElement>(null);
  const valuesImageMotionRef = useRef<HTMLDivElement>(null);
  const valuesImageInnerRef = useRef<HTMLDivElement>(null);
  const valuesRightContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const sectionEl = sectionRef.current;
    const showcaseEl = showcaseRef.current;

    // Mission elements
    const missionStageEl = missionStageRef.current;
    const missionImageEl = missionImageMotionRef.current;
    const missionImageInner = missionImageInnerRef.current;
    const missionRightEl = missionRightContentRef.current;

    // Vision elements
    const visionStageEl = visionStageRef.current;
    const visionImageEl = visionImageMotionRef.current;
    const visionImageInner = visionImageInnerRef.current;
    const visionLeftEl = visionLeftContentRef.current;

    // Values elements
    const valuesStageEl = valuesStageRef.current;
    const valuesImageEl = valuesImageMotionRef.current;
    const valuesImageInner = valuesImageInnerRef.current;
    const valuesRightEl = valuesRightContentRef.current;

    if (
      !sectionEl ||
      !showcaseEl ||
      !missionStageEl ||
      !missionImageEl ||
      !missionImageInner ||
      !missionRightEl ||
      !visionStageEl ||
      !visionImageEl ||
      !visionImageInner ||
      !visionLeftEl ||
      !valuesStageEl ||
      !valuesImageEl ||
      !valuesImageInner ||
      !valuesRightEl
    ) {
      return;
    }

    const mm = gsap.matchMedia();

    // =========================================================================
    // 1. Desktop & Large Screens (>= 1024px): SINGLE PINNED TIMELINE
    // =========================================================================
    mm.add("(min-width: 1024px)", () => {
      // Calculate exact dead horizontal center delta relative to the SECTION/SCREEN
      // Works accurately at 90% zoom, 100% zoom, Retina, and all screen widths
      const calculateMissionCenterDelta = () => {
        if (!sectionEl || !missionImageInner) return 0;
        gsap.set(missionImageEl, { x: 0, clearProps: "transform" });
        const sectionRect = sectionEl.getBoundingClientRect();
        const imageRect = missionImageInner.getBoundingClientRect();
        const sectionCenterX = sectionRect.left + sectionRect.width / 2;
        const imageCenterX = imageRect.left + imageRect.width / 2;
        return sectionCenterX - imageCenterX;
      };

      const calculateVisionCenterDelta = () => {
        if (!sectionEl || !visionImageInner) return 0;
        gsap.set(visionImageEl, { x: 0, clearProps: "transform" });
        const sectionRect = sectionEl.getBoundingClientRect();
        const imageRect = visionImageInner.getBoundingClientRect();
        const sectionCenterX = sectionRect.left + sectionRect.width / 2;
        const imageCenterX = imageRect.left + imageRect.width / 2;
        return sectionCenterX - imageCenterX;
      };

      const calculateValuesCenterDelta = () => {
        if (!sectionEl || !valuesImageInner) return 0;
        gsap.set(valuesImageEl, { x: 0, clearProps: "transform" });
        const sectionRect = sectionEl.getBoundingClientRect();
        const imageRect = valuesImageInner.getBoundingClientRect();
        const sectionCenterX = sectionRect.left + sectionRect.width / 2;
        const imageCenterX = imageRect.left + imageRect.width / 2;
        return sectionCenterX - imageCenterX;
      };

      let missionCenterDelta = calculateMissionCenterDelta();
      let visionCenterDelta = calculateVisionCenterDelta();
      let valuesCenterDelta = calculateValuesCenterDelta();

      const applyInitialPositions = () => {
        missionCenterDelta = calculateMissionCenterDelta();
        visionCenterDelta = calculateVisionCenterDelta();
        valuesCenterDelta = calculateValuesCenterDelta();

        gsap.set(missionImageEl, {
          x: missionCenterDelta,
          scale: 1,
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        });
        gsap.set(visionImageEl, {
          x: visionCenterDelta,
          scale: 1,
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        });
        gsap.set(valuesImageEl, {
          x: valuesCenterDelta,
          scale: 1,
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        });
      };

      applyInitialPositions();

      // Recalculate accurately whenever window resizes or zoom changes (e.g. 90% zoom in Chrome)
      window.addEventListener("resize", applyInitialPositions);
      ScrollTrigger.addEventListener("refreshInit", applyInitialPositions);

      // Initial States for stages & text
      gsap.set(missionStageEl, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        pointerEvents: "auto",
      });
      gsap.set(missionRightEl, {
        opacity: 0,
        x: 50,
        filter: "blur(8px)",
      });

      gsap.set(visionStageEl, {
        opacity: 0,
        y: 50,
        filter: "blur(6px)",
        pointerEvents: "none",
      });
      gsap.set(visionLeftEl, {
        opacity: 0,
        x: -50,
        filter: "blur(8px)",
      });

      gsap.set(valuesStageEl, {
        opacity: 0,
        y: 50,
        filter: "blur(6px)",
        pointerEvents: "none",
      });
      gsap.set(valuesRightEl, {
        opacity: 0,
        x: 50,
        filter: "blur(8px)",
      });

      // Master ScrollTrigger Timeline: 3-Stage Trilogy
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionEl,
          start: "top top",
          end: "+=260%",
          pin: true,
          scrub: 1,
          anticipatePin: 0.3,
          invalidateOnRefresh: true,
        },
      });

      // -----------------------------------------------------------
      // PHASE 1: OUR MISSION REVEALS (Image Left, Content Right)
      // -----------------------------------------------------------
      tl.fromTo(
        missionImageEl,
        { x: () => missionCenterDelta },
        {
          x: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        0.05
      );

      tl.to(
        missionRightEl,
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power2.out",
        },
        0.1
      );

      const missionLines = missionRightEl.querySelectorAll(".line-reveal-inner");
      if (missionLines.length > 0) {
        tl.fromTo(
          missionLines,
          { y: "115%", opacity: 0, filter: "blur(4px)" },
          {
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.45,
            stagger: 0.05,
            ease: "power2.out",
          },
          0.15
        );
      }

      // Hold Mission for reading
      tl.to({}, { duration: 0.35 });

      // -----------------------------------------------------------
      // TRANSITION 1: MISSION SCROLLS UP -> VISION ENTERS FROM BELOW
      // -----------------------------------------------------------
      tl.to(missionStageEl, {
        y: -70,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(missionStageEl, { pointerEvents: "none" });
          gsap.set(visionStageEl, { pointerEvents: "auto" });
        },
        onReverseComplete: () => {
          gsap.set(missionStageEl, { pointerEvents: "auto" });
          gsap.set(visionStageEl, { pointerEvents: "none" });
        },
      });

      tl.to(
        visionStageEl,
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power2.out",
        },
        "-=0.25"
      );

      // -----------------------------------------------------------
      // PHASE 2: OUR VISION REVEALS (Content Left, Image Right)
      // -----------------------------------------------------------
      tl.fromTo(
        visionImageEl,
        { x: () => visionCenterDelta },
        {
          x: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "-=0.1"
      );

      tl.to(
        visionLeftEl,
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power2.out",
        },
        "-=0.4"
      );

      const visionLines = visionLeftEl.querySelectorAll(".line-reveal-inner");
      if (visionLines.length > 0) {
        tl.fromTo(
          visionLines,
          { y: "115%", opacity: 0, filter: "blur(4px)" },
          {
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.45,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.35"
        );
      }

      // Hold Vision for reading
      tl.to({}, { duration: 0.35 });

      // -----------------------------------------------------------
      // TRANSITION 2: VISION SCROLLS UP -> VALUES ENTERS FROM BELOW
      // -----------------------------------------------------------
      tl.to(visionStageEl, {
        y: -70,
        opacity: 0,
        filter: "blur(6px)",
        duration: 0.45,
        ease: "power2.inOut",
        onComplete: () => {
          gsap.set(visionStageEl, { pointerEvents: "none" });
          gsap.set(valuesStageEl, { pointerEvents: "auto" });
        },
        onReverseComplete: () => {
          gsap.set(visionStageEl, { pointerEvents: "auto" });
          gsap.set(valuesStageEl, { pointerEvents: "none" });
        },
      });

      tl.to(
        valuesStageEl,
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power2.out",
        },
        "-=0.25"
      );

      // -----------------------------------------------------------
      // PHASE 3: OUR VALUES REVEALS (Image Left, Content Right)
      // -----------------------------------------------------------
      tl.fromTo(
        valuesImageEl,
        { x: () => valuesCenterDelta },
        {
          x: 0,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "-=0.1"
      );

      tl.to(
        valuesRightEl,
        {
          opacity: 1,
          x: 0,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power2.out",
        },
        "-=0.4"
      );

      const valuesLines = valuesRightEl.querySelectorAll(".line-reveal-inner");
      if (valuesLines.length > 0) {
        tl.fromTo(
          valuesLines,
          { y: "115%", opacity: 0, filter: "blur(4px)" },
          {
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.45,
            stagger: 0.05,
            ease: "power2.out",
          },
          "-=0.35"
        );
      }

      // Hold Values for reading before unpinning
      tl.to({}, { duration: 0.4 });

      return () => {
        window.removeEventListener("resize", applyInitialPositions);
        ScrollTrigger.removeEventListener("refreshInit", applyInitialPositions);
      };
    });

    // =========================================================================
    // 2. Mobile & Tablet (< 1024px): Sequential natural scroll
    // =========================================================================
    mm.add("(max-width: 1023px)", () => {
      gsap.set([missionStageEl, visionStageEl, valuesStageEl], {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        pointerEvents: "auto",
      });
      gsap.set(
        [
          missionImageEl,
          missionRightEl,
          visionImageEl,
          visionLeftEl,
          valuesImageEl,
          valuesRightEl,
        ],
        {
          opacity: 0,
          y: 30,
          filter: "blur(6px)",
          x: 0,
        }
      );

      // Mission reveal
      const tlMission = gsap.timeline({
        scrollTrigger: {
          trigger: missionStageEl,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      tlMission
        .to(missionImageEl, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        })
        .to(
          missionRightEl,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        );

      const mobileMissionLines = missionRightEl.querySelectorAll(".line-reveal-inner");
      if (mobileMissionLines.length > 0) {
        tlMission.fromTo(
          mobileMissionLines,
          { y: "115%", opacity: 0, filter: "blur(4px)" },
          {
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.5"
        );
      }

      // Vision reveal
      const tlVision = gsap.timeline({
        scrollTrigger: {
          trigger: visionStageEl,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      tlVision
        .to(visionImageEl, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        })
        .to(
          visionLeftEl,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        );

      const mobileVisionLines = visionLeftEl.querySelectorAll(".line-reveal-inner");
      if (mobileVisionLines.length > 0) {
        tlVision.fromTo(
          mobileVisionLines,
          { y: "115%", opacity: 0, filter: "blur(4px)" },
          {
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.5"
        );
      }

      // Values reveal
      const tlValues = gsap.timeline({
        scrollTrigger: {
          trigger: valuesStageEl,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
      tlValues
        .to(valuesImageEl, {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.8,
          ease: "power3.out",
        })
        .to(
          valuesRightEl,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.4"
        );

      const mobileValuesLines = valuesRightEl.querySelectorAll(".line-reveal-inner");
      if (mobileValuesLines.length > 0) {
        tlValues.fromTo(
          mobileValuesLines,
          { y: "115%", opacity: 0, filter: "blur(4px)" },
          {
            y: "0%",
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7,
            stagger: 0.06,
            ease: "power3.out",
          },
          "-=0.5"
        );
      }
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full min-h-screen lg:h-screen bg-[#F8F6F0] overflow-hidden select-none flex flex-col justify-between pt-[74px] sm:pt-[78px] lg:pt-[76px] xl:pt-[80px] 2xl:pt-[92px] pb-3 sm:pb-4 lg:pb-3 xl:pb-4 2xl:pb-8 container-padding"
    >
      {/* Background Texture Overlay: Continuous across entire section */}
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

      <div className="relative z-10 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto flex-1 flex flex-col items-center justify-between min-h-0">
        {/* ========================================================= */}
        {/* SECTION HEADER: Pinned at top above Mission, Vision, Values*/}
        {/* ========================================================= */}
        <div className="w-full text-center max-w-[920px] mx-auto mb-3 sm:mb-4 lg:mb-4 xl:mb-6 2xl:mb-8 shrink-0">
          {/* Main Heading: Who we are (Voyage + Char Blur Dissolve) */}
          <div className="mb-1 sm:mb-1.5 lg:mb-2">
            <CharBlurDissolveHeading
              text={heading}
              as="h2"
              start="top 85%"
              className="font-voyage text-4xl sm:text-5xl md:text-6xl lg:text-[54px] xl:text-[64px] 2xl:text-[78px] text-[#121212] font-normal leading-[1.05] tracking-tight text-center"
            />
          </div>

          {/* Subtitle with highlighted badge: Building Brands. Driving Growth. */}
          <ContentReveal
            triggerOnScroll
            duration={0.65}
            yOffset={8}
            blurAmount={6}
            className="text-center mb-2.5 sm:mb-3  xl:mb-6 2xl:mb-10"
          >
            <p className="font-segoe text-sm sm:text-base md:text-lg lg:text-lg xl:text-xl 2xl:text-2xl text-[#121212] font-normal leading-snug">
              {subtitlePrefix}
              <span className="inline-block bg-[#E7EE7D] text-[#121212] px-2 py-0.5 rounded-[4px] font-medium ml-1.5 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
                {subtitleHighlight}
              </span>
            </p>
          </ContentReveal>

          {/* Header Description Paragraph with line reveal */}
          <ParagraphLineReveal
            text={description}
            triggerOnScroll
            start="top 85%"
            className="text-xs sm:text-[13px] lg:text-[13px] xl:text-sm text-[#484848] max-w-[620px] mx-auto leading-relaxed text-center"
          />
        </div>

        {/* ========================================================= */}
        {/* SHOWCASE AREA: Mission (Stage 1) -> Vision (Stage 2) -> Values (Stage 3) */}
        {/* ========================================================= */}
        <div
          ref={showcaseRef}
          className="relative w-full max-w-[960px] lg:max-w-[1020px] xl:max-w-[1100px] 2xl:max-w-[1180px] mx-auto flex-1 flex items-center justify-center min-h-0"
        >
          {/* ======================================================= */}
          {/* STAGE 1: OUR MISSION (Chess Image Left, Content Right)   */}
          {/* ======================================================= */}
          <div
            ref={missionStageRef}
            className="w-full flex items-center justify-center lg:absolute lg:inset-0 will-change-[opacity,transform,filter]"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center w-full">
              {/* Left Column: Strategic Chess Pieces Image (Glides Center -> Left) */}
              <div
                ref={missionImageMotionRef}
                className="w-full flex justify-center lg:justify-start will-change-[transform,opacity,filter]"
              >
                <div
                  ref={missionImageInnerRef}
                  className="relative flex items-center justify-center w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[480px] xl:max-w-[520px]"
                >
                  <Image
                    src={missionImageSrc}
                    alt={missionImageAlt}
                    width={838}
                    height={690}
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 520px"
                    className="w-full h-auto max-h-[46vh] sm:max-h-[48vh] lg:max-h-[48vh] xl:max-h-[52vh] 2xl:max-h-[58vh] object-contain select-none pointer-events-none drop-shadow-[0_20px_42px_rgba(0,0,0,0.08)]"
                  />
                </div>
              </div>

              {/* Right Column: Mission Content (Reveals from Right) */}
              <div
                ref={missionRightContentRef}
                className="w-full flex flex-col justify-center will-change-[transform,opacity,filter] max-w-[490px] xl:max-w-[520px] mx-auto lg:mx-0"
              >
                {/* Row 1: Pill Badge + Turning Brand */}
                <div className="flex items-center gap-2.5 sm:gap-3 mb-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-black/35 text-[10px] sm:text-[11px] tracking-[0.16em] uppercase font-segoe font-medium text-[#121212] shrink-0 bg-[#F8F6F0]/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                    {missionBadge}
                  </div>
                  <h3 className="font-voyage text-2xl sm:text-3xl md:text-[34px] lg:text-[32px] xl:text-[38px] 2xl:text-[46px] text-[#121212] font-normal leading-[1.08] tracking-tight">
                    {missionHeadingPart1}
                  </h3>
                </div>

                {/* Row 2: Vision Into Reality. */}
                <h3 className="font-voyage text-2xl sm:text-3xl md:text-[34px] lg:text-[32px] xl:text-[38px] 2xl:text-[46px] text-[#121212] font-normal leading-[1.08] tracking-tight mb-2.5 sm:mb-3 lg:mb-2.5 xl:mb-3.5 2xl:mb-5">
                  {missionHeadingPart2}
                </h3>

                {/* Mission Paragraphs with line reveal */}
                <div className="space-y-2.5 sm:space-y-3 xl:space-y-3.5 2xl:space-y-4 text-xs sm:text-[13px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] font-segoe text-[#4a4a4a] font-normal leading-[1.55] xl:leading-[1.6]">
                  <ParagraphLineReveal
                    text={missionParagraph1}
                    triggerOnScroll={false}
                    className="max-w-[485px]"
                  />
                  <ParagraphLineReveal
                    text={missionParagraph2}
                    triggerOnScroll={false}
                    className="max-w-[360px] sm:max-w-[400px] lg:max-w-[410px] xl:max-w-[430px]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* STAGE 2: OUR VISION (Content Left, Vision Image Right)   */}
          {/* ======================================================= */}
          <div
            ref={visionStageRef}
            className="w-full flex items-center justify-center lg:absolute lg:inset-0 will-change-[opacity,transform,filter] mt-12 lg:mt-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center w-full">
              {/* Left Column: Vision Content (Reveals Smoothly from Left) */}
              <div
                ref={visionLeftContentRef}
                className="w-full flex flex-col justify-center will-change-[transform,opacity,filter] max-w-[490px] xl:max-w-[520px] mx-auto lg:mx-0 order-2 lg:order-1"
              >
                {/* Row 1: Pill Badge + Built on Trust. */}
                <div className="flex items-center gap-2.5 sm:gap-3 mb-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-black/35 text-[10px] sm:text-[11px] tracking-[0.16em] uppercase font-segoe font-medium text-[#121212] shrink-0 bg-[#F8F6F0]/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                    {visionBadge}
                  </div>
                  <h3 className="font-voyage text-2xl sm:text-3xl md:text-[34px] lg:text-[32px] xl:text-[38px] 2xl:text-[46px] text-[#121212] font-normal leading-[1.08] tracking-tight">
                    {visionHeadingPart1}
                  </h3>
                </div>

                {/* Row 2: Driven by Purpose. */}
                <h3 className="font-voyage text-2xl sm:text-3xl md:text-[34px] lg:text-[32px] xl:text-[38px] 2xl:text-[46px] text-[#121212] font-normal leading-[1.08] tracking-tight mb-2.5 sm:mb-3 lg:mb-2.5 xl:mb-3.5 2xl:mb-5">
                  {visionHeadingPart2}
                </h3>

                {/* Vision Paragraphs with line reveal */}
                <div className="space-y-2.5 sm:space-y-3 xl:space-y-3.5 2xl:space-y-4 text-xs sm:text-[13px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] font-segoe text-[#4a4a4a] font-normal leading-[1.55] xl:leading-[1.6]">
                  <ParagraphLineReveal
                    text={visionParagraph1}
                    triggerOnScroll={false}
                    className="max-w-[485px]"
                  />
                  <ParagraphLineReveal
                    text={visionParagraph2}
                    triggerOnScroll={false}
                    className="max-w-[485px] sm:max-w-[490px]"
                  />
                </div>
              </div>

              {/* Right Column: Strategic Vision Image (Glides Center -> Right) */}
              <div
                ref={visionImageMotionRef}
                className="w-full flex justify-center lg:justify-start will-change-[transform,opacity,filter] order-1 lg:order-2"
              >
                <div
                  ref={visionImageInnerRef}
                  className="relative flex items-center justify-center w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[480px] xl:max-w-[520px]"
                >
                  <Image
                    src={visionImageSrc}
                    alt={visionImageAlt}
                    width={718}
                    height={538}
                    priority
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 520px"
                    className="w-full h-auto max-h-[46vh] sm:max-h-[48vh] lg:max-h-[48vh] xl:max-h-[52vh] 2xl:max-h-[58vh] object-contain select-none pointer-events-none drop-shadow-[0_20px_42px_rgba(0,0,0,0.08)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* STAGE 3: OUR VALUES (Values Image Left, Content Right)   */}
          {/* ======================================================= */}
          <div
            ref={valuesStageRef}
            className="w-full flex items-center justify-center lg:absolute lg:inset-0 will-change-[opacity,transform,filter] mt-12 lg:mt-0"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 xl:gap-12 items-center w-full">
              {/* Left Column: Strategic Partnership Image (Glides Center -> Left) */}
              <div
                ref={valuesImageMotionRef}
                className="w-full flex justify-center lg:justify-start will-change-[transform,opacity,filter]"
              >
                <div
                  ref={valuesImageInnerRef}
                  className="relative flex items-center justify-center w-full max-w-[420px] sm:max-w-[460px] lg:max-w-[480px] xl:max-w-[520px]"
                >
                  <Image
                    src={valuesImageSrc}
                    alt={valuesImageAlt}
                    width={704}
                    height={580}
                    priority
                    onLoad={() => ScrollTrigger.refresh()}
                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 520px"
                    className="w-full h-auto max-h-[46vh] sm:max-h-[48vh] lg:max-h-[48vh] xl:max-h-[52vh] 2xl:max-h-[58vh] object-contain select-none pointer-events-none drop-shadow-[0_20px_42px_rgba(0,0,0,0.08)]"
                  />
                </div>
              </div>

              {/* Right Column: Values Content (Reveals Smoothly from Right) */}
              <div
                ref={valuesRightContentRef}
                className="w-full flex flex-col justify-center will-change-[transform,opacity,filter] max-w-[490px] xl:max-w-[520px] mx-auto lg:mx-0"
              >
                {/* Row 1: Pill Badge + Shaping Future */}
                <div className="flex items-center gap-2.5 sm:gap-3 mb-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full border border-black/35 text-[10px] sm:text-[11px] tracking-[0.16em] uppercase font-segoe font-medium text-[#121212] shrink-0 bg-[#F8F6F0]/80">
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                    {valuesBadge}
                  </div>
                  <h3 className="font-voyage text-2xl sm:text-3xl md:text-[34px] lg:text-[32px] xl:text-[38px] 2xl:text-[46px] text-[#121212] font-normal leading-[1.08] tracking-tight">
                    {valuesHeadingPart1}
                  </h3>
                </div>

                {/* Row 2: of Real Estate Branding. */}
                <h3 className="font-voyage text-2xl sm:text-3xl md:text-[34px] lg:text-[32px] xl:text-[38px] 2xl:text-[46px] text-[#121212] font-normal leading-[1.08] tracking-tight mb-2.5 sm:mb-3 lg:mb-2.5 xl:mb-3.5 2xl:mb-5">
                  {valuesHeadingPart2}
                </h3>

                {/* Values Paragraphs with line reveal: Exact 3 Lines Each Matching Figma Specifications */}
                <div className="space-y-2.5 sm:space-y-3 xl:space-y-3.5 2xl:space-y-4 text-xs sm:text-[13px] lg:text-[13px] xl:text-[14px] 2xl:text-[15px] font-segoe text-[#4a4a4a] font-normal leading-[1.55] xl:leading-[1.6]">
                  <ParagraphLineReveal
                    text={valuesParagraph1}
                    triggerOnScroll={false}
                    className="max-w-[485px]"
                  />
                  <ParagraphLineReveal
                    text={valuesParagraph2}
                    triggerOnScroll={false}
                    className="max-w-[485px] sm:max-w-[490px]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
