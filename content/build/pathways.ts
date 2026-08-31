export type BuildPathwayIcon = "play";

export type BuildPathway = {
  title: string;
  lead?: string;
  description: string;
  icon: BuildPathwayIcon;
};

export const buildPathways: readonly BuildPathway[] = [
  {
    title: "MENTORSHIP",
    description:
      "Learn directly from experienced founders, builders, operators and industry leaders.",
    icon: "play",
  },
  {
    title: "EXPERIENCE",
    description:
      "Work on problems, products and opportunities beyond theoretical learning.",
    icon: "play",
  },
  {
    title: "NETWORK",
    description:
      "Build relationships with founders, investors, institutions, technology companies and other exceptional builders.",
    icon: "play",
  },
  {
    title: "OPPORTUNITIES",
    description:
      "Gain exposure to partnerships, talent, capital, employment and other opportunities within the ecosystem.",
    icon: "play",
  },
  {
    title: "VISIBILITY",
    description:
      "Put your work in front of people who can help take it further.",
    icon: "play",
  },
  {
    title: "COMMUNITY",
    description:
      "Become part of a network of ambitious people building across markets.",
    icon: "play",
  },
] as const;
