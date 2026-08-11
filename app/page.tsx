import type { Metadata } from "next";
import { TourExperience } from "@/components/tour-experience";

export const metadata: Metadata = {
  title: "IBX27 Tour — Building for Generations",
  description: "Explore the IBX27 Tour taking blockchain education, innovation and opportunity across six West African countries.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <TourExperience />;
}
