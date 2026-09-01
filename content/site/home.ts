export type EcosystemProgramme = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  // The programme's own logo, shown instead of a generic photo. Falls back
  // to a rotating photo in EcosystemCarousel when omitted (currently only
  // true for Ambassador — there's no dedicated Ambassador logo file yet).
  logo?: string;
  // Some logo files are dark wordmarks meant for a light background — the
  // visual panel is dark by default, so those need a light chip behind
  // them instead, or they'd be invisible.
  logoOnLight?: boolean;
};

export const impactStats = [
  { value: "200,000+", label: "reached", verified: false },
  { value: "200+", label: "collaborators", verified: false },
  { value: "100+", label: "stakeholders", verified: false },
  { value: "4", label: "continents", verified: true },
] as const;

export const ecosystemProgrammes: EcosystemProgramme[] = [
  {
    eyebrow: "The flagship gathering",
    title: "IBX Summit",
    description:
      "Our annual gathering brings founders, developers, investors, institutions, policymakers and innovators together to shape Africa’s blockchain future.",
    href: "#summit",
    cta: "Discover the Summit",
    logo: "/brand/programmes/ibx-summit-logo.png",
  },
  {
    eyebrow: "Across West Africa",
    title: "IBX Tour",
    description:
      "A grassroots campaign taking practical blockchain education and innovation directly to campuses, communities, markets and technology hubs.",
    href: "/tour",
    cta: "Enter the Tour",
    logo: "/brand/ibx-tour-rebrand-white.png",
  },
  {
    eyebrow: "From idea to infrastructure",
    title: "IBX Build",
    description:
      "A year-round platform empowering founders and developers through hackathons, startup support, innovation challenges, mentorship and ecosystem collaboration.",
    href: "#build",
    cta: "Explore IBX Build",
    logo: "/brand/programmes/ibx-build-logo.png",
    logoOnLight: true,
  },
  {
    eyebrow: "Represent the movement",
    title: "IBX Community",
    description:
      "A leadership and community-building initiative for people ready to advance blockchain education, adoption and opportunity across their regions.",
    href: "https://t.me/+tTYyl_SQzwFmY2I0",
    cta: "Join the Community",
    logo: "/brand/programmes/ibx-community-logo.jpg",
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

export type SpeakerQuote = {
  // The quote, name and title are already lettered into the image itself —
  // these strings exist only to build a meaningful `alt` for screen readers.
  quote: string;
  name: string;
  title: string;
  image: string;
};

export const speakerQuotes: SpeakerQuote[] = [
  {
    quote:
      "Every generation encounters a technology that reshapes economic systems. For ours, blockchain and digital assets represent that transformative frontier.",
    name: "Rt. Hon. Olufemi Richard Bamisile, PhD",
    title:
      "Chairman, House Ad-Hoc Committee on the Economic, Regulatory and Security Implications of Cryptocurrency Adoption and PoS Operations in Nigeria",
    image: "/images/home/speakers/quote-bamisile.png",
  },
  {
    quote: "Technology helps create a new industry.",
    name: "Imo-Abasi Jacob, FCA",
    title:
      "Managing Director & CEO, Akwa Ibom Investment Corporation (AKICORP) · Chairman, Board of Directors, Ibom Air",
    image: "/images/home/speakers/quote-imo-abasi-jacob.png",
  },
  {
    quote:
      "We’re going to see more of blockchain in the area of government, agriculture, food chain…",
    name: "Tola Joseph Fadugbagbe",
    title: "Founder, Crypto Masterclass · Author",
    image: "/images/home/speakers/quote-tola-fadugbagbe.png",
  },
];
