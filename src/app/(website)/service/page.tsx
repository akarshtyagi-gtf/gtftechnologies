import type { Metadata } from "next";
import CommonBanner from "@/components/common/CommonBanner";
import ServiceListSection from "@/components/website/service/ServiceListSection";

export const metadata: Metadata = {
  title: "Services | GTF Technologies",
  description:
    "We create unique real estate brands with strategic thinking and design. Discover GTF Technologies' comprehensive suite of brand and digital services.",
};

export default function ServicesPage() {
  return (
    <main className="w-full min-h-screen bg-transparent">
      {/* 1. Services Main Hero Banner (Matching Figma Specifications) */}
      <CommonBanner
        eyebrow="G T F"
        heading="Services"
        imageSrc="/images/service/service_banner2.webp"
        imageAlt="GTF Technologies Services Showcase"
        className="relative w-full bg-transparent overflow-hidden select-none pt-24 sm:pt-28 lg:pt-28 xl:pt-32 pb-8 sm:pb-10 lg:pb-12 container-padding"
        imageWrapperClassName="relative w-full max-w-[560px] sm:max-w-[680px] md:max-w-[780px] lg:max-w-[880px] xl:max-w-[860px] mx-auto flex justify-center will-change-[transform,opacity,filter] mb-6 sm:mb-8 lg:mb-10"
        description="We create unique real estate brands with strategic thinking and design."
        descriptionClassName="font-segoe text-xs sm:text-[13px] lg:text-[13.5px] xl:text-[14px] text-[#484848] font-normal leading-[1.65] text-center max-w-[520px] mx-auto"
      />

      {/* 2. Interactive Pinned Service List Animation Section */}
      <ServiceListSection />
    </main>
  );
}

