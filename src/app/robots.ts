import type { MetadataRoute } from "next";

/* démo : jamais indexée par les moteurs de recherche */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
