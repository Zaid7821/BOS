import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Phone, Mail, MapPin, Facebook, Youtube, Instagram, Languages, MessageCircle, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { cld } from "@/lib/cloudinary";
import { useSiteContent } from "@/hooks/useSiteContent";
import { SCHOOL, stages } from "@/data/site";
import { useLanguage, type TKey } from "@/lib/i18n";
import NoticeTicker from "./NoticeTicker";
import WhatsAppButton from "./WhatsAppButton";

const navItems: { to: string; key: TKey }[] = [
  { to: "/", key: "nav.home" },
  { to: "/about", key: "nav.about" },
  { to: "/academics", key: "nav.academics" },
  { to: "/admissions", key: "nav.admissions" },
  { to: "/fees", key: "nav.fees" },
  { to: "/events", key: "nav.events" },
  { to: "/gallery", key: "nav.gallery" },
  { to: "/contact", key: "nav.contact" },
];

/** Scrolls to the top on page change, or to #section when the URL has a hash. */
const useScrollOnNavigate = () => {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
};

const LanguageToggle = ({ className = "" }: { className?: string }) => {
  const { lang, setLang, t } = useLanguage();
  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={() => setLang(lang === "en" ? "hi" : "en")}
      aria-label={t("lang.switchLabel")}
    >
      <Languages className="h-4 w-4 mr-1.5" aria-hidden="true" />
      {t("lang.switch")}
    </Button>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  useScrollOnNavigate();
  const { pathname } = useLocation();
  const { logo, hasCustomLogo } = useSiteContent();

  // Use the admin-uploaded logo as the browser tab icon too.
  useEffect(() => {
    if (!hasCustomLogo) return;
    const icon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (icon) {
      icon.href = cld(logo, 64);
      icon.removeAttribute("type");
    }
  }, [logo, hasCustomLogo]);

  const schoolName = lang === "hi" ? SCHOOL.nameHi : SCHOOL.name;
  const goApply = () => navigate("/admissions#enquiry");
  const whatsappHref = `https://wa.me/${SCHOOL.whatsapp}?text=${encodeURIComponent(t("whatsapp.message"))}`;

  // Close the mobile menu whenever the page changes (including back/forward).
  useEffect(() => setIsMobileMenuOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-background pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 border-b border-border shadow-school-sm">
        {/* Top contact bar */}
        <div className="hidden md:block border-b border-border/50 text-sm text-muted-foreground">
          <div className="container mx-auto px-4 flex items-center justify-between py-2">
            <div className="flex items-center gap-6">
              <a href={`tel:${SCHOOL.phone}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4 text-primary" aria-hidden="true" />
                {SCHOOL.phoneDisplay}
              </a>
              <a href={`mailto:${SCHOOL.email}`} className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4 text-primary" aria-hidden="true" />
                {SCHOOL.email}
              </a>
              <span className="hidden lg:flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                {SCHOOL.addressShort}
              </span>
            </div>
            <span className="font-medium text-primary">
              {t("header.affiliationNo")} {SCHOOL.affiliationNo}
            </span>
          </div>
        </div>

        <div className="container mx-auto px-4">
          {/* Main navigation */}
          <div className="flex items-center justify-between gap-4 py-3">
            <Link to="/" className="flex items-center gap-3 min-w-0">
              <img src={cld(logo, 112)} alt="" className="h-11 w-11 md:h-14 md:w-14 shrink-0 object-contain" />
              <div className="min-w-0">
                <p className="text-[15px] sm:text-base md:text-xl font-bold leading-tight text-primary">{schoolName}</p>
                <p className="hidden md:block text-sm text-muted-foreground">{t("header.affiliated")}</p>
                <p className="md:hidden text-xs text-muted-foreground whitespace-nowrap">
                  CBSE Aff. No. {SCHOOL.affiliationNo}
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden xl:flex items-center gap-5" aria-label="Main">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    `text-sm font-medium whitespace-nowrap transition-colors hover:text-primary ${
                      isActive ? "text-primary border-b-2 border-primary pb-1" : "text-foreground"
                    }`
                  }
                >
                  {t(item.key)}
                </NavLink>
              ))}
              <LanguageToggle />
              <Button variant="hero" size="sm" onClick={goApply}>
                {t("cta.apply")}
              </Button>
            </nav>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 xl:hidden">
              <LanguageToggle className="px-2" />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMobileMenuOpen}
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <nav className="xl:hidden pb-4 border-t border-border/50 pt-3 max-h-[calc(100dvh-5rem)] overflow-y-auto" aria-label="Main">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `block text-base font-medium transition-colors hover:text-primary px-3 py-3 rounded ${
                        isActive ? "text-primary bg-primary-lighter" : "text-foreground"
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t(item.key)}
                  </NavLink>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2 px-3">
                <Button variant="hero" size="sm" onClick={() => { setIsMobileMenuOpen(false); goApply(); }}>
                  {t("cta.apply")}
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`tel:${SCHOOL.phone}`}>
                    <Phone className="h-4 w-4 mr-1.5" aria-hidden="true" />
                    {t("cta.call")}
                  </a>
                </Button>
              </div>
            </nav>
          )}
        </div>
        <NoticeTicker />
      </header>

      {/* Main Content */}
      <main id="main">{children}</main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground mt-12 md:mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* School Info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 shrink-0 rounded bg-white flex items-center justify-center overflow-hidden">
                  <img src={cld(logo, 80)} alt="" className="h-10 w-10 object-contain" loading="lazy" />
                </div>
                <p className="text-lg font-semibold leading-tight">{schoolName}</p>
              </div>
              <p className="text-primary-foreground/80 text-sm mb-1">{t("footer.about")}</p>
              <p className="text-sm font-semibold text-secondary mb-4">
                {t("header.affiliated")}
                <br />
                {t("header.affiliationNo")} {SCHOOL.affiliationNo}
              </p>
              <div className="space-y-2 text-sm text-primary-foreground/80">
                <p className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0" aria-hidden="true" />
                  {SCHOOL.addressShort}
                </p>
                <a href={`tel:${SCHOOL.phone}`} className="flex items-center gap-2 hover:text-primary-foreground hover:underline">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  {SCHOOL.phoneDisplay}
                </a>
                <a href={`mailto:${SCHOOL.email}`} className="flex items-center gap-2 hover:text-primary-foreground hover:underline">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {SCHOOL.email}
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("footer.quickLinks")}</h2>
              <ul className="space-y-2">
                {navItems.slice(1).map((item) => (
                  <li key={item.to}>
                    <Link to={item.to} className="text-sm text-primary-foreground/80 hover:text-primary-foreground hover:underline">
                      {t(item.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Academics */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("footer.academics")}</h2>
              <ul className="space-y-2 text-sm text-primary-foreground/80">
                {stages.map((s) => (
                  <li key={s.level}>
                    {s.level} <span className="text-primary-foreground/60">({s.classes})</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h2 className="text-lg font-semibold mb-4">{t("footer.connect")}</h2>
              <div className="flex gap-3">
                {[
                  { href: SCHOOL.social.facebook, label: "Facebook", Icon: Facebook },
                  { href: SCHOOL.social.youtube, label: "YouTube", Icon: Youtube },
                  { href: SCHOOL.social.instagram, label: "Instagram", Icon: Instagram },
                ].map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-primary-foreground/30 transition-colors hover:bg-primary-foreground hover:text-primary"
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                ))}
              </div>
              <Button variant="secondary" size="sm" className="mt-6" onClick={goApply}>
                {t("cta.apply")}
              </Button>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
            <p>
              &copy; {new Date().getFullYear()} {SCHOOL.name}. {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>

      <WhatsAppButton />

      {/* Mobile action bar: most visitors are on phones, so keep call / WhatsApp / apply one tap away. */}
      <div className="md:hidden fixed inset-x-0 bottom-0 z-50 grid grid-cols-3 border-t border-border bg-background/95 backdrop-blur pb-[env(safe-area-inset-bottom)] shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <a href={`tel:${SCHOOL.phone}`} className="flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-primary active:bg-muted">
          <Phone className="h-5 w-5" aria-hidden="true" />
          {t("cta.call")}
        </a>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-[#128C7E] active:bg-muted"
        >
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
          {t("cta.whatsapp")}
        </a>
        <button
          type="button"
          onClick={goApply}
          className="flex h-16 flex-col items-center justify-center gap-1 bg-secondary text-xs font-semibold text-secondary-foreground active:bg-secondary-light"
        >
          <Send className="h-5 w-5" aria-hidden="true" />
          {t("cta.apply")}
        </button>
      </div>

      {/* Sticky Apply Now button (desktop). Hidden on the Admissions page, which already has the form. */}
      {pathname !== "/admissions" && (
      <Button
        variant="hero"
        className="fixed bottom-6 right-6 z-50 rounded-full shadow-lg px-6 py-3 text-base hidden md:flex"
        onClick={goApply}
      >
        {t("cta.apply")}
      </Button>
      )}
    </div>
  );
};

export default Layout;
