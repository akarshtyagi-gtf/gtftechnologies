import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CommonBanner from "@/components/common/CommonBanner";
import ResearchTimelineSection from "@/components/website/service-platter/ResearchTimelineSection";
import CardCarousel from "@/components/website/service-platter/CardCarousel";
import { getServiceBySlug, getAllServiceSlugs } from "@/data/servicesData";

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllServiceSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return {
      title: "Service Not Found | GTF Technologies",
    };
  }

  return {
    title: service.metaTitle,
    description: service.metaDescription,
  };
}

export default async function DynamicServiceDetailPage({
  params,
}: ServicePageProps) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <main className="w-full min-h-screen bg-transparent">
      {/* 1. Dynamic Hero Banner using Reusable CommonBanner */}
      <CommonBanner
        eyebrow={service.banner.eyebrow}
        heading={service.banner.heading}
        imageSrc={service.banner.imageSrc}
        imageAlt={service.banner.imageAlt}
        description={service.banner.description}
      />

      {/* 2. Research Timeline 4-Step Interactive Section */}
      <ResearchTimelineSection />

      {/* 3. Concentric 3D Liquid Circle Card Carousel Scene */}
      <CardCarousel />
    </main>
  );
}

