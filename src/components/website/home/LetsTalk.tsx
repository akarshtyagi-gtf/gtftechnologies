"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap, ScrollTrigger, splitTextChars } from "@/utils/gsap";
import Button from "@/components/common/Button";
import {
  charBlurInitialVars,
  charBlurAnimateVars,
} from "@/components/animations/CharBlurDissolveHeading";
import type { LetsTalkData } from "@/types/home";

interface LetsTalkProps {
  data: LetsTalkData;
}


const SERVICE_OPTIONS = [
  "Branding",
  "Brand Strategy & Positioning",
  "Social Media Amplification",
  "Website Creative & Development",
  "Digital & Performance Marketing",
  "AI Innovation & Automation",
  "Real Estate Media & 3D Visuals",
  "Comprehensive Growth Mandate",
];

const LOCATION_OPTIONS = [
  "Delhi",
  "Delhi NCR / Noida / Gurugram",
  "Mumbai / MMR",
  "Bengaluru",
  "Hyderabad",
  "Pune",
  "Kolkata",
  "Pan India (Other)",
  "International (Dubai / UK / USA)",
];

export default function LetsTalk({ data }: LetsTalkProps) {
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    emailAddress: "",
    serviceRequired: "",
    projectLocation: "",
    contextMessage: "",
    agreementAccepted: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Animation Refs
  const sectionRef = useRef<HTMLElement>(null);
  const headingCharsRef = useRef<HTMLHeadingElement>(null);
  const subHeadingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // 1. Main Heading characters blur dissolve
      const headingChars =
        headingCharsRef.current?.querySelectorAll<HTMLElement>(
          ".letstalk-char-item"
        );

      if (headingChars && headingChars.length > 0) {
        gsap.set(headingChars, charBlurInitialVars);
      }

      // 2. Subheading initial state
      if (subHeadingRef.current) {
        gsap.set(subHeadingRef.current, {
          opacity: 0,
          y: 20,
          filter: "blur(6px)",
        });
      }

      // 3. Form initial state
      if (formRef.current) {
        gsap.set(formRef.current, {
          opacity: 0,
          y: 30,
          filter: "blur(8px)",
        });
      }

      // Master ScrollTrigger Timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      // A. Reveal Heading Chars
      if (headingChars && headingChars.length > 0) {
        tl.to(
          headingChars,
          {
            ...charBlurAnimateVars,
            duration: 0.95,
            stagger: {
              from: "start",
              amount: 0.35,
              ease: "power2.out",
            },
          },
          0
        );
      }

      // B. Reveal Subheading with highlighter
      if (subHeadingRef.current) {
        tl.to(
          subHeadingRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power2.out",
          },
          0.2
        );
      }

      // C. Reveal Form
      if (formRef.current) {
        tl.to(
          formRef.current,
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.85,
            ease: "power2.out",
          },
          0.35
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 850);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({
      fullName: "",
      emailAddress: "",
      serviceRequired: "",
      projectLocation: "",
      contextMessage: "",
      agreementAccepted: false,
    });
  };

  return (
    <section
      id="lets-talk"
      ref={sectionRef}
      className="relative w-full min-h-[700px] lg:min-h-[820px] xl:min-h-[900px] bg-transparent overflow-hidden select-none flex flex-col justify-center py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32"
    >
      {/* ============================================================== */}
      {/* 1. MAIN CENTERED EDITORIAL CONTAINER                           */}
      {/* ============================================================== */}
      <div className="relative z-10 w-full max-w-[760px] md:max-w-[840px] lg:max-w-[920px] xl:max-w-[980px] mx-auto px-5 sm:px-8 md:px-10 lg:px-12 flex flex-col items-center">
        
        {/* Title: LET'S TALK */}
        <h2
          ref={headingCharsRef}
          className="font-voyage text-[44px] sm:text-[60px] md:text-[76px] lg:text-[92px] xl:text-[104px] text-[#121212] font-normal tracking-tight text-center leading-[0.95] will-change-[transform,opacity,filter] [perspective:1200px]"
        >
          {splitTextChars(data.heading).map((item, idx) => (
            <span
              key={`talk-char-${idx}`}
              className="letstalk-char-item inline-block will-change-[transform,filter,opacity]"
            >
              {item.char === " " ? "\u00A0" : item.char}
            </span>
          ))}
        </h2>

        {/* Subtitle: Have a brand worth remembering? */}
        <div
          ref={subHeadingRef}
          className="mt-3 sm:mt-4 md:mt-5 mb-10 sm:mb-14 md:mb-16 text-center will-change-[transform,opacity,filter]"
        >
          <p className="font-voyage text-base sm:text-lg md:text-xl lg:text-[22px] text-[#121212] font-normal flex items-center justify-center flex-wrap gap-1.5 sm:gap-2">
            <span>{data.subheading}</span>
            <span className="inline-block bg-[#FEEF89] px-2 sm:px-2.5 py-0.5 rounded-[4px] text-[#121212] shadow-[0_1px_4px_rgba(254,239,137,0.35)] font-normal">
              {data.subheadingHighlight}
            </span>
          </p>
        </div>

        {/* Form Container */}
        {isSubmitted ? (
          <div className="w-full py-12 sm:py-16 text-center flex flex-col items-center justify-center bg-white/40 backdrop-blur-sm rounded-2xl border border-black/10 p-8 shadow-sm">
            <div className="w-12 h-12 rounded-full border border-[#121212] flex items-center justify-center mb-4 text-[#121212]">
              <svg
                className="w-5 h-5 text-[#121212]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="font-voyage text-2xl sm:text-3xl text-[#121212] mb-2">
              Conversation Started
            </h3>
            <p className="font-segoe text-xs sm:text-sm text-[#555] max-w-sm mb-6 leading-relaxed">
              Thank you, {formData.fullName || "Partner"}! We have received
              your inquiry and our leadership team will reach out to you selectively.
            </p>
            <Button
              variant="circle-arrow"
              iconPosition="left"
              onClick={handleReset}
            >
              SEND ANOTHER ENQUIRY
            </Button>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="w-full will-change-[transform,opacity,filter]"
          >
            {/* Field 1: Full Name */}
            <div className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-6 border-b border-[#D8D2C6] py-3.5 sm:py-4.5 transition-colors duration-200 focus-within:border-[#121212]">
              <label
                htmlFor="fullName"
                className="font-voyage text-base sm:text-lg text-[#121212] whitespace-nowrap shrink-0 sm:w-[170px] md:w-[190px] select-none"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Armaan Khan"
                className="w-full bg-transparent border-none outline-none font-voyage text-sm sm:text-base text-[#121212] placeholder:text-[#9A9388]/60 placeholder:font-voyage placeholder:text-sm sm:placeholder:text-base transition-colors"
              />
            </div>

            {/* Field 2: Email Address */}
            <div className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-6 border-b border-[#D8D2C6] py-3.5 sm:py-4.5 transition-colors duration-200 focus-within:border-[#121212]">
              <label
                htmlFor="emailAddress"
                className="font-voyage text-base sm:text-lg text-[#121212] whitespace-nowrap shrink-0 sm:w-[170px] md:w-[190px] select-none"
              >
                Email Address
              </label>
              <input
                id="emailAddress"
                type="email"
                name="emailAddress"
                required
                value={formData.emailAddress}
                onChange={handleInputChange}
                placeholder="armaan82@gmail.com"
                className="w-full bg-transparent border-none outline-none font-voyage text-sm sm:text-base text-[#121212] placeholder:text-[#9A9388]/60 placeholder:font-voyage placeholder:text-sm sm:placeholder:text-base transition-colors"
              />
            </div>

            {/* Field 3: Service Required */}
            <div className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-6 border-b border-[#D8D2C6] py-3.5 sm:py-4.5 transition-colors duration-200 focus-within:border-[#121212]">
              <label
                htmlFor="serviceRequired"
                className="font-voyage text-base sm:text-lg text-[#121212] whitespace-nowrap shrink-0 sm:w-[170px] md:w-[190px] select-none"
              >
                Service Required
              </label>
              <div className="relative w-full">
                <input
                  id="serviceRequired"
                  type="text"
                  name="serviceRequired"
                  list="services-list"
                  value={formData.serviceRequired}
                  onChange={handleInputChange}
                  placeholder="Branding"
                  className="w-full bg-transparent border-none outline-none font-voyage text-sm sm:text-base text-[#121212] placeholder:text-[#9A9388]/60 placeholder:font-voyage placeholder:text-sm sm:placeholder:text-base transition-colors pr-6"
                />
                <datalist id="services-list">
                  {SERVICE_OPTIONS.map((srv) => (
                    <option key={srv} value={srv} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Field 4: Project Location */}
            <div className="group flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-6 border-b border-[#D8D2C6] py-3.5 sm:py-4.5 transition-colors duration-200 focus-within:border-[#121212]">
              <label
                htmlFor="projectLocation"
                className="font-voyage text-base sm:text-lg text-[#121212] whitespace-nowrap shrink-0 sm:w-[170px] md:w-[190px] select-none"
              >
                Project Location
              </label>
              <div className="relative w-full">
                <input
                  id="projectLocation"
                  type="text"
                  name="projectLocation"
                  list="locations-list"
                  value={formData.projectLocation}
                  onChange={handleInputChange}
                  placeholder="Delhi"
                  className="w-full bg-transparent border-none outline-none font-voyage text-sm sm:text-base text-[#121212] placeholder:text-[#9A9388]/60 placeholder:font-voyage placeholder:text-sm sm:placeholder:text-base transition-colors pr-6"
                />
                <datalist id="locations-list">
                  {LOCATION_OPTIONS.map((loc) => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
              </div>
            </div>

            {/* Field 5: Context for Reaching out / */}
            <div className="group flex flex-col border-b border-[#D8D2C6] pt-4.5 sm:pt-6 pb-3.5 sm:pb-4.5 transition-colors duration-200 focus-within:border-[#121212]">
              <label
                htmlFor="contextMessage"
                className="font-voyage text-base sm:text-lg text-[#121212] whitespace-nowrap select-none mb-1.5"
              >
                Context for Reaching out /
              </label>
              <textarea
                id="contextMessage"
                name="contextMessage"
                rows={2}
                value={formData.contextMessage}
                onChange={handleInputChange}
                placeholder="I have enquiry about brand, project, or business goals..."
                className="w-full bg-transparent border-none outline-none font-voyage text-sm sm:text-base text-[#121212] placeholder:text-[#9A9388]/60 placeholder:font-voyage placeholder:text-sm sm:placeholder:text-base resize-none transition-colors"
              />
            </div>

            {/* Bottom Row: Checkbox Agreement (Left) & Button (Right) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 sm:pt-8 md:pt-10">
              {/* Checkbox agreement */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none max-w-sm sm:max-w-md group">
                <input
                  type="checkbox"
                  name="agreementAccepted"
                  checked={formData.agreementAccepted}
                  onChange={handleInputChange}
                  className="w-3.5 h-3.5 rounded border border-[#9A9388] text-[#121212] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#121212]"
                />
                <span className="font-segoe text-[11px] sm:text-xs text-[#555555] leading-snug group-hover:text-[#121212] transition-colors">
                  I understand that admission is reviewed selectively and responses may take time.
                </span>
              </label>

              {/* Action Button: Common Component with circle arrow on left */}
              <div className="self-end sm:self-auto shrink-0">
                <Button
                  variant="circle-arrow"
                  iconPosition="left"
                  type="submit"
                  isLoading={isSubmitting}
                  loadingText="SENDING..."
                  className="hover:scale-105 active:scale-95"
                >
                  START A CONVERSATION
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
