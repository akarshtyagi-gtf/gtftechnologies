import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import SmoothScroll from "@/components/animations/SmoothScroll";
import SvgLineCursor from "@/components/animations/SvgLineCursor";
import Header from "@/components/Header";
import FooterAcrossIndia from "@/components/website/home/FooterAcrossIndia";
import type { FooterAcrossIndiaData } from "@/types/home";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GTF Technologies",
  description: "GTF Technologies website",
};

// Global Footer Data Contract for all pages
const footerAcrossIndiaData: FooterAcrossIndiaData = {
  heading: "Across India.",
  subheading: "Strategic locations to be closer to our clients and communities.",
  offices: [
    {
      id: "noida",
      city: "NOIDA",
      phone: "+91 120 478 3000",
      address: "5th Floor, Plot No. DS-01, Sector 2, Noida, 201301",
      dotColor: "#EF4444",
    },
    {
      id: "gurgaon",
      city: "GURGAON",
      phone: "+91 124 456 7890",
      address: "711-713 DLF Galleria Towers, DLF Phase-IV, Gurugram, 122001",
      dotColor: "#F59E0B",
    },
    {
      id: "mumbai",
      city: "MUMBAI",
      phone: "+91 99112 12345",
      address: "1st Floor, AJ House, Marol, Andheri East, 400059",
      highlighted: true,
      dotColor: "#EF4444",
    },
    {
      id: "pune",
      city: "PUNE",
      phone: "+91 99234 12345",
      address: "5th Floor, Sadanand Business Centre (SBC), Baner, 411045",
      dotColor: "#EF4444",
    },
    {
      id: "hyderabad",
      city: "HYDERABAD",
      phone: "+91 99100 12345",
      address: "WeWork, Vasavi MPM Grand, Ameerpet, 500073",
      dotColor: "#EF4444",
    },
    {
      id: "bangalore",
      city: "BANGALORE",
      phone: "+91 80 4789 1234",
      address: "Indiranagar, 100 Feet Road, HAL 2nd Stage, Bengaluru, 560038",
      dotColor: "#EF4444",
    },
  ],
  mapImageSrc: "/images/map/footer_map.webp",
  mapImageAlt: "GTF Technologies Pan-India Reach & Offices",
  phone: "+91 120 478 3000",
  email: "hello@gtftechnologies.com",
  copyright: "© 2026 GTF TECHNOLOGIES. ALL RIGHTS RESERVED.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <body className="antialiased bg-[#F8F6F0]">
        <SmoothScroll>
          <SvgLineCursor
            strokeColor="#979797ff"
            strokeWidth={1}
            showCursorDot={false}
          />
          <Header />
          {children}
          <FooterAcrossIndia data={footerAcrossIndiaData} />
        </SmoothScroll>
      </body>
    </html>
  );
}
