export type BuildJourneyCard = {
  id: string;
  eyebrow: string;
  title: string;
  paragraphs: readonly string[];
  items?: readonly string[];
  closing?: readonly string[];
};

export const buildJourneyCards: readonly BuildJourneyCard[] = [
  {
    id: "founders",
    eyebrow: "FOR FOUNDERS",
    title: "Build With More Than an Idea.",
    paragraphs: [
      "For founders, IBX Build creates an environment where your company can move beyond the idea stage.",
      "Gain access to people, knowledge, networks and opportunities that can help you:",
    ],
    items: [
      "Validate your idea",
      "Develop your product",
      "Find collaborators",
      "Access mentorship",
      "Discover talent",
      "Build partnerships",
      "Reach new markets",
      "Prepare for investment",
    ],
    closing: ["Build something worth backing."],
  },
  {
    id: "builders",
    eyebrow: "FOR BUILDERS",
    title: "Your Skills Can Take You Further.",
    paragraphs: [
      "You shouldn't have to wait for someone to give you permission to start building.",
      "IBX Build gives talented builders an environment to:",
    ],
    items: [
      "Work on meaningful problems",
      "Develop real products",
      "Collaborate with other exceptional talent",
      "Learn from experienced builders",
      "Build a public track record",
      "Access opportunities within the ecosystem",
    ],
    closing: ["Don't just learn the future. Build it."],
  },
  {
    id: "standard",
    eyebrow: "THE IBX BUILD STANDARD",
    title: "High Standards. High Potential.",
    paragraphs: [
      "IBX Build is not designed to accept everyone.",
      "That's intentional.",
      "A selective environment creates a different kind of community.",
      "When you know that the person beside you earned their place, collaboration becomes more valuable, conversations become more meaningful and the network becomes stronger.",
    ],
    closing: ["Getting into IBX Build should be an achievement in itself."],
  },
  {
    id: "beyond-program",
    eyebrow: "BEYOND THE PROGRAM",
    title: "Your Journey Doesn't End at Graduation.",
    paragraphs: [
      "IBX Build is designed to create relationships that continue beyond the fellowship.",
      "Alumni become part of the wider IBX ecosystem and remain connected to:",
    ],
    items: [
      "Future cohorts",
      "IBX Community",
      "Founders",
      "Investors",
      "Partners",
      "Mentors",
      "Global opportunities",
    ],
    closing: [
      "The goal isn't simply to produce a successful cohort.",
      "It's to build a generation of people capable of building what comes next.",
    ],
  },
  {
    id: "big-vision",
    eyebrow: "THE BIG VISION",
    title: "We're Building More Than Companies.",
    paragraphs: [
      "Every generation inherits problems it didn't create.",
      "And every generation gets the opportunity to build something better.",
      "IBX Build exists to identify, develop and connect the people willing to take on that responsibility.",
      "We believe today's exceptional builder can become tomorrow's founder.",
      "Tomorrow's founder can become tomorrow's industry leader.",
      "And tomorrow's industry leader can create opportunities for an entire generation.",
    ],
    closing: ["That's the kind of impact we're building for."],
  },
] as const;
