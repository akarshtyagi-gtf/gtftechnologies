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

// 2. Who We Are Section Content Contract (Includes Mission & Vision)
const whoWeAreContent: WhoWeAreData = {
  heading: "Who we are",
  subtitlePrefix: "Building Brands. ",
  subtitleHighlight: "Driving Growth.",
  description:
    "We understand search behaviour and customer psychology to create brand connections. By merging online and offline channels, we help businesses enhance engagement and unlock growth opportunities.",
  // Mission Data
  missionBadge: "OUR MISSION",
  missionHeadingPart1: "Turning Brand",
  missionHeadingPart2: "Vision Into Reality.",
  missionParagraph1:
    "Our mission is to provide user-friendly digital marketing solutions for current and future needs. At Milestone, we help clients create a strong digital presence and",
  missionParagraph2:
    "effective marketing strategies to grow their businesses and achieve their goals. Great work comes from a pure heart and innovative mind.",
  missionImageSrc: "/images/about-us/our_mission.webp",
  missionImageAlt: "GTF Technologies Strategic Chess Pieces Our Mission",
  // Vision Data
  visionBadge: "OUR VISION",
  visionHeadingPart1: "Built on Trust.",
  visionHeadingPart2: "Driven by Purpose.",
  visionParagraph1:
    "At GTF Technologies, we redefine real estate marketing by creating digital ecosystems where brands inspire. We merge creativity, technology, and strategy into",
  visionParagraph2:
    "impactful experiences. Through storytelling and data-driven strategies, we envision a future where our partners achieve visibility, engagement, and market leadership.",
  visionImageSrc: "/images/about-us/our_vision.webp",
  visionImageAlt: "GTF Technologies Vision Binoculars Built on Trust",
  // Values Data
  valuesBadge: "OUR VALUES",
  valuesHeadingPart1: "Shaping Future",
  valuesHeadingPart2: "of Real Estate Branding,",
  valuesParagraph1:
    "We build our business's best abilities, share information, and provide essential tools to keep up with today's technology. We aim for excellence in our work and are trusted by clients",
  valuesParagraph2:
    "to deliver results. Our planning is consultative and strategic, executed with creativity and integrity, becoming an extension of the client's team.",
  valuesImageSrc: "/images/about-us/our_value.webp",
  valuesImageAlt: "GTF Technologies Partnership Shaping Future of Real Estate Branding",
};

export default function AboutGtfPage() {
  return (
    <main className="w-full min-h-screen bg-transparent">
      <AboutUsBanner data={aboutUsContent} />
      <WhoWeAre data={whoWeAreContent} />
    </main>
  );
}
