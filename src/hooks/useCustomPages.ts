import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Lang } from "@/lib/i18n";

/**
 * Pages staff create themselves (Admin > Pages), shown at /p/<slug>.
 * The server checks every block (server/index.js, cleanBlocks) before saving.
 */
export type PageBlock =
  | { type: "heading"; text: string; textHi?: string }
  | { type: "paragraph"; text: string; textHi?: string }
  | { type: "notice"; text: string; textHi?: string }
  | { type: "image"; url: string; caption?: string; captionHi?: string }
  | { type: "document"; url: string; label?: string; labelHi?: string }
  | { type: "button"; url: string; label: string; labelHi?: string }
  | { type: "video"; url: string }
  | { type: "table"; rows: string[][] };

/** "footer" = footer links; "menu" = phone menu, top bar and footer; "none" = only reachable by its link. */
export type PagePlacement = "footer" | "menu" | "none";

export type CustomPage = {
  id: number;
  slug: string;
  titleEn: string;
  titleHi: string;
  placement: PagePlacement;
  status: "draft" | "published";
  blocks: PageBlock[];
  updatedAt?: string;
};

/** English text, or the Hindi version when the visitor chose Hindi and one was written. */
export const pick = (lang: Lang, en?: string, hi?: string) => (lang === "hi" && hi?.trim() ? hi : en ?? "");

export const pageTitle = (page: Pick<CustomPage, "titleEn" | "titleHi">, lang: Lang) => pick(lang, page.titleEn, page.titleHi);

export const PAGES_QUERY_KEY = ["custom-pages"];

/** Published pages (without content) for the menu and footer. */
export const usePublishedPages = () =>
  useQuery({
    queryKey: PAGES_QUERY_KEY,
    queryFn: async () => {
      const res = await api<CustomPage[]>("/api/pages");
      return res.success && Array.isArray(res.data) ? res.data : [];
    },
    staleTime: 5 * 60 * 1000,
  }).data ?? [];

/** One published page; data is null when it doesn't exist (or is still a draft). */
export const useCustomPage = (slug: string) =>
  useQuery({
    queryKey: [...PAGES_QUERY_KEY, slug],
    queryFn: async () => {
      const res = await api<CustomPage>(`/api/pages/${encodeURIComponent(slug)}`);
      return res.success && res.data ? res.data : null;
    },
    staleTime: 60 * 1000,
  });
