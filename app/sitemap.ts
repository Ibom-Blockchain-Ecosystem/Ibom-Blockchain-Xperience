import type { MetadataRoute } from "next";
import { tourStops } from "@/data/stops";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://tour.ibomblockchain.com";
  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/tour`, lastModified: new Date(), changeFrequency: "weekly", priority: .9 },
    ...tourStops.map((stop) => ({ url: `${baseUrl}/tour/${stop.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: .8 })),
  ];
}
