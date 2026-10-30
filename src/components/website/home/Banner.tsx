"use client";

import Image from "next/image";
import type { BannerData, BannerSlideItem } from "@/types/home";

const DEFAULT_SLIDER_COL1: BannerSlideItem[] = [
  { src: "/images/slider/slider1.png", alt: "Tribeca Apex" },
  { src: "/images/slider/slider2.png", alt: "Hindustan Times Feature" },
  { src: "/images/slider/slider1.png", alt: "Tribeca Apex" },
  { src: "/images/slider/slider2.png", alt: "Hindustan Times Feature" },
];

const DEFAULT_SLIDER_COL2: BannerSlideItem[] = [
  { src: "/images/slider/slider4.png", alt: "Luxury Estate" },
  { src: "/images/slider/slider3.png", alt: "A Night of Prestige" },
  { src: "/images/slider/slider4.png", alt: "Luxury Estate" },
  { src: "/images/slider/slider3.png", alt: "A Night of Prestige" },
];

const DEFAULT_SLIDER_COL3: BannerSlideItem[] = [
  { src: "/images/slider/slider2.png", alt: "Architectural Showcase" },
  { src: "/images/slider/slider4.png", alt: "Where Morning Meets Sky" },
  { src: "/images/slider/slider1.png", alt: "Tribeca Edition" },
  { src: "/images/slider/slider3.png", alt: "Exclusive Gala" },
];

interface BannerProps {
  data?: BannerData;
}

export default function Banner({ data }: BannerProps) {
  const sliderCol1 =
    data?.sliderCol1 && data.sliderCol1.length > 0
      ? data.sliderCol1
      : DEFAULT_SLIDER_COL1;
  const sliderCol2 =
    data?.sliderCol2 && data.sliderCol2.length > 0
      ? data.sliderCol2
      : DEFAULT_SLIDER_COL2;
  const sliderCol3 =
    data?.sliderCol3 && data.sliderCol3.length > 0
      ? data.sliderCol3
      : DEFAULT_SLIDER_COL3;

  const headingLine1 = data?.headingLine1 ?? "WE HELP BRIDGE";
  const headingLine2Prefix = data?.headingLine2Prefix ?? "THE GAP IN";
  const headingLine2Highlight = data?.headingLine2Highlight ?? "BRANDING";
  const headingLine3Highlight = data?.headingLine3Highlight ?? "DIGITAL MARKETING";
  const headingLine3Suffix = data?.headingLine3Suffix ?? "&";
  const headingLine4Prefix = data?.headingLine4Prefix ?? "DOUBLE-DIGIT";
  const headingLine4Highlight = data?.headingLine4Highlight ?? "GROWTH";
  const description =
    data?.description ??
    "Specialising in Real estate clients — industry giants to boutique concepts.";
  const buttonText = data?.buttonText ?? "KNOW MORE";
  const buttonLink = data?.buttonLink ?? "#work";
  const scrollText = data?.scrollText ?? "SCROLL TO EXPLORE";

  return (
    <section
      id="hero"
      className="relative w-full h-screen min-h-screen overflow-hidden flex flex-col justify-between container-padding pt-24 sm:pt-28 lg:pt-32 pb-8 bg-[#F8F6F0]"
    >
      {/* 1. Background Texture */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/images/texture/bg-texture.png"
          alt="Background Texture"
          fill
          className="object-cover object-center opacity-85 mix-blend-multiply"
          priority
        />
      </div>

      {/* 2. Concentric Ambient Circles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden md:block">
        <div className="absolute top-[-5%] left-[8%] xl:left-[14%] 2xl:left-[18%] w-[1350px] h-[1350px] transform rotate-[28deg] origin-center">
          {/* Solid Circle */}
          <div
            style={{
              position: "absolute",
              top: "156px",
              left: "156px",
              width: "988px",
              height: "988px",
            }}
            className="opacity-25"
          >
            <Image
              src="/images/texture/circle.png"
              alt="Concentric Circle"
              width={988}
              height={988}
              className="w-full h-full object-contain"
              priority
            />
          </div>

          {/* Dotted Circle */}
          <div
            style={{
              position: "absolute",
              top: "13px",
              left: "13px",
              width: "1274px",
              height: "1274px",
            }}
            className="opacity-25"
          >
            <Image
              src="/images/texture/circle-dotted.png"
              alt="Concentric Circle Dotted"
              width={1274}
              height={1274}
              className="w-full h-full object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* 3. Main Center Content Area: Left content with controlled width */}
      <div className="relative z-10 w-full my-auto flex items-center">
        {/* Left Container */}
        <div className="w-full max-w-[500px] sm:max-w-[580px] lg:max-w-[480px] xl:max-w-[580px] 2xl:max-w-[680px] flex flex-col justify-between py-2">
          <h1 className="font-segoe font-light select-none text-[#171717] [font-variant:small-caps] text-[28px] sm:text-[34px] md:text-[40px] lg:text-[44px] lg:leading-[50px] xl:text-[54px] xl:leading-[60px] xl:tracking-[-1px] 2xl:text-[54px] 2xl:leading-[74px] 2xl:tracking-[-1.26px]">
            {/* Line 1 */}
            <div className="whitespace-nowrap">{headingLine1}</div>

            {/* Line 2 */}
            <div className="whitespace-nowrap flex items-center gap-x-2 sm:gap-x-2.5 2xl:gap-x-3 mt-1 2xl:mt-1.5">
              <span>{headingLine2Prefix}</span>
              <span className="font-normal uppercase text-[#121212] bg-[#F4CFDF] px-2 sm:px-2.5 2xl:px-3.5 py-0 sm:py-0.5 rounded-none text-[24px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[48px] 2xl:text-[54px] 2xl:leading-[74px]">
                {headingLine2Highlight}
              </span>
            </div>

            {/* Line 3 */}
            <div className="whitespace-nowrap flex items-center gap-x-2 sm:gap-x-2.5 2xl:gap-x-3 mt-1 2xl:mt-1.5">
              <span className="font-normal uppercase text-[#121212] bg-[#FDF097] px-2 sm:px-2.5 2xl:px-3.5 py-0 sm:py-0.5 rounded-none text-[24px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[48px] 2xl:text-[54px] 2xl:leading-[74px]">
                {headingLine3Highlight}
              </span>
              <span>{headingLine3Suffix}</span>
            </div>

            {/* Line 4 */}
            <div className="whitespace-nowrap flex items-center gap-x-2 sm:gap-x-2.5 2xl:gap-x-3 mt-1 2xl:mt-1.5">
              <span>{headingLine4Prefix}</span>
              <span className="font-normal uppercase text-[#121212] bg-[#C5EAF9] px-2 sm:px-2.5 2xl:px-3.5 py-0 sm:py-0.5 rounded-none text-[24px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[48px] 2xl:text-[54px] 2xl:leading-[74px]">
                {headingLine4Highlight}
              </span>
            </div>
          </h1>

          {/* Subtext Paragraph */}
          <p className="font-segoe font-normal text-[#404040] text-sm sm:text-base xl:text-[17px] xl:leading-[28px] 2xl:text-[19px] 2xl:leading-[34px] max-w-lg my-4 sm:my-5">
            {description}
          </p>

          {/* CTA Button */}
          <div>
            <a
              href={buttonLink}
              className="group inline-flex items-center gap-3 sm:gap-4 select-none cursor-pointer"
            >
              <div className="w-10 h-10 2xl:w-11 2xl:h-11 rounded-full border border-black/40 flex items-center justify-center transition-all duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="transform group-hover:translate-x-0.5 transition-transform"
                >
                  <path
                    d="M3 8H13M13 8L8.5 3.5M13 8L8.5 12.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              <span className="font-segoe font-medium text-xs sm:text-sm tracking-[0.14em] uppercase text-[#171717] group-hover:text-black">
                {buttonText}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* 4. Desktop Right Auto-Slider */}
      <div
        className="hidden lg:block absolute top-[-10vh] bottom-[-10vh] w-[48vw] xl:w-[46vw] 2xl:w-[44vw] h-[120vh] overflow-visible pointer-events-auto z-40 border-none"
        style={{ right: "-190px" }}
      >
        <div className="w-full h-full transform rotate-[15deg] origin-center flex justify-end gap-3.5 2xl:gap-5 border-none">
          {/* Column 1 */}
          <div className="flex flex-col gap-3.5 2xl:gap-5 animate-slider-up w-[210px] xl:w-[245px] 2xl:w-[285px] flex-shrink-0 border-none">
            {sliderCol1.map((img, idx) => (
              <div
                key={`desk-col1-${idx}`}
                className="relative w-full h-[370px] xl:h-[435px] 2xl:h-[505px] rounded-none overflow-hidden shadow-2xl bg-[#171717] flex-shrink-0 transition-transform duration-300 hover:scale-[1.02] border-none"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover rounded-none"
                  sizes="300px"
                  priority={idx < 2}
                />
              </div>
            ))}
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3.5 2xl:gap-5 animate-slider-down w-[210px] xl:w-[245px] 2xl:w-[285px] flex-shrink-0 border-none">
            {sliderCol2.map((img, idx) => (
              <div
                key={`desk-col2-${idx}`}
                className="relative w-full h-[370px] xl:h-[435px] 2xl:h-[505px] rounded-none overflow-hidden shadow-2xl bg-[#171717] flex-shrink-0 transition-transform duration-300 hover:scale-[1.02] border-none"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover rounded-none"
                  sizes="300px"
                  priority={idx < 2}
                />
              </div>
            ))}
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-3.5 2xl:gap-5 animate-slider-up w-[210px] xl:w-[245px] 2xl:w-[285px] flex-shrink-0 border-none">
            {sliderCol3.map((img, idx) => (
              <div
                key={`desk-col3-${idx}`}
                className="relative w-full h-[370px] xl:h-[435px] 2xl:h-[505px] rounded-none overflow-hidden shadow-2xl bg-[#171717] flex-shrink-0 transition-transform duration-300 hover:scale-[1.02] border-none"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover rounded-none"
                  sizes="300px"
                  priority={idx < 2}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Auto-Slider (< 1024px) */}
      <div className="block lg:hidden relative w-full h-[320px] sm:h-[420px] overflow-hidden my-6 pointer-events-auto z-20">
        <div className="w-full h-full transform rotate-[15deg] scale-[1.05] grid grid-cols-2 gap-3 sm:gap-4">
          <div className="flex flex-col gap-3 sm:gap-4 animate-slider-up">
            {sliderCol1.map((img, idx) => (
              <div
                key={`mob-col1-${idx}`}
                className="relative w-full h-[220px] sm:h-[280px] rounded-none overflow-hidden shadow-lg bg-[#171717] flex-shrink-0"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover rounded-none"
                  sizes="50vw"
                />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-3 sm:gap-4 animate-slider-down">
            {sliderCol2.map((img, idx) => (
              <div
                key={`mob-col2-${idx}`}
                className="relative w-full h-[220px] sm:h-[280px] rounded-none overflow-hidden shadow-lg bg-[#171717] flex-shrink-0"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover rounded-none"
                  sizes="50vw"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Bottom Indicator: SCROLL TO EXPLORE — */}
      <div className="relative z-10 w-full pt-4 flex items-center justify-between text-[10px] sm:text-[11px] font-mono tracking-[0.25em] text-[#808080] uppercase">
        <div className="flex items-center gap-2">
          <span>{scrollText}</span>
          <span className="w-8 h-[1px] bg-[#808080] inline-block" />
        </div>
      </div>
    </section>
  );
}
