import Banner from "@/components/website/home/Banner";
import OurWork from "@/components/website/home/OurWork";
import OurTrust from "@/components/website/home/OurTrust";
import OurServices from "@/components/website/home/OurServices";
import MapSection from "@/components/website/home/MapSection";
import ConnectUs from "@/components/website/home/ConnectUs";
import WhyUs from "@/components/website/home/WhyUs";
import DrivenByResults from "@/components/website/home/DrivenByResults";
import WeThinkBig from "@/components/website/home/WeThinkBig";
import LetsTalk from "@/components/website/home/LetsTalk";
import type {
  BannerData,
  OurWorkData,
  OurTrustData,
  OurServicesData,
  MapSectionData,
  ConnectUsData,
  WhyUsData,
  DrivenByResultsData,
  WeThinkBigData,
  LetsTalkData,
} from "@/types/home";

// =========================================================================
// SERVER-SIDE DATA CONTRACT FOR HOMEPAGE
// All section copy, imagery, and links defined centrally on the server.
// =========================================================================

// 1. Banner Data
const bannerData: BannerData = {
  headingLine1: "WE HELP BRIDGE",
  headingLine2Prefix: "THE GAP IN",
  headingLine2Highlight: "BRANDING",
  headingLine3Highlight: "DIGITAL MARKETING",
  headingLine3Suffix: "&",
  headingLine4Prefix: "DOUBLE-DIGIT",
  headingLine4Highlight: "GROWTH",
  description:
    "Specialising in Real estate clients — industry giants to boutique concepts.",
  buttonLink: "#work",
  scrollText: "SCROLL TO EXPLORE",
  sliderCol1: [
    { src: "/images/slider/slider1.png", alt: "Tribeca Apex" },
    { src: "/images/slider/slider2.png", alt: "Hindustan Times Feature" },
    { src: "/images/slider/slider1.png", alt: "Tribeca Apex" },
    { src: "/images/slider/slider2.png", alt: "Hindustan Times Feature" },
  ],
  sliderCol2: [
    { src: "/images/slider/slider4.png", alt: "Luxury Estate" },
    { src: "/images/slider/slider3.png", alt: "A Night of Prestige" },
    { src: "/images/slider/slider4.png", alt: "Luxury Estate" },
    { src: "/images/slider/slider3.png", alt: "A Night of Prestige" },
  ],
  sliderCol3: [
    { src: "/images/slider/slider2.png", alt: "Architectural Showcase" },
    { src: "/images/slider/slider4.png", alt: "Where Morning Meets Sky" },
    { src: "/images/slider/slider1.png", alt: "Tribeca Edition" },
    { src: "/images/slider/slider3.png", alt: "Exclusive Gala" },
  ],
};

// 2. Our Work Data
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

// 3. Our Trust Data (Physics tag pile brands)
const ourTrustData: OurTrustData = {
  tagline: "OUR SERVICES",
  headingPrefix: "We Are",
  headingHighlight: "Trusted",
  description:
    "A growing network of ambitious brands building stronger identities and stronger digital presence with GTF Technologies",
  items: [
    { id: "trust-23", name: "Partner 23", image: "/images/our-trust/asset 23.webp" },
    { id: "trust-24", name: "Partner 24", image: "/images/our-trust/asset 24.webp" },
    { id: "trust-25", name: "Partner 25", image: "/images/our-trust/asset 25.webp" },
    { id: "trust-26", name: "Partner 26", image: "/images/our-trust/asset 26.png" },
    { id: "trust-27", name: "Partner 27", image: "/images/our-trust/asset 27.webp" },
    { id: "trust-28", name: "Partner 28", image: "/images/our-trust/asset 28.webp" },
    { id: "trust-29", name: "Partner 29", image: "/images/our-trust/asset 29.webp" },
    { id: "trust-30", name: "Partner 30", image: "/images/our-trust/asset 30.webp" },
    { id: "trust-31", name: "Partner 31", image: "/images/our-trust/asset 31.webp" },
    { id: "trust-32", name: "Partner 32", image: "/images/our-trust/asset 32.webp" },
    { id: "trust-33", name: "Partner 33", image: "/images/our-trust/asset 33.webp" },
    { id: "trust-34", name: "Partner 34", image: "/images/our-trust/asset 34.webp" },
    { id: "trust-35", name: "Partner 35", image: "/images/our-trust/asset 35.webp" },
    { id: "trust-36", name: "Partner 36", image: "/images/our-trust/asset 36.webp" },
    { id: "trust-37", name: "Partner 37", image: "/images/our-trust/asset 37.webp" },
    { id: "trust-38", name: "Partner 38", image: "/images/our-trust/asset 38.webp" },
    { id: "trust-39", name: "Partner 39", image: "/images/our-trust/asset 39.webp" },
    { id: "trust-40", name: "Partner 40", image: "/images/our-trust/asset 40.webp" },
    { id: "trust-41", name: "Partner 41", image: "/images/our-trust/asset 41.webp" },
    { id: "trust-42", name: "Partner 42", image: "/images/our-trust/asset 42.webp" },
    { id: "trust-43", name: "Partner 43", image: "/images/our-trust/asset 43.webp" },
  ],
};

// 4. Our Services Data
const ourServicesData: OurServicesData = {
  services: [
    {
      id: "service-1",
      counter: "1/5",
      tagline: "OUR SERVICES",
      titleLight: "BRAND",
      titleHighlight: "STRATEGY",
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
      counter: "2/5",
      tagline: "OUR SERVICES",
      titleLight: "SOCIAL MEDIA",
      titleHighlight: "AMPLIFICATION",
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
      counter: "3/5",
      tagline: "OUR SERVICES",
      titleLight: "WEBSITE",
      titleHighlight: "CREATIVE",
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
      counter: "4/5",
      tagline: "OUR SERVICES",
      titleLight: "DIGITAL",
      titleHighlight: "MARKETING",
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
      counter: "5/5",
      tagline: "OUR SERVICES",
      titleLight: "AI",
      titleHighlight: "INNOVATION",
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

// 5. Map Section Data
const mapSectionData: MapSectionData = {
  headingLine1: "You Won't",
  headingLine2Part1: "Find",
  headingLine2Highlight: "Growth",
  headingLine3: "on a Map",
  description:
    "WE COMBINE STRATEGY AND BRANDING TO HELP REAL ESTATE BUSINESSES GROW.",
};

// 6. Connect Us Data
const connectUsData: ConnectUsData = {
  prefixText: "Where",
  title: "Ideas Connect.",
  imageSrc: "/images/connect-us/connect-us.web.webp",
  imageAlt: "Where Ideas Connect - GTF Technologies Digital Workspace",
};

// 7. Why Us Data
const whyUsData: WhyUsData = {
  heading: "Why Us",
  tagline: "OUR",
  taglineHighlight: "EXPERTISE",
  items: [
    {
      id: "why-1",
      number: 1,
      title: "Brand Catalyst",
      description:
        "We Create Unique Brands Through Strategic Positioning And Insights.",
      image: "/images/why-us/catalyst.webp",
      alt: "Brand Catalyst - Strategic Brand Positioning",
    },
    {
      id: "why-2",
      number: 2,
      title: "Master Storytellers",
      description:
        "We Create Visual Experiences That Connect Ideas With Audiences.",
      image: "/images/why-us/storyteller.webp",
      alt: "Master Storytellers - Creative Production Studio",
    },
    {
      id: "why-3",
      number: 3,
      title: "One stop Solution",
      description:
        "We Use Social Media And Marketing To Build Visibility And Generate Leads.",
      image: "/images/why-us/solution.webp",
      alt: "One Stop Solution - Comprehensive Digital Marketing",
    },
    {
      id: "why-4",
      number: 4,
      title: "Digital Innovators",
      description:
        "Transforming Brand Presence With Data-Driven AI And Cutting-Edge Creative Precision.",
      image: "/images/why-us/catalyst.webp",
      alt: "Digital Innovators - AI & High Impact Media",
    },
    {
      id: "why-5",
      number: 5,
      title: "Growth Partners",
      description:
        "Accelerating Market Leadership Through Long-Term Collaborations And Proven ROI.",
      image: "/images/why-us/storyteller.webp",
      alt: "Growth Partners - Long Term Enterprise Success",
    },
  ],
};

// 8. Driven By Results Data
const drivenByResultsData: DrivenByResultsData = {
  tagline: "RECOGNISED FOR EXPERTISE.",
  headingLine1: "Driven By",
  headingLine2Highlight: "Results",
  description:
    "GTF Technologies merges strategy, storytelling, and marketing to help real estate brands stand out. Our Google Ads expertise boosts digital presence and drives measurable growth.",
  videoSrc: "/images/partner/partner.mp4",
  posterSrc: "/images/partner/partership.webp",
};

// 9. We Think Big Data
const weThinkBigData: WeThinkBigData = {
  headingLine1: "We",
  headingLine2Part1: "Think ",
  headingLine2Highlight: "Big.",
  description:
    "Born from Gurukul The Foundation, GTF Technologies is a performance-driven digital media and branding company based in New Delhi. With 17+ years of expertise and 100+ clients, we help real estate brands build visibility, identity, and growth.",
  buttonLink: "#work",
  reels: [
    {
      id: "reel-1",
      tag: "01 / STRATEGY",
      videoSrc: "/images/reel/reel1.mp4",
      alt: "Strategic Brand Foundation",
    },
    {
      id: "reel-2",
      tag: "02 / BRANDS",
      videoSrc: "/images/reel/reel2.mp4",
      alt: "Architectural & Luxury Brand Identity",
    },
    {
      id: "reel-3",
      tag: "03 / GROWTH",
      videoSrc: "/images/reel/reel4.mp4",
      alt: "National Monuments & Landmark Campaigns",
    },
    {
      id: "reel-4",
      tag: "04 / PERFORMANCE",
      videoSrc: "/images/reel/reel5.mp4",
      alt: "High Impact Digital Media Growth",
    },
    {
      id: "reel-5",
      tag: "05 / PRODUCTION",
      videoSrc: "/images/reel/reel6.mp4",
      alt: "Commercial Film & Visual Storytelling",
    },
  ],
};

// 10. Let's Talk Data (Section Header only, form stays client-side)
const letsTalkData: LetsTalkData = {
  heading: "LET'S TALK",
  subheading: "Have a brand",
  subheadingHighlight: "worth remembering?",
};

export default function Home() {
  return (
    <main id="home" className="min-h-screen bg-transparent">
      <Banner data={bannerData} />
      <OurWork data={ourWorkData} />
      <OurTrust data={ourTrustData} />
      <OurServices data={ourServicesData} />
      <MapSection data={mapSectionData} />
      <ConnectUs data={connectUsData} />
      <WhyUs data={whyUsData} />
      <DrivenByResults data={drivenByResultsData} />
      <WeThinkBig data={weThinkBigData} />
      <LetsTalk data={letsTalkData} />
    </main>
  );
}
