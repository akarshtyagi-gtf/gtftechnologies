import type { Metadata } from "next";
import AboutUsBanner, { AboutUsBannerData } from "@/components/website/about-us/AboutUsBanner";
import WhoWeAre, { WhoWeAreData } from "@/components/website/about-us/WhoWeAre";

export const metadata: Metadata = {
  title: "About Us | GTF Technologies",
  description:
    "GTF Technologies is a performance-driven digital media agency with 17+ years of expertise, connecting brands with strategic marketing and creative solutions.",
};

// 1. Banner Content Contract
const aboutUsContent: AboutUsBannerData = {
  eyebrow: "WHO WE ARE",
  heading: "About Us",
  imageSrc: "/images/about-us/founder_GTF.webp",
  imageAlt: "GTF Technologies Founder & Leadership Team",
  statement:
    "GTF Technologies is a performance-driven digital media agency with 17+ years of expertise, connecting brands with strategic marketing and creative solutions.",
};

// 2. Who We Are Section Content Contract matching Figma specifications
const whoWeAreContent: WhoWeAreData = {
  heading: "Who we are",
  subtitlePrefix: "Building Brands. ",
  subtitleHighlight: "Driving Growth.",
  description:
    "We understand search behaviour and customer psychology to create brand connections. By merging online and offline channels, we help businesses enhance engagement and unlock growth opportunities.",
  missionBadge: "OUR MISSION",
  missionHeadingPart1: "Turning Brand",
  missionHeadingPart2: "Vision Into Reality.",
  missionParagraph1:
    "Our mission is to provide user-friendly digital marketing solutions for current and future needs. At Milestone, we help clients create a strong digital presence and",
  missionParagraph2:
    "effective marketing strategies to grow their businesses and achieve their goals. Great work comes from a pure heart and innovative mind.",
  missionImageSrc: "/images/about-us/our_mission.webp",
  missionImageAlt: "GTF Technologies Strategic Chess Pieces Our Mission",
};

export default function AboutGtfPage() {
  return (
    <main className="w-full min-h-screen bg-[#F8F6F0]">
      <AboutUsBanner data={aboutUsContent} />
      <WhoWeAre data={whoWeAreContent} />
    </main>
  );
}
