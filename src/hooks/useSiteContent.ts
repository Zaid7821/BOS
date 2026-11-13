import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import schoolLogo from "@/assets/school-logo.jpg";
import {
  admissionDocuments,
  admissionSteps,
  ageCriteria,
  classOptions,
  events,
  type Sampleable,
  fees,
  galleryImages,
  SCHOOL,
  sessionCalendar,
  stages,
  stats,
  staff,
  streams,
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
export type AdmissionStep = { title: string; description: string };
export type AgeRule = { className: string; age: string };
export type CalendarItem = { term: string; period: string };
export type Stream = { name: string; subjects: string[] };
export type Stage = { level: string; classes: string; description: string; subjects: string[] };

/** School details an admin can change. Empty or missing fields fall back to SCHOOL in site.ts. */
export type SchoolDetails = {
  name?: string;
  nameHi?: string;
  affiliationNo?: string;
  founded?: string;
  phoneDisplay?: string;
  whatsapp?: string;
  email?: string;
  addressLines?: string[];
  addressShort?: string;
  mapQuery?: string;
  officeHours?: string[];
  facebook?: string;
  youtube?: string;
  instagram?: string;
  chairmanName?: string;
  chairmanPhoto?: string;
  heroImage?: string;
  visionImage?: string;
  prospectusUrl?: string;
  aboutHistory?: string;
};

/** Admin overrides for translated text, per language: { en: { "home.tagline": "…" }, hi: { … } }. */
export type TextOverrides = { en?: Record<string, string>; hi?: Record<string, string> };

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
  school?: SchoolDetails;
  texts?: TextOverrides;
  admissionSteps?: AdmissionStep[];
  admissionDocuments?: { text: string }[];
  ageCriteria?: AgeRule[];
  classOptions?: { name: string }[];
  sessionCalendar?: CalendarItem[];
  streams?: Stream[];
  stages?: Stage[];
};

/** The logo bundled with the site, used until an admin uploads a new one. */
export const DEFAULT_LOGO = schoolLogo;
export const DEFAULT_HERO = "/images/bos-hero.jpg";
export const DEFAULT_PROSPECTUS = "/admission-info.pdf";

/** Pulls the video ID out of any YouTube link (watch, youtu.be, shorts, embed) or a bare ID. */
export const youtubeId = (url: string) => {
  const match = url.trim().match(/(?:v=|youtu\.be\/|shorts\/|embed\/)([\w-]{11})/);
  if (match) return match[1];
  return /^[\w-]{11}$/.test(url.trim()) ? url.trim() : null;
};

const ONE_MINUTE = 60 * 1000;

/**
 * The last content seen from the server, kept in the browser so a refresh shows it
 * straight away instead of flashing the site.ts defaults (old logo, sample stats…)
 * while /api/content loads. index.html reads the same key to set the tab icon early.
 */
const CONTENT_CACHE_KEY = "bos-site-content";

const readCachedContent = (): SiteContent | undefined => {
  try {
    const saved = localStorage.getItem(CONTENT_CACHE_KEY);
    return saved ? (JSON.parse(saved) as SiteContent) : undefined;
  } catch {
    return undefined;
  }
};

const cacheContent = (data: SiteContent) => {
  try {
    localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(data));
  } catch {
    // Storage blocked or full (private mode etc.): content just won't be remembered.
  }
};

const useRawContent = () =>
  useQuery({
    queryKey: ["site-content"],
    queryFn: async () => {
      const res = await api<SiteContent>("/api/content");
      const data = res.success && res.data ? res.data : {};
      // Only remember a successful answer; a failed request shouldn't wipe the saved copy.
      if (res.success) cacheContent(data);
      return data;
    },
    // Shown while the real request runs; the fresh answer replaces it.
    placeholderData: readCachedContent,
    staleTime: 5 * ONE_MINUTE,
  });

/** Raw saved values for the admin editor (undefined = never saved). */
export const useSavedContent = useRawContent;

// Saved text fields win only when they are not blank.
const pick = (value: string | undefined, fallback: string) => (value?.trim() ? value.trim() : fallback);
const pickList = (value: string[] | undefined, fallback: string[]) => (value?.some((v) => v.trim()) ? value.filter((v) => v.trim()) : fallback);

/** School contact details and images, with admin edits applied. Same shape as SCHOOL plus a few extras. */
export const useSchool = () => {
  const s = useRawContent().data?.school ?? {};
  const phoneDisplay = pick(s.phoneDisplay, SCHOOL.phoneDisplay);
  const founded = /^d{4}$/.test(s.founded?.trim() ?? "") ? Number(s.founded) : SCHOOL.founded;
  return {
    ...SCHOOL,
    name: pick(s.name, SCHOOL.name),
    nameHi: pick(s.nameHi, SCHOOL.nameHi),
    affiliationNo: pick(s.affiliationNo, SCHOOL.affiliationNo),
    founded,
    phoneDisplay,
    // tel: links need digits only (plus a leading +)
    phone: s.phoneDisplay?.trim() ? phoneDisplay.replace(/[^\d+]/g, "") : SCHOOL.phone,
    whatsapp: s.whatsapp?.trim() ? s.whatsapp.replace(/\D/g, "") : SCHOOL.whatsapp,
    email: pick(s.email, SCHOOL.email),
    addressLines: pickList(s.addressLines, SCHOOL.addressLines),
    addressShort: pick(s.addressShort, SCHOOL.addressShort),
    mapQuery: pick(s.mapQuery, SCHOOL.mapQuery),
    officeHours: pickList(s.officeHours, SCHOOL.officeHours),
    social: {
      facebook: pick(s.facebook, SCHOOL.social.facebook),
      youtube: pick(s.youtube, SCHOOL.social.youtube),
      instagram: pick(s.instagram, SCHOOL.social.instagram),
    },
    chairman: { name: pick(s.chairmanName, SCHOOL.chairman.name), photo: pick(s.chairmanPhoto, SCHOOL.chairman.photo) },
    heroImage: pick(s.heroImage, DEFAULT_HERO),
    visionImage: pick(s.visionImage, galleryImages[1].src),
    prospectusUrl: pick(s.prospectusUrl, DEFAULT_PROSPECTUS),
    /** Admin-written About history as paragraphs, or null to show the built-in text. */
    aboutHistory: s.aboutHistory?.trim() ? s.aboutHistory.trim().split(/\n\s*\n/) : null,
  };
};

/** Website sections edited from the admin panel, falling back to src/data/site.ts. */
export const useSiteContent = () => {
  // isPending = first visit, nothing remembered yet and the server hasn't answered.
  const { data = {}, isPending } = useRawContent();

  // Show nothing rather than the bundled logo, which may be the old one.
  const logo = data.branding?.logo || (isPending ? "" : DEFAULT_LOGO);

  const founded = /^d{4}$/.test(data.school?.founded?.trim() ?? "") ? Number(data.school?.founded) : null;
  const years = founded ? new Date().getFullYear() - founded : yearsRunning();
  const statItems = isPending
    ? [] // hide the bar instead of flashing the built-in numbers
    : data.stats
    ? [
        { value: years, suffix: "+", labelKey: "stats.years" },
        ...([
          ["students", "+", "stats.students"],
          ["teachers", "+", "stats.teachers"],
          ["result", "%", "stats.result"],
        ] as const)
          .map(([key, suffix, labelKey]) => ({ value: Number(data.stats?.[key]), suffix, labelKey }))
          .filter((s) => s.value > 0),
      ]
    : visible(stats).map((s) => (s.labelKey === "stats.years" ? { ...s, value: years } : s));

  return {
    toppers: data.toppers ?? visible(toppers),
    events: data.events ?? visible(events),
    fees: data.fees ?? visible(fees),
    transport: data.transport ?? visible(transportRoutes),
    testimonials: data.testimonials ?? visible(testimonials),
    staff: data.staff ?? visible(staff),
    stats: statItems,
    /** Empty while the first load is pending and no logo is remembered: render a blank space. */
    logo,
    hasCustomLogo: Boolean(data.branding?.logo),
    videoIds: data.videos
      ? data.videos.map((v) => youtubeId(v.url)).filter((id): id is string => Boolean(id))
      : youtubeVideoIds,
    admissionSteps: data.admissionSteps ?? admissionSteps,
    admissionDocuments: data.admissionDocuments?.map((d) => d.text) ?? admissionDocuments,
    ageCriteria: data.ageCriteria ?? ageCriteria,
    classOptions: data.classOptions?.map((c) => c.name) ?? classOptions,
    sessionCalendar: data.sessionCalendar ?? sessionCalendar,
    streams: data.streams ?? streams,
    stages: data.stages ?? stages,
  };
};

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
