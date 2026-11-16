"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { SubHeading } from "@/components/common/Typography";
import ContentReveal from "@/components/animations/ContentReveal";
import CharBlurDissolveHeading from "@/components/animations/CharBlurDissolveHeading";
import ParagraphLineReveal from "@/components/animations/ParagraphLineReveal";
import { cn } from "@/utils/cn";

export interface CommonBannerProps {
  eyebrow?: string;
  heading: string;
  imageSrc: string;
  imageAlt?: string;
  description?: string;
  // Customization class props so other page banners with slightly different design
  // can be easily customized without disturbing existing banner UI standards
  className?: string;
  containerClassName?: string;
  eyebrowClassName?: string;
  headingClassName?: string;
  imageWrapperClassName?: string;
  imageClassName?: string;
  descriptionClassName?: string;
}

export default function CommonBanner({
  eyebrow,
  heading,
  imageSrc,
  imageAlt,
  description,
  className,
  containerClassName,
  eyebrowClassName,
  headingClassName,
  imageWrapperClassName,
  imageClassName,
  descriptionClassName,
}: CommonBannerProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const imageEl = imageWrapperRef.current;
    if (!imageEl) return;

    // Smooth bottom-to-top reveal animation matching GTF banner image standards
    gsap.set(imageEl, {
      opacity: 0,
      y: 60,
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
      delay: 0.3,
    });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        "relative w-full bg-transparent overflow-hidden select-none container-padding",
        "pt-24 sm:pt-28 pb-12 sm:pb-16",
        "lg:min-h-screen lg:h-screen lg:min-h-[100dvh] lg:h-[100dvh] lg:pt-28 xl:pt-32 2xl:pt-36 lg:pb-12 xl:pb-16 2xl:pb-20",
        "flex flex-col justify-start items-center",
        className
      )}
    >
      <div
        className={cn(
          "relative z-10 w-full max-w-[1440px] 2xl:max-w-[1560px] mx-auto flex flex-col items-center justify-start",
          containerClassName
        )}
      >
        {/* 1. Eyebrow / Category Tag */}
        {eyebrow && (
          <ContentReveal
            triggerOnScroll
            duration={0.6}
            yOffset={12}
            blurAmount={6}
            className="text-center mb-1.5 sm:mb-2 lg:mb-2.5"
          >
            <SubHeading
              className={cn(
                "font-segoe text-[10px] sm:text-xs tracking-[0.25em] text-[#000000] font-normal uppercase",
                eyebrowClassName
              )}
            >
              {eyebrow}
            </SubHeading>
          </ContentReveal>
        )}

        {/* 2. Main Heading: Voyage Serif + Char Blur Dissolve */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-6 xl:mb-8">
          <CharBlurDissolveHeading
            text={heading}
            as="h1"
            start="top 85%"
            className={cn(
              "font-voyage text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[80px] 2xl:text-[100px] text-[#121212] font-normal leading-[1.05] tracking-tight text-center",
              headingClassName
            )}
          />
        </div>

        {/* 3. Feature Visual Image */}
        <div
          ref={imageWrapperRef}
          className={cn(
            "relative w-full max-w-[460px] sm:max-w-[520px] md:max-w-[580px] lg:max-w-[620px] xl:max-w-[680px] 2xl:max-w-[840px] mx-auto flex justify-center will-change-[transform,opacity,filter] mb-4 sm:mb-6 lg:mb-6 xl:mb-8",
            imageWrapperClassName
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt || heading}
            width={1042}
            height={320}
            priority
            className={cn(
              "w-full h-auto max-h-[180px] sm:max-h-[220px] lg:max-h-[240px] xl:max-h-[260px] 2xl:max-h-[440px] object-contain select-none pointer-events-none",
              imageClassName
            )}
          />
        </div>

        {/* 4. Section Paragraph with Line Reveal Animation */}
        {description && (
          <div className="w-full max-w-[560px] mx-auto text-center">
            <ParagraphLineReveal
              text={description}
              triggerOnScroll
              start="top 85%"
              className={cn(
                "font-segoe text-xs sm:text-[13px] lg:text-[13px] xl:text-sm text-[#484848] font-normal leading-[1.65] text-center max-w-[520px] mx-auto",
                descriptionClassName
              )}
            />
          </div>
        )}
      </div>
    </section>
  );
}

