"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { SubHeading } from "@/components/common/Typography";
import ContentReveal from "@/components/animations/ContentReveal";
import CharBlurDissolveHeading from "@/components/animations/CharBlurDissolveHeading";
import LetterByLetterText from "@/components/animations/LetterByLetterText";

export interface AboutUsBannerData {
  eyebrow: string;
  heading: string;
  imageSrc: string;
  imageAlt: string;
  statement: string;
}

export interface AboutUsBannerProps {
  data: AboutUsBannerData;
}

export default function AboutUsBanner({ data }: AboutUsBannerProps) {
  const { eyebrow, heading, imageSrc, imageAlt, statement } = data;

  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const imageEl = imageWrapperRef.current;
    if (!imageEl) return;

    // Smooth bottom-to-top reveal animation for the founder image
    gsap.set(imageEl, {
      opacity: 0,
      y: 65,
      scale: 0.96,
      filter: "blur(8px)",
    });

    const trigger = sectionRef.current || imageEl;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger,
        start: "top 75%",
        toggleActions: "play none none none",
      },
    });

    tl.to(imageEl, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      duration: 1.15,
      ease: "power3.out",
      delay: 0.35,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#F8F6F0] overflow-hidden select-none pt-20 sm:pt-22 lg:pt-20 xl:pt-22 pb-20 sm:pb-24 lg:pb-28 xl:pb-32 px-4 sm:px-6 lg:px-8"
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

      <div className="relative z-10 max-w-[1440px] 2xl:max-w-[1560px] mx-auto flex flex-col items-center">
        {/* 1. Subheading / Eyebrow: WHO WE ARE (ContentReveal) */}
        <ContentReveal
          triggerOnScroll
          duration={0.6}
          yOffset={12}
          blurAmount={6}
          className="text-center mb-2 sm:mb-1.5"
        >
          <SubHeading className="font-segoe text-[10px] sm:text-xs tracking-[0.25em] text-[#000000] font-normal uppercase">
            {eyebrow}
          </SubHeading>
        </ContentReveal>

        {/* 2. Main Heading: About Us (CharBlurDissolveHeading) */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-0">
          <CharBlurDissolveHeading
            text={heading}
            as="h1"
            start="top 85%"
            className="font-voyage text-5xl sm:text-6xl md:text-6xl lg:text-[68px] xl:text-[76px] 2xl:text-[92px] text-[#121212] font-normal leading-[1.05] tracking-tight text-center"
          />
        </div>

        {/* 3. Founder GTF Image: Uncut natural aspect ratio with smooth bottom-to-top reveal */}
        <div
          ref={imageWrapperRef}
          className="w-full max-w-[1040px] mx-auto flex justify-center will-change-[transform,opacity,filter]"
        >
          <div className="relative w-full max-w-[680px] sm:max-w-[760px] lg:max-w-[800px] xl:max-w-[840px] 2xl:max-w-[940px]">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={1042}
              height={557}
              priority
              sizes="(max-width: 640px) 94vw, (max-width: 1024px) 85vw, (max-width: 1366px) 840px, 940px"
              className="w-full h-auto object-contain select-none drop-shadow-[0_16px_36px_rgba(0,0,0,0.08)] pointer-events-none"
            />
          </div>
        </div>

        {/* 4. Editorial Statement Paragraph: Voyage font 400, #151415 written letter-by-letter, fully responsive and uncut */}
        <div className="w-full max-w-[1140px] mx-auto mt-6 sm:mt-8 lg:mt-6 xl:mt-8 px-4 sm:px-6">
          <LetterByLetterText
            text={statement}
            as="p"
            start="top 80%"
            stagger={0.016}
            className="font-voyage font-normal text-[#151415] text-xl sm:text-2xl md:text-3xl lg:text-[38px] xl:text-[44px] 2xl:text-[48px] leading-[1.32] sm:leading-[1.3] md:leading-[1.28] tracking-tight text-center py-1 overflow-visible"
          />
        </div>
      </div>
    </section>
  );
}
