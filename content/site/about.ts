// Copy for the /about page. Real IBX information only. Where an exact figure is
// not yet confirmed it is marked `placeholder: true` — swap the value, drop the
// flag. Stats mirror content/site/home.ts `impactStats`.

export const aboutHero = {
  eyebrow: "About IBX",
  title: ["We Don't Just Talk About The Future. We Bring The People Building It Together."],
  paragraph:
    "IBX is a global blockchain movement connecting builders, founders, innovators, investors, institutions and communities to turn ideas into relationships, opportunities and real-world impact.",
} as const;

export const aboutStory = {
  eyebrow: "Our Story",
  title: ["Why IBX", "Exists"],
  stats: [
    { value: 5, suffix: "yrs", label: "Standing" },
    { value: 4, suffix: "", label: "Continents reached", verified: true },
    { value: 200000, suffix: "+", label: "People reached", placeholder: true },
  ],
  paragraphs: [
    "Blockchain is changing how the world creates, connects and moves value. But **technology alone does not create change. People do.**",
    {
      items: [
        "Builders need access to knowledge and resources.",
        "Founders need capital, talent and markets.",
        "Communities need opportunities.",
        "Institutions need access to emerging innovation.",
        "And the next generation needs a pathway into the future.",
      ],
    },
    "**IBX exists to connect these worlds.**",
    "We create the platforms and experiences that bring the right people together, expose them to new possibilities and give them the opportunity to participate in what comes next.",
  ],
} as const;

export const aboutColumns = [
  {
    eyebrow: "What we do",
    title: "We build the ecosystem, not just the events.",
    paragraph:
      "IBX runs a year-round programme — Summit, Tour, Build and Den of Rogues — designed so that a builder can find their first collaborator, a founder can find mentorship and capital, and a policymaker can find the people doing the work.",
    cta: { label: "Explore the ecosystem", href: "/#programmes" },
  },
  {
    eyebrow: "Our difference",
    title: "We meet people where the work actually happens.",
    paragraph:
      "Instead of a single conference, IBX shows up on the ground — in Nigeria, Ghana, Togo, Benin, Côte d'Ivoire and Cameroon — pairing high-level convening with grassroots education so the ecosystem grows from the roots up.",
    cta: { label: "Follow the Tour", href: "/tour" },
  },
] as const;

export const aboutTeam = {
  title: ["We care deeply about", "the people in the room."],
  paragraphs: [
    "IBX is built by MoovTeam Africa alongside a network of collaborators, volunteers, ambassadors and partners across the continent.",
    "Every gathering, campaign and cohort is shaped by people who care about who is in the room — because that is what makes the network worth being part of.",
  ],
  cta: { label: "Join the community", href: "https://t.me/+tTYyl_SQzwFmY2I0" },
  image: {
    // Placeholder — swap for a dedicated IBX team/community photo when available.
    src: "/images/tour/activities/ecosystem-roundtable.webp",
    alt: "IBX ecosystem roundtable session",
    width: 1280,
    height: 960,
  },
  caption: "IBX ecosystem roundtable — Uyo, Nigeria.",
} as const;

export const aboutNumbers = {
  eyebrow: "Impact",
  title: ["A movement measured", "by who it reaches."],
  paragraph:
    "Across the Summit, the Tour and Build, IBX has connected people and organisations building Africa's blockchain future. These figures grow with every edition.",
  stats: [
    { value: 200000, suffix: "+", label: "Reached", placeholder: true },
    { value: 200, suffix: "+", label: "Collaborators", placeholder: true },
    { value: 4, suffix: "", label: "Continents", verified: true },
  ],
} as const;

export const aboutFinalCta = {
  title: ["Getting involved has", "never been easier."],
  paragraph: "Come build the next chapter of African blockchain with us.",
  cta: { label: "Get involved with IBX", href: "https://form.typeform.com/to/A2YCJwL2" },
} as const;
