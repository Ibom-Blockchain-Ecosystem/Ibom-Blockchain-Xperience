export type TourStop = {
  slug: string;
  country: string;
  city: string;
  region: string;
  image: string;
  alternateImage?: string;
  cityImages?: string[];
  featuredCities?: string[];
  visualTheme?: "gateway" | "bilingual" | "heritage" | "motion";
  featureHeadline?: string;
  storyImages?: [string, string, string?];
  languageLabel: string;
  welcome: string;
  intro: string;
  description: string;
  culturalNote: string;
};

export const tourStops: TourStop[] = [
  {
    slug: "nigeria",
    country: "Nigeria",
    city: "Uyo",
    region: "West Africa",
    image: "/images/tour/nigeria-stadium-hero.webp",
    visualTheme: "gateway",
    featuredCities: ["Abuja", "Lagos", "Uyo"],
    featureHeadline: "Where policy, enterprise and builders shape Africa’s digital future.",
    storyImages: ["/images/tour/nigeria.webp", "/images/tour/nigeria-stadium-enhanced.png", "/images/tour/ibom-hall.webp"],
    languageLabel: "English · Hausa · Yorùbá · Igbo",
    welcome: "Welcome · Barka da zuwa · Ẹ káàbọ̀ · Nnọọ",
    intro: "Where policy, enterprise and builders meet Nigeria’s digital future.",
    description: "The Nigeria chapter connects communities, builders and institutions through practical blockchain education, collaboration and real-world adoption.",
    culturalNote: "Our story extends beyond Abuja. This stop represents the communities, languages and builders contributing from across Nigeria.",
  },
  {
    slug: "ghana",
    country: "Ghana",
    city: "Accra",
    region: "West Africa",
    image: "/images/tour/ghana.avif",
    cityImages: [
      "/images/tour/ghana-arch-enhanced.webp",
      "/images/tour/ghana-cape-coast-enhanced.webp",
      "/images/tour/ghana-independence-square-enhanced.webp",
      "/images/tour/ghana-freedom-arch.webp",
    ],
    languageLabel: "English · Twi",
    welcome: "Welcome · Akwaaba",
    intro: "Builders, communities and culture meet in one of West Africa’s leading technology ecosystems.",
    description: "The Ghana chapter connects students, founders, developers and local communities through practical blockchain education, collaboration and ecosystem opportunity.",
    culturalNote: "Accra anchors the current visual story while the complete Tour programme will represent communities and builders across Ghana.",
  },
  {
    slug: "cameroon",
    country: "Cameroon",
    city: "Yaoundé",
    region: "Central Africa",
    image: "/images/tour/cameroon.webp",
    visualTheme: "bilingual",
    featuredCities: ["Yaoundé", "Douala", "Buea"],
    featureHeadline: "Two languages. One connected Web3 future.",
    languageLabel: "Français · English",
    welcome: "Bienvenue · Welcome",
    intro: "A meeting point for ambitious communities building African technology.",
    description: "The Cameroon chapter creates space for local innovators and emerging Web3 communities to exchange knowledge and connect to a wider African network.",
    culturalNote: "The experience will represent voices and communities beyond Yaoundé, reflecting Cameroon’s multilingual and culturally diverse ecosystem.",
  },
  {
    slug: "benin",
    country: "Benin Republic",
    city: "Cotonou",
    region: "West Africa",
    image: "/images/tour/benin.webp",
    alternateImage: "/images/tour/benin-forum.webp",
    visualTheme: "heritage",
    featuredCities: ["Cotonou", "Porto-Novo", "Abomey"],
    featureHeadline: "Courage from history. Technology for the future.",
    languageLabel: "Français · Fongbè",
    welcome: "Bienvenue · Wɛzɔ",
    intro: "History, courage and emerging technology converge in Benin.",
    description: "The Benin chapter celebrates community strength while creating access to blockchain education, collaboration and useful digital tools.",
    culturalNote: "Cotonou begins the visual story, but the page will document people, hubs and experiences from across Benin Republic.",
  },
  {
    slug: "togo",
    country: "Togo",
    city: "Lomé",
    region: "West Africa",
    image: "/images/tour/togo.webp",
    alternateImage: "/images/tour/togo-cultural-collage-enhanced.webp",
    featuredCities: ["Lomé", "Sokodé", "Kara"],
    languageLabel: "Français · Eʋegbe",
    welcome: "Bienvenue · Woezɔ",
    intro: "A borderless exchange of ideas, talent and digital opportunity.",
    description: "The Togo chapter works with local communities to make Web3 understandable, useful and connected to opportunities created by young Africans.",
    culturalNote: "The destination story will expand beyond Lomé as verified tour information and local community contributions are added.",
  },
  {
    slug: "cote-divoire",
    country: "Côte d’Ivoire",
    city: "Abidjan",
    region: "West Africa",
    image: "/images/tour/cote-divoire.webp",
    visualTheme: "motion",
    featuredCities: ["Abidjan", "Yamoussoukro", "Grand-Bassam"],
    featureHeadline: "Culture, commerce and Web3 in motion.",
    storyImages: ["/images/tour/abidjan-aerial-day.jpg", "/images/tour/abidjan-skyline-night.jpg"],
    languageLabel: "Français · Dioula",
    welcome: "Akwaba · Bienvenue",
    intro: "Culture, commerce and a new generation of builders meet on the coast.",
    description: "The Côte d’Ivoire chapter brings creators, founders and blockchain communities together through learning, cultural exchange and ecosystem connection.",
    culturalNote: "Abidjan anchors the current imagery, while the complete page will tell a wider national story as official tour content arrives.",
  },
];

export function getTourStop(slug: string) {
  return tourStops.find((stop) => stop.slug === slug);
}
