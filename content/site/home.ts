export type EcosystemProgramme = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

export const impactStats = [
  { value: "100,000+", label: "people reached", verified: false },
  { value: "200+", label: "collaborators", verified: false },
  { value: "100+", label: "stakeholders", verified: false },
  { value: "6", label: "countries", verified: true },
] as const;

export const ecosystemProgrammes: EcosystemProgramme[] = [
  {
    eyebrow: "The flagship gathering",
    title: "IBX Summit",
    description:
      "Our annual gathering brings founders, developers, investors, institutions, policymakers and innovators together to shape Africa’s blockchain future.",
    href: "#summit",
    cta: "Discover the Summit",
  },
  {
    eyebrow: "Across West Africa",
    title: "IBX Tour",
    description:
      "A grassroots campaign taking practical blockchain education and innovation directly to campuses, communities, markets and technology hubs.",
    href: "/tour",
    cta: "Enter the Tour",
  },
  {
    eyebrow: "From idea to infrastructure",
    title: "IBX Build",
    description:
      "A year-round platform empowering founders and developers through hackathons, startup support, innovation challenges, mentorship and ecosystem collaboration.",
    href: "#build",
    cta: "Explore IBX Build",
  },
  {
    eyebrow: "Represent the movement",
    title: "IBX Ambassador Programme",
    description:
      "A leadership and community-building initiative for people ready to advance blockchain education, adoption and opportunity across their regions.",
    href: "#ambassadors",
    cta: "Join the waitlist",
  },
];

export const tourCountries = [
  "Nigeria",
  "Ghana",
  "Togo",
  "Benin Republic",
  "Cameroon",
  "Côte d’Ivoire",
] as const;
