import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatsCounter from "@/components/StatsCounter";
import Toppers from "@/components/Toppers";
import Testimonials from "@/components/Testimonials";
import { BookOpen, Users, GraduationCap, Phone } from "lucide-react";
import { SCHOOL, galleryImages } from "@/data/site";
import { cld, cldSrcSet } from "@/lib/cloudinary";
import { useLanguage } from "@/lib/i18n";
import { usePageTitle } from "@/hooks/usePageTitle";

const Home = () => {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  usePageTitle();

  const highlights = [
    { icon: BookOpen, title: t("home.why1Title"), description: t("home.why1Text") },
    { icon: Users, title: t("home.why2Title"), description: t("home.why2Text") },
    { icon: GraduationCap, title: t("home.why3Title"), description: t("home.why3Text") },
  ];

  return (
    <Layout>
      <div className="space-y-12 md:space-y-16">
        {/* Hero */}
        <section className="relative min-h-[70svh] md:min-h-[78vh] flex items-center justify-center overflow-hidden">
          <img
            src="/images/bos-hero.jpg"
            srcSet="/images/bos-hero-800.jpg 800w, /images/bos-hero.jpg 1280w"
            sizes="100vw"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-blue-900/75 to-emerald-700/70" />

          <div className="container mx-auto px-4 text-center relative z-10 py-12 md:py-16">
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-5 md:mb-6 text-xs sm:text-sm px-4 py-2 bg-amber-400 text-black font-semibold shadow-lg hover:bg-amber-400">
                {t("home.badge")}
              </Badge>

              <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 leading-tight text-white drop-shadow-xl">
                <span className="block text-xl md:text-3xl font-medium text-white/90 mb-2">{t("home.welcome")}</span>
                <span className="block text-secondary">{lang === "hi" ? SCHOOL.nameHi : SCHOOL.name}</span>
              </h1>

              <p className="text-base md:text-lg mb-3 font-semibold text-white/95">
                {t("header.affiliated")} · {t("header.affiliationNo")} {SCHOOL.affiliationNo}
              </p>

              <p className="text-base md:text-xl mb-8 text-gray-100 max-w-3xl mx-auto drop-shadow">{t("home.tagline")}</p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary-light text-base px-8" onClick={() => navigate("/admissions#enquiry")}>
                  {t("cta.enquire")}
                </Button>
                <Button size="lg" variant="outline" className="bg-white/10 text-white border-white/60 hover:bg-white hover:text-primary text-base px-8" asChild>
                  <a href={`tel:${SCHOOL.phone}`}>
                    <Phone className="h-5 w-5 mr-2" aria-hidden="true" />
                    {t("cta.call")}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-primary mb-6">{t("home.visionTitle")}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">{t("home.vision")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("home.visionText")}</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary mb-2">{t("home.mission")}</h3>
                  <p className="text-muted-foreground leading-relaxed">{t("home.missionText")}</p>
                </div>
              </div>
            </div>
            <img
              src={cld(galleryImages[1].src, 900)}
              srcSet={cldSrcSet(galleryImages[1].src)}
              sizes="(min-width: 1024px) 50vw, 100vw"
              alt={galleryImages[1].alt}
              className="w-full aspect-[4/3] object-cover rounded-xl shadow-school-md"
              loading="lazy"
            />
          </div>
        </section>

        <StatsCounter />

        {/* Chairman's Message */}
        <section className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-8 font-serif text-center">{t("home.chairmanTitle")}</h2>
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 lg:gap-10 items-start">
              <div className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] lg:w-[280px] lg:h-[280px] mx-auto lg:mx-0 rounded-full overflow-hidden shadow-lg">
                <img src={cld(SCHOOL.chairman.photo, 600)} alt={SCHOOL.chairman.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="space-y-5">
                <p className="text-muted-foreground leading-relaxed">{t("home.chairmanP1")}</p>
                <p className="text-muted-foreground leading-relaxed">{t("home.chairmanP2")}</p>
                <p className="text-muted-foreground leading-relaxed">{t("home.chairmanP3")}</p>
                <div className="pt-2 text-center sm:text-right">
                  <p className="text-lg font-semibold text-primary">{SCHOOL.chairman.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("home.chairmanRole")}, {lang === "hi" ? SCHOOL.nameHi : SCHOOL.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why choose us */}
        <section className="bg-gradient-subtle py-10 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-4xl font-bold text-primary mb-10 text-center">{t("home.whyTitle")}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {highlights.map((h) => (
                <div key={h.title} className="text-center rounded-lg bg-card p-6 md:p-8 shadow-school-sm border border-primary/10">
                  <div className="mx-auto mb-4 w-fit p-3 rounded-full bg-primary-lighter">
                    <h.icon className="h-8 w-8 text-primary" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{h.title}</h3>
                  <p className="text-muted-foreground">{h.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Toppers />
        <Testimonials />

        {/* Admission call to action */}
        <section className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-primary text-primary-foreground px-5 py-10 md:px-12 md:py-12 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">{t("home.ctaTitle")}</h2>
            <p className="text-base md:text-lg text-primary-foreground/90 max-w-2xl mx-auto mb-8">{t("home.ctaText")}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" className="text-base px-8" onClick={() => navigate("/admissions#enquiry")}>
                {t("cta.enquire")}
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent text-primary-foreground border-primary-foreground/60 hover:bg-primary-foreground hover:text-primary text-base px-8" asChild>
                <a href="/admission-info.pdf" download>
                  {t("cta.prospectus")}
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Home;
