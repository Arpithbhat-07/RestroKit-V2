import { useState, useEffect, useCallback } from "react";
import { publicApi } from "@/services/api";
import { site as fallback } from "@/data/site";

// Generic fetcher with fallback
function useFetch(fetcher, fallbackData) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const memoizedFetcher = useCallback(() => fetcher(), [fetcher]);

  useEffect(() => {
    memoizedFetcher()
      .then((r) => setData(Object.keys(r.data).length ? r.data : fallbackData))
      .catch(() => setData(fallbackData))
      .finally(() => setLoading(false));
  }, [fallbackData, memoizedFetcher]);
  return { data, loading };
}

export function useRestaurant() {
  return useFetch(publicApi.getRestaurant, {
    name: fallback.name, tagline: fallback.tagline, logo: fallback.logo,
    phone: fallback.contact.phone, address: fallback.contact.address,
    map_embed: fallback.contact.mapEmbed, hours: fallback.contact.hours,
    social: fallback.contact.social,
  });
}

export function useHero() {
  return useFetch(publicApi.getHero, {
    kicker: fallback.hero.kicker, title: fallback.hero.title,
    title_alt: fallback.hero.titleAlt, subtitle: fallback.hero.subtitle,
    image: fallback.hero.image, cta_primary: "Reserve Table", cta_secondary: "View Menu",
  });
}

export function useAbout() {
  return useFetch(publicApi.getAbout, {
    heading: fallback.about.heading, paragraph: fallback.about.paragraph,
    bullets: fallback.about.bullets, stats: fallback.about.stats,
    images: fallback.about.images,
  });
}

export function useMenu() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    publicApi.getMenu()
      .then((r) => setData(r.data.length ? r.data : fallback.menu.map((m) => ({ ...m, category: m.cat, available: true }))))
      .catch(() => setData(fallback.menu.map((m) => ({ ...m, category: m.cat, available: true }))))
      .finally(() => setLoading(false));
  }, []);
  return { data, loading };
}

export function useGallery() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    publicApi.getGallery()
      .then((r) => setData(r.data.length ? r.data.map((g) => g.url) : fallback.gallery))
      .catch(() => setData(fallback.gallery))
      .finally(() => setLoading(false));
  }, []);
  return { data, loading };
}

export function useReviews() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    publicApi.getReviews()
      .then((r) => {
        const featured = r.data.filter((rv) => rv.featured);
        setData(featured.length ? featured : (r.data.length ? r.data : fallback.Reviews));
      })
      .catch(() => setData(fallback.Reviews))
      .finally(() => setLoading(false));
  }, []);
  return { data, loading };
}
