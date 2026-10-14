import { SCHOOL } from "@/data/site";
import { useLanguage } from "@/lib/i18n";

const WhatsAppIcon = () => (
  <svg viewBox="0 0 32 32" aria-hidden="true" className="h-7 w-7 fill-current">
    <path d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.3.6 4.53 1.74 6.5L3 29l6.68-1.75A12.95 12.95 0 0 0 16.04 29C23.2 29 29 23.18 29 16S23.2 3 16.04 3Zm0 23.62c-1.98 0-3.92-.53-5.61-1.54l-.4-.24-3.96 1.04 1.06-3.86-.26-.4a10.6 10.6 0 0 1-1.63-5.62c0-5.88 4.79-10.66 10.8-10.66 5.86 0 10.63 4.78 10.63 10.66 0 5.88-4.77 10.62-10.63 10.62Zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.3-.1-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.18.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.18-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.18.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.72-1.73-.98-2.37-.26-.62-.52-.54-.72-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66 0 1.57 1.14 3.09 1.3 3.3.16.21 2.24 3.42 5.43 4.8.76.33 1.35.52 1.81.67.76.24 1.45.2 2 .12.61-.09 1.89-.77 2.15-1.52.27-.74.27-1.38.19-1.52-.08-.13-.29-.21-.61-.37Z" />
  </svg>
);

const WhatsAppButton = () => {
  const { t } = useLanguage();
  const href = `https://wa.me/${SCHOOL.whatsapp}?text=${encodeURIComponent(t("whatsapp.message"))}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t("cta.whatsapp")}
      className="fixed bottom-5 left-5 z-50 hidden md:flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#128C7E]"
    >
      <WhatsAppIcon />
      <span className="font-semibold">{t("cta.whatsapp")}</span>
    </a>
  );
};

export default WhatsAppButton;
