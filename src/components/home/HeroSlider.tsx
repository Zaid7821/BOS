import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_HERO, useGallery, useSchool, useSiteContent } from "@/hooks/useSiteContent";
import { cld, cldSrcSet } from "@/lib/cloudinary";
import { useLanguage } from "@/lib/i18n";

const MAX_AUTO_SLIDES = 5; // when the office hasn't chosen slider photos
const MAX_CHOSEN_SLIDES = 10;
const AUTO_ADVANCE_MS = 5000;

type Slide = { src: string; srcSet?: string; alt: string; caption?: string };

/**
 * Home page hero: swipeable photos of the school. Uses the photos chosen in Admin > Website content >
 * Home slider photos; if none are chosen, the main picture first, then the newest gallery photos,
 * with the school name and one main button on top. Swiping uses native scroll-snap, so it is
 * smooth on cheap phones and needs no slider library. Auto-advances until the visitor touches it.
 */
const HeroSlider = () => {
  const school = useSchool();
  const { photos } = useGallery();
  const { heroSlides } = useSiteContent();
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const track = useRef<HTMLDivElement>(null);
  const userTouched = useRef(false);
  const [active, setActive] = useState(0);

  const hero: Slide =
    school.heroImage === DEFAULT_HERO
      ? { src: DEFAULT_HERO, srcSet: "/images/bos-hero-800.jpg 800w, /images/bos-hero.jpg 1280w", alt: school.name }
      : { src: cld(school.heroImage, 1280), srcSet: cldSrcSet(school.heroImage, [800, 1280, 1920]), alt: school.name };
  const slides: Slide[] = heroSlides.length
    ? heroSlides.slice(0, MAX_CHOSEN_SLIDES).map((h) => {
        const caption = (lang === "hi" && h.captionHi?.trim()) || h.caption?.trim() || "";
        return { src: cld(h.image, 1280), srcSet: cldSrcSet(h.image, [800, 1280, 1920]), alt: caption || school.name, caption };
      })
    : [
        hero,
        ...photos
          .filter((p) => p.src !== school.heroImage)
          .slice(0, MAX_AUTO_SLIDES - 1)
          .map((p) => ({ src: cld(p.src, 1280), srcSet: cldSrcSet(p.src, [800, 1280, 1920]), alt: p.alt })),
      ];

  // Move to the next photo every few seconds, unless the visitor has swiped, the tab is hidden,
  // or they asked their phone for less motion.
  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      const el = track.current;
      if (!el || userTouched.current || document.hidden) return;
      const next = (Math.round(el.scrollLeft / el.clientWidth) + 1) % slides.length;
      el.scrollTo({ left: next * el.clientWidth, behavior: "smooth" });
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [slides.length]);

  const goTo = (i: number) => {
    userTouched.current = true;
    const el = track.current;
    el?.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  };

  return (
    <section className="relative h-[50svh] min-h-[330px] md:h-[78vh] md:min-h-[520px] overflow-hidden bg-slate-900" aria-roledescription="carousel">
      {/* Photos */}
      <div
        ref={track}
        className="no-scrollbar flex h-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        onScroll={(e) => setActive(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        onPointerDown={() => (userTouched.current = true)}
        onTouchStart={() => (userTouched.current = true)}
      >
        {slides.map((s, i) => (
          <div key={`${i}-${s.src}`} className="relative h-full w-full shrink-0 snap-start overflow-hidden">
            <img
              src={s.src}
              srcSet={s.srcSet}
              sizes="100vw"
              alt={i === 0 ? "" : s.alt}
              loading={i === 0 ? "eager" : "lazy"}
              // React 18 doesn't know the camelCase prop yet; the lowercase HTML attribute works in browsers.
              {...({ fetchpriority: i === 0 ? "high" : "low" } as object)}
              draggable={false}
              className={`h-full w-full object-cover ${i === active ? "hero-zoom" : ""}`}
            />
            {s.caption && (
              <span className="absolute left-4 top-4 max-w-[80%] truncate rounded-full bg-black/55 px-3 py-1 text-sm font-medium text-white backdrop-blur-sm">
                {s.caption}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Neutral dark fade only at the bottom: the photo stays bright and true-coloured, the text stays readable */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent md:from-black/80 md:via-black/45 md:to-black/20" />

      {/* Text and button (only the button and dots catch taps, so swiping works everywhere else).
          Phones: left-aligned at the bottom, like an app. Computers: centred, with the longer text. */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 pb-10 md:pb-24">
        <div className="container mx-auto px-4 text-left md:text-center">
          <span className="inline-block rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md md:text-sm">
            {t("home.badge")}
          </span>
          <h1 className="mt-2.5 text-[1.6rem] font-bold leading-[1.15] text-white drop-shadow-lg sm:text-4xl md:mt-5 md:text-6xl">
            <span className="hidden md:block text-3xl font-medium text-white/90 mb-2">{t("home.welcome")}</span>
            <span className="block md:text-secondary">{lang === "hi" ? school.nameHi : school.name}</span>
          </h1>
          <p className="hidden md:block mt-4 text-lg font-semibold text-white/95">
            {t("header.affiliated")} · {t("header.affiliationNo")} {school.affiliationNo}
          </p>
          <p className="hidden md:block mt-3 text-xl text-gray-100 max-w-3xl mx-auto drop-shadow">{t("home.tagline")}</p>

          <div className="pointer-events-auto mt-4 flex items-center justify-between gap-3 md:mt-8 md:flex-col md:justify-center">
            <div className="flex gap-3">
              <Button className="h-11 rounded-full bg-secondary px-5 text-[15px] font-semibold text-secondary-foreground shadow-lg hover:bg-secondary-light md:h-12 md:px-8 md:text-base" onClick={() => navigate("/admissions#enquiry")}>
                {t("cta.enquire")}
                <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />
              </Button>
              {/* Phones already have Call in the bottom bar */}
              <Button variant="outline" className="hidden md:inline-flex h-12 rounded-full bg-white/10 text-white border-white/60 hover:bg-white hover:text-primary text-base px-8" asChild>
                <a href={`tel:${school.phone}`}>
                  <Phone className="h-5 w-5 mr-2" aria-hidden="true" />
                  {t("cta.call")}
                </a>
              </Button>
            </div>

            {slides.length > 1 && (
              <div className="flex shrink-0">
                {slides.map((s, i) => (
                  <button
                    key={`${i}-${s.src}`}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={t("home.slideLabel", { n: i + 1 })}
                    aria-current={i === active}
                    className="flex h-8 w-4 items-center justify-center md:w-8"
                  >
                    <span className={`block h-1.5 rounded-full transition-all ${i === active ? "w-5 bg-white" : "w-1.5 bg-white/50"}`} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSlider;
