import type { Metadata } from "next";
import { ComingSoonPage } from "@/components/coming-soon-page";

export const metadata: Metadata = {
  title: "Registration",
  description: "Registration for the next Ibom Blockchain Xperience Summit opens soon.",
  alternates: { canonical: "/register" },
};

export default function RegisterPage() {
  return (
    <ComingSoonPage
      eyebrow="IBX Summit"
      title="Registration Coming Soon"
      description="Summit registration isn't open yet — leave your interest with the Summit team and you'll be the first to know the moment it goes live."
      action={{ href: "https://form.typeform.com/to/A2YCJwL2", label: "Register your interest" }}
    />
  );
}
