import type { Metadata } from "next";
import ServicePlatterBanner, {
  ServicePlatterBannerData,
} from "@/components/website/service-platter/ServicePlatterBanner";
import CardCarousel from "@/components/website/service-platter/CardCarousel";
import ResearchTimelineSection from "@/components/website/service-platter/ResearchTimelineSection";

export const metadata: Metadata = {
  title: "Strategy Development | Service Platter | GTF Technologies",
  description:
    "We build meaningful brands through strategy, design, and digital experiences. Discover GTF Technologies' strategy development services.",
};

// Service Platter Banner Content Contract (Matching Figma specifications)
const servicePlatterBannerContent: ServicePlatterBannerData = {
  eyebrow: "BRAND",
  heading: "Strategy Development",
  imageSrc: "/images/service/service_banner.webp",
  imageAlt: "GTF Technologies Strategy Development Compass and Roadmap",
  description:
    "We craft distinctive brands by blending strategic thinking, creative design, and digital innovation to create experiences that truly stand out.",
};

export default function ServicePlatterPage() {
  return (
    <main className="w-full min-h-screen bg-[#F8F6F0] page-fixed-texture">
      {/* 1. Hero Banner: Strategy Development */}
      <ServicePlatterBanner data={servicePlatterBannerContent} />

      {/* 2. Research Timeline 4-Step Section (Directly After Banner) */}
      <ResearchTimelineSection />

      {/* 3. Card Carousel Scene */}
      <CardCarousel />
    </main>
  );
}
