import type { Metadata } from "next";
import { TourExperience } from "@/components/tour-experience";

export const metadata: Metadata = {
  title: "IBX27 Tour",
  description: "Explore the IBX27 Tour taking blockchain education, innovation and opportunity across six West African countries.",
  alternates: { canonical: "/tour" },
};

type TourPageProps = {
  searchParams: Promise<{ view?: string; country?: string }>;
};

export default async function TourPage({ searchParams }: TourPageProps) {
  const params = await searchParams;
  return <TourExperience initialScreen={params.view === "countries" ? "tour" : "landing"} initialCountry={params.country} />;
}
