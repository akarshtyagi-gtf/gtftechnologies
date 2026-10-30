// Types for Home Page Sections

// 1. Banner Section Types
export interface BannerSlideItem {
  src: string;
  alt: string;
}

export interface BannerData {
  headingLine1?: string;
  headingLine2Prefix?: string;
  headingLine2Highlight?: string;
  headingLine3Highlight?: string;
  headingLine3Suffix?: string;
  headingLine4Prefix?: string;
  headingLine4Highlight?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  scrollText?: string;
  sliderCol1: BannerSlideItem[];
  sliderCol2: BannerSlideItem[];
  sliderCol3: BannerSlideItem[];
}

// 2. Our Work Section Types
export interface WorkCard {
  id: string;
  title: string;
  subtitle?: string;
  brand?: string;
  image: string;
  alt: string;
  width?: number;
  height?: number;
  aspectClass?: string;
}

export interface OurWorkData {
  tagline: string;
  headingLine1: string;
  headingLine2: string;
  subheading: string[];
  columns: {
    left: WorkCard[];
    centerMain: WorkCard;
    centerRow: WorkCard[];
    right: WorkCard[];
  };
}

// 2.5 Our Trust Section Types
export interface TrustItem {
  id: string;
  name: string;
  image: string;
}

export interface OurTrustData {
  tagline?: string;
  headingPrefix?: string;
  headingHighlight?: string;
  description?: string;
  items?: TrustItem[];
}

// 3. Our Services Section Types
export interface ServiceCardItem {
  id: string;
  title: string;
  image: string;
  alt: string;
}

export interface ServiceItem {
  id: string;
  counter?: string;
  tagline?: string;
  titleLight: string;
  titleHighlight: string;
  buttonText?: string;
  description: string;
  badges?: string[];
  card?: ServiceCardItem;
}

export interface OurServicesData {
  tagline?: string;
  buttonText?: string;
  services?: ServiceItem[];
  // Legacy / fallback fields:
  counter?: string;
  titleLight?: string;
  titleHighlight?: string;
  description?: string;
  badges?: string[];
  cards?: ServiceCardItem[];
}

// 4. Map Section Types
export interface MapSectionData {
  headingLine1?: string;
  headingLine2Part1?: string;
  headingLine2Highlight?: string;
  headingLine3?: string;
  description?: string;
  buttonText?: string;
  videoSrc?: string;
}

// 5. Why Us Section Types
export interface WhyUsItem {
  id: string;
  number: number;
  title: string;
  description: string;
  image: string;
  alt: string;
}

export interface WhyUsData {
  tagline?: string;
  taglineHighlight?: string;
  heading?: string;
  items: WhyUsItem[];
}

// 6. We Think Big Section Types
export interface ReelItem {
  id: string;
  tag: string;
  videoSrc: string;
  alt: string;
}

export interface WeThinkBigData {
  headingLine1?: string;
  headingLine2Part1?: string;
  headingLine2Highlight?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  reels: ReelItem[];
}

// 7. Let's Talk Section Types
export interface LetsTalkData {
  tagline?: string;
  headingLine1?: string;
  headingLine2?: string;
  description?: string;
  locationTitle?: string;
  email?: string;
  taglineInfo?: string;
  sideImageSrc?: string;
  sideImageAlt?: string;
  buttonText?: string;
  responseTimeNote?: string;
}

// 8. Driven By Results Section Types
export interface DrivenByResultsData {
  tagline?: string;
  heading?: string;
  headingLine1?: string;
  headingLine2Highlight?: string;
  description?: string;
  videoSrc?: string;
  posterSrc?: string;
  partnerCardSrc?: string;
  partnerCardAlt?: string;
  partnerLogoSrc?: string;
  partnerLogoAlt?: string;
}

// 9. Connect Us Section Types
export interface ConnectUsData {
  prefixText?: string;
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
}

// 10. Footer / Across India Section Types
export interface OfficeLocation {
  id: string;
  city: string;
  phone: string;
  address: string;
  highlighted?: boolean;
  dotColor?: string;
}

export interface FooterAcrossIndiaData {
  heading?: string;
  subheading?: string;
  offices: OfficeLocation[];
  mapImageSrc?: string;
  mapImageAlt?: string;
  phone?: string;
  email?: string;
  copyright?: string;
}

// Full Home Page Data Contract
export interface HomePageData {
  banner?: BannerData;
  ourWork: OurWorkData;
  ourTrust?: OurTrustData;
  ourServices?: OurServicesData;
  mapSection?: MapSectionData;
  whyUs?: WhyUsData;
  weThinkBig?: WeThinkBigData;
  letsTalk?: LetsTalkData;
  drivenByResults?: DrivenByResultsData;
  connectUs?: ConnectUsData;
  footer?: FooterAcrossIndiaData;
}

