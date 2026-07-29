import type { Metadata } from "next";
import {
  AboutContactCta,
  AboutHero,
  AboutStory,
  AccommodationBrief,
  DifferentiatorGrid,
  MissionVision,
  PillarsRow,
  TrainingApproach,
  WhyClare,
} from "@/components/about/AboutSections";
import { aboutContact, aboutContent } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "St. Clare Language Institute Nairobi Branch offers Professional German, French, and English training for education, employment, migration, and international communication.",
  openGraph: {
    title: "St. Clare Language Institute",
    description: aboutContent.heroSupport,
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: aboutContent.brand,
    alternateName: "St. Clare Vocational College — Nairobi Branch",
    description: aboutContent.heroSupport,
    slogan: aboutContent.tagline,
    parentOrganization: {
      "@type": "EducationalOrganization",
      name: "St. Francis Technical Institute",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
    email: aboutContact.email,
    telephone: aboutContact.phones,
    url: "/about",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AboutHero />
      <AboutStory />
      <DifferentiatorGrid />
      <TrainingApproach />
      <MissionVision />
      <PillarsRow />
      <WhyClare />
      <AccommodationBrief />
      <AboutContactCta />
    </>
  );
}
