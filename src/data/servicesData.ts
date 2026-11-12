export interface ServiceBannerData {
  eyebrow: string;
  heading: string;
  imageSrc: string;
  imageAlt: string;
  description: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  banner: ServiceBannerData;
}

export const SERVICES_DATA: Record<string, ServiceItem> = {
  "brand-strategy": {
    slug: "brand-strategy",
    title: "Strategy Development",
    metaTitle: "Strategy Development | Service Platter | GTF Technologies",
    metaDescription:
      "We build meaningful brands through strategy, design, and digital experiences. Discover GTF Technologies' strategy development services.",
    banner: {
      eyebrow: "BRAND",
      heading: "Strategy Development",
      imageSrc: "/images/service/service_banner.webp",
      imageAlt: "GTF Technologies Strategy Development Compass and Roadmap",
      description:
        "We craft distinctive brands by blending strategic thinking, creative design, and digital innovation to create experiences that truly stand out.",
    },
  },
  "brand-identity": {
    slug: "brand-identity",
    title: "Brand Identity & Visual Language",
    metaTitle: "Brand Identity & Visual Language | Services | GTF Technologies",
    metaDescription:
      "Crafting expressive visual identities with distinctive typography, generative color systems, and modern aesthetic direction.",
    banner: {
      eyebrow: "VISUAL SYSTEM",
      heading: "Brand Identity",
      imageSrc: "/images/service/brand_strategy.webp",
      imageAlt: "GTF Technologies Brand Identity System",
      description:
        "Crafting expressive visual identities with distinctive typography, generative color systems, and modern aesthetic direction that command authority across digital and physical touchpoints.",
    },
  },
  "messaging-tone": {
    slug: "messaging-tone",
    title: "Messaging & Tone of Voice",
    metaTitle: "Messaging & Tone of Voice | Services | GTF Technologies",
    metaDescription:
      "Developing distinctive verbal personality frameworks that resonate across customer journeys with strategic intent.",
    banner: {
      eyebrow: "COMMUNICATION",
      heading: "Tone of Voice",
      imageSrc: "/images/service/tone_voice.webp",
      imageAlt: "GTF Technologies Verbal Identity & Tone of Voice",
      description:
        "Developing distinctive verbal personality frameworks that resonate across customer journeys. From headline messaging matrix to cross-channel brand vernacular, we align every word with strategic intent.",
    },
  },
  "brand-storytelling": {
    slug: "brand-storytelling",
    title: "Brand Storytelling Framework",
    metaTitle: "Brand Storytelling Framework | Services | GTF Technologies",
    metaDescription:
      "Transforming corporate messaging into emotional, cinematic brand narratives that foster deep cultural affinity.",
    banner: {
      eyebrow: "NARRATIVE",
      heading: "Brand Storytelling",
      imageSrc: "/images/service/service_banner.webp",
      imageAlt: "GTF Technologies Brand Storytelling Framework",
      description:
        "Transforming corporate messaging into emotional, cinematic brand narratives. We craft human-centric story arcs that foster deep cultural affinity and community loyalty across global markets.",
    },
  },
  "communication-strategy": {
    slug: "communication-strategy",
    title: "Communication Strategy Across Platforms",
    metaTitle: "Communication Strategy Across Platforms | Services | GTF Technologies",
    metaDescription:
      "Orchestrating cohesive omnichannel communications ensuring brand coherence across digital and experiential touchpoints.",
    banner: {
      eyebrow: "OMNICHANNEL",
      heading: "Communication Rollout",
      imageSrc: "/images/service/communication3.webp",
      imageAlt: "GTF Technologies Omnichannel Communication Strategy",
      description:
        "Orchestrating cohesive omnichannel communications. Ensuring brand coherence across digital platforms, high-impact experiential installations, performance campaigns, and PR activations.",
    },
  },
};

export function getServiceBySlug(slug: string): ServiceItem | undefined {
  return SERVICES_DATA[slug];
}

export function getAllServiceSlugs(): string[] {
  return Object.keys(SERVICES_DATA);
}

