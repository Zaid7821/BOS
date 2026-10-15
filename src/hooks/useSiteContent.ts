import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import schoolLogo from "@/assets/school-logo.jpg";
import {
  events,
  type Sampleable,
  fees,
  galleryImages,
  stats,
  staff,
  testimonials,
  toppers,
  transportRoutes,
  visible,
  youtubeVideoIds,
  yearsRunning,
} from "@/data/site";

export type Topper = Sampleable & { name: string; className: string; year: string; percentage: string; photo?: string };
export type SchoolEvent = Sampleable & { title: string; date: string; description: string; category: string };
export type FeeRow = Sampleable & { group: string; admission: string; monthly: string; annual: string };
export type TransportRoute = Sampleable & { route: string; stops: string[]; monthlyFee: string };
export type Testimonial = Sampleable & { quote: string; name: string; role: string };
export type StaffMember = Sampleable & { name: string; position: string; qualification?: string };
export type StatsValues = { students?: string; teachers?: string; result?: string };
export type Video = { url: string };
export type Branding = { logo?: string };
export type GalleryPhoto = { src: string; alt: string; category: string };

/** What the admin panel can save. Every key is optional: a missing key means "use the default from site.ts". */
export type SiteContent = {
  toppers?: Topper[];
  events?: SchoolEvent[];
  fees?: FeeRow[];
  transport?: TransportRoute[];
  testimonials?: Testimonial[];
  staff?: StaffMember[];
  stats?: StatsValues;
  videos?: Video[];
  branding?: Branding;
};

/** The logo bundled with the site, used until an admin uploads a new one. */
export const DEFAULT_LOGO = schoolLogo;

/** Pulls the video ID out of any YouTube link (watch, youtu.be, shorts, embed) or a bare ID. */
export const youtubeId = (url: string) => {
  const match = url.trim().match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  if (match) return match[1];
  return /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null;
};

const ONE_MINUTE = 60 * 1000;

const useRawContent = () =>
  useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const res = await api<SiteContent>("/api/content");
      return res.success && res.data ? res.data : {};
    },
    staleTime: 5 * ONE_MINUTE,
  });

/** Website sections edited from the admin panel, falling back to src/data/site.ts. */
export const useSiteContent = () => {
  const { data = {} } = useRawContent();

  const statItems = data.stats
    ? [
        { value: yearsRunning(), suffix: "+", labelKey: "stats.years" },
        ...([
          ["students", "+", "stats.students"],
          ["teachers", "+", "stats.teachers"],
          ["result", "%", "stats.result"],
        ] as const)
          .map(([key, suffix, labelKey]) => ({ value: Number(data.stats?.[key]), suffix, labelKey }))
          .filter((s) => s.value > 0),
      ]
    : visible(stats);

  return {
    toppers: data.toppers ?? visible(toppers),
    events: data.events ?? visible(events),
    fees: data.fees ?? visible(fees),
    transport: data.transport ?? visible(transportRoutes),
    testimonials: data.testimonials ?? visible(testimonials),
    staff: data.staff ?? visible(staff),
    stats: statItems,
    logo: data.branding?.logo || DEFAULT_LOGO,
    hasCustomLogo: Boolean(data.branding?.logo),
    videoIds: data.videos
      ? data.videos.map((v) => youtubeId(v.url)).filter((id): id is string => Boolean(id))
      : youtubeVideoIds,
  };
};

/** Raw saved values for the admin editor (undefined = never saved). */
export const useSavedContent = useRawContent;

/** Gallery photos managed in the admin panel. Falls back to site.ts if the server is unreachable. */
export const useGallery = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["gallery"],
    queryFn: async (): Promise<GalleryPhoto[]> => {
      const res = await api<{ url: string; caption: string; category: string }[]>("/api/gallery");
      if (!res.success || !Array.isArray(res.data)) return galleryImages;
      return res.data.map((p) => ({ src: p.url, alt: p.caption || "School photo", category: p.category }));
    },
    staleTime: ONE_MINUTE,
  });
  return { photos: data ?? [], isLoading };
};
