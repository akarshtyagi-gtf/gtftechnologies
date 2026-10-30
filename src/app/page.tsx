import SmoothScroll from "@/components/animations/SmoothScroll";
import SvgLineCursor from "@/components/animations/SvgLineCursor";
import Header from "@/components/Header";
import Banner from "@/components/website/home/Banner";
import OurWork from "@/components/website/home/OurWork";
import OurTrust from "@/components/website/home/OurTrust";
import OurServices from "@/components/website/home/OurServices";
import MapSection from "@/components/website/home/MapSection";
import WhyUs from "@/components/website/home/WhyUs";
import WeThinkBig from "@/components/website/home/WeThinkBig";
import LetsTalk from "@/components/website/home/LetsTalk";
import DrivenByResults from "@/components/website/home/DrivenByResults";
import ConnectUs from "@/components/website/home/ConnectUs";
import FooterAcrossIndia from "@/components/website/home/FooterAcrossIndia";
import type { OurWorkData, OurServicesData } from "@/types/home";

// Server-side data for Home Page (clean content without width, height, aspectClass, or colors)
const ourServicesData: OurServicesData = {
  tagline: "OUR SERVICES",
  buttonText: "EXPLORE SERVICES",
  services: [
    {
      id: "service-1",
      counter: "01 / 05",
      tagline: "OUR SERVICES",
      titleLight: "BRAND",
      titleHighlight: "STRATEGY",
      buttonText: "EXPLORE SERVICES",
      description:
        "WE CREATE UNIQUE BRAND IDENTITIES AND STRATEGIES THAT HELP BUSINESSES CONNECT AND GROW.",
      badges: [
        "Competitor Analysis",
        "Brand Creation",
        "Brand Audits",
        "Concept Development",
        "Brand Hallmarks",
        "Target Segmentation",
      ],
      card: {
        id: "card-1",
        title: "Brand Strategy Chess",
        image: "/images/our-service/cardstack1.webp",
        alt: "Brand Strategy Chess King - Front Card",
      },
    },
    {
      id: "service-2",
      counter: "02 / 05",
      tagline: "OUR SERVICES",
      titleLight: "SOCIAL MEDIA",
      titleHighlight: "AMPLIFICATION",
      buttonText: "EXPLORE SERVICES",
      description:
        "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. SED DO EIUSMOD TEMPOR INCIDIDUNT UT LABORE ET DOLORE MAGNA ALIQUA.",
      badges: [
        "Content Creation",
        "Community Management",
        "Influencer Outreach",
        "Paid Campaigns",
        "Viral Growth",
        "Analytics & Insights",
      ],
      card: {
        id: "card-2",
        title: "Social Media Designs",
        image: "/images/our-service/card-stack3.webp",
        alt: "Grow Your Business with Powerful Social Media Designs",
      },
    },
    {
      id: "service-3",
      counter: "03 / 05",
      tagline: "OUR SERVICES",
      titleLight: "WEBSITE",
      titleHighlight: "CREATIVE",
      buttonText: "EXPLORE SERVICES",
      description:
        "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. UT ENIM AD MINIM VENIAM, QUIS NOSTRUD EXERCITATION ULLAMCO LABORIS NISI.",
      badges: [
        "UI/UX Design",
        "Next.js Development",
        "Interactive 3D",
        "Performance Tuning",
        "E-Commerce",
        "Headless CMS",
      ],
      card: {
        id: "card-3",
        title: "Web Development",
        image: "/images/our-service/card-stack2.webp",
        alt: "Build Your Website Laptop",
      },
    },
    {
      id: "service-4",
      counter: "04 / 05",
      tagline: "OUR SERVICES",
      titleLight: "DIGITAL",
      titleHighlight: "MARKETING",
      buttonText: "EXPLORE SERVICES",
      description:
        "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. DUIS AUTE IRURE DOLOR IN REPREHENDERIT IN VOLUPTATE VELIT ESSE CILLUM DOLORE.",
      badges: [
        "Performance Marketing",
        "Search Engine Optimization",
        "Conversion Rate",
        "Audience Targeting",
        "Funnel Automation",
        "ROI Scaling",
      ],
      card: {
        id: "card-4",
        title: "Digital Marketing Acceleration",
        image: "/images/our-service/card-stack4.webp",
        alt: "Digital Marketing Strategy and Growth",
      },
    },
    {
      id: "service-5",
      counter: "05 / 05",
      tagline: "OUR SERVICES",
      titleLight: "AI",
      titleHighlight: "INNOVATION",
      buttonText: "EXPLORE SERVICES",
      description:
        "LOREM IPSUM DOLOR SIT AMET, CONSECTETUR ADIPISCING ELIT. EXCEPTEUR SINT OCCAECAT CUPIDATAT NON PROIDENT, SUNT IN CULPA QUI OFFICIA DESERUNT.",
      badges: [
        "Generative AI",
        "Workflow Automation",
        "Custom LLM Integrations",
        "Predictive Analytics",
        "Cognitive Bots",
        "Data Intelligence",
      ],
      card: {
        id: "card-5",
        title: "AI Innovation & Intelligence",
        image: "/images/our-service/card-stack5.webp",
        alt: "AI Innovation and Autonomous Systems",
      },
    },
  ],
};

const ourWorkData: OurWorkData = {
  tagline: "SCROLL TO EXPLORE",
  headingLine1: "Explore",
  headingLine2: "Work",
  subheading: ["IDEAS", "BEYOND", "ORDINARY"],
  columns: {
    left: [
      {
        id: "left-1",
        title: "Trump Residences",
        subtitle: "The World's Most Powerful Address",
        brand: "Tribeca",
        image: "/images/our-work/work-left1.webp",
        alt: "Tribeca Trump - The World's Most Powerful Address Mobile Experience",
      },
      {
        id: "left-2",
        title: "Skyline Penthouse",
        subtitle: "Architectural Grandeur & Skyline Living",
        brand: "Luxury Living",
        image: "/images/our-work/work-left2.webp",
        alt: "Evening View from Luxury High-Rise Penthouse",
      },
    ],
    centerMain: {
      id: "center-main",
      title: "The Ark - Tribeca Acropolis",
      subtitle: "Voyage to the Stars",
      brand: "Tribeca | Acropolis",
      image: "/images/our-work/work-c1main3.webp",
      alt: "The Ark Tribeca Acropolis Sunset Pergola Lounge",
    },
    centerRow: [
      {
        id: "center-row-1",
        title: "Purvanchal Projects",
        subtitle: "Intelligence In Every Space",
        brand: "Purvanchal",
        image: "/images/our-work/work-c2left.webp",
        alt: "Purvanchal Projects - Intelligence In Every Space",
      },
      {
        id: "center-row-2",
        title: "Arqis Group",
        subtitle: "The Arc of Real Estate",
        brand: "Arqis",
        image: "/images/our-work/work-c3right.webp",
        alt: "Arqis Group - The Arc of Real Estate Outdoor Billboard",
      },
    ],
    right: [
      {
        id: "right-1",
        title: "Eldeco 7 Peaks Residences",
        subtitle: "One Epic Landmark - 3 & 4 BR Residences",
        brand: "Eldeco",
        image: "/images/our-work/work-right1.webp",
        alt: "Eldeco 7 Peaks Residences Highway Billboard Greater Noida",
      },
      {
        id: "right-2",
        title: "M3M Antalya Hills",
        subtitle: "Masterplanned Luxury Residences",
        brand: "M3M",
        image: "/images/our-work/work-right2.webp",
        alt: "M3M Antalya Hills Luxury Residential Architecture",
      },
    ],
  },
};

export default function Home() {
  return (
    <SmoothScroll>
      <SvgLineCursor
        strokeColor="#979797ff"
        strokeWidth={1}
        showCursorDot={false}
      />
      <Header />
      <main className="min-h-screen bg-[#F8F6F0]">
        <Banner />
        <OurWork data={ourWorkData} />
        <OurTrust />
        <OurServices data={ourServicesData} />
        <MapSection />
        <ConnectUs />
        <WhyUs />
        <DrivenByResults />
        <WeThinkBig />
        <LetsTalk />
        <FooterAcrossIndia />
      </main>
    </SmoothScroll>
  );
}
