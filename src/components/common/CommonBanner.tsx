"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger } from "@/utils/gsap";
import { SubHeading } from "@/components/common/Typography";
import ContentReveal from "@/components/animations/ContentReveal";
import CharBlurDissolveHeading from "@/components/animations/CharBlurDissolveHeading";
import ParagraphLineReveal from "@/components/animations/ParagraphLineReveal";

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
      className={
        className ||
        "relative w-full bg-transparent overflow-hidden select-none pt-24 sm:pt-28 lg:pt-28 xl:pt-32 pb-16 sm:pb-20 lg:pb-24 xl:pb-28 container-padding"
      }
    >
      <div
        className={
          containerClassName ||
          "relative z-10 max-w-[1440px] 2xl:max-w-[1560px] mx-auto flex flex-col items-center"
        }
      >
        {/* 1. Eyebrow / Category Tag */}
        {eyebrow && (
          <ContentReveal
            triggerOnScroll
            duration={0.6}
            yOffset={12}
            blurAmount={6}
            className="text-center mb-2 sm:mb-2.5"
          >
            <SubHeading
              className={
                eyebrowClassName ||
                "font-segoe text-[10px] sm:text-xs tracking-[0.25em] text-[#000000] font-normal uppercase"
              }
            >
              {eyebrow}
            </SubHeading>
          </ContentReveal>
        )}

        {/* 2. Main Heading: Voyage Serif + Char Blur Dissolve */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-10 xl:mb-12">
          <CharBlurDissolveHeading
            text={heading}
            as="h1"
            start="top 85%"
            className={
              headingClassName ||
              "font-voyage text-5xl sm:text-6xl md:text-7xl lg:text-[76px] xl:text-[80px] 2xl:text-[100px] text-[#121212] font-normal leading-[1.05] tracking-tight text-center"
            }
          />
        </div>

        {/* 3. Feature Visual Image */}
        <div
          ref={imageWrapperRef}
          className={
            imageWrapperClassName ||
            "relative w-full max-w-[460px] sm:max-w-[520px] md:max-w-[580px] lg:max-w-[640px] xl:max-w-[700px] mx-auto flex justify-center will-change-[transform,opacity,filter] mb-6 sm:mb-8 lg:mb-10"
          }
        >
          <Image
            src={imageSrc}
            alt={imageAlt || heading}
            width={1042}
            height={320}
            priority
            className={
              imageClassName ||
              "w-full h-auto object-contain select-none pointer-events-none"
            }
          />
        </div>

        {/* 4. Section Paragraph with Line Reveal Animation */}
        {description && (
          <div className="w-full max-w-[560px] mx-auto text-center">
            <ParagraphLineReveal
              text={description}
              triggerOnScroll
              start="top 85%"
              className={
                descriptionClassName ||
                "font-segoe text-xs sm:text-[13px] lg:text-[13px] xl:text-sm text-[#484848] font-normal leading-[1.65] text-center max-w-[520px] mx-auto"
              }
            />
          </div>
        )}
      </div>
    </section>
  );
}

