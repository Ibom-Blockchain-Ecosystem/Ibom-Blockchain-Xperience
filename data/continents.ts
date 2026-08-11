export const comingSoonContinents = [
  { slug: "asia", name: "Asia", image: "/images/continents/asia.webp", description: "The IBX Tour is preparing its next chapter across Asia." },
  { slug: "europe", name: "Europe", image: "/images/continents/europe.webp", description: "The IBX Tour is preparing its next chapter across Europe." },
  { slug: "north-america", name: "North America", image: "/images/continents/north-america.webp", description: "The IBX Tour is preparing its next chapter across North America." },
  { slug: "south-america", name: "South America", image: "/images/continents/south-america.webp", description: "The IBX Tour is preparing its next chapter across South America." },
] as const;

export function getComingSoonContinent(slug: string) {
  return comingSoonContinents.find((continent) => continent.slug === slug);
}
