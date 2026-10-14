import { Trophy } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { cld } from "@/lib/cloudinary";
import { useLanguage } from "@/lib/i18n";
import SampleTag from "./SampleTag";

const Toppers = () => {
  const { t } = useLanguage();
  const items = useSiteContent().toppers;
  if (!items.length) return null;
  return (
    <section className="container mx-auto px-4">
      <h2 className="text-2xl md:text-4xl font-bold text-primary mb-8 text-center">{t("home.toppersTitle")}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((s, i) => (
          <div key={i} className="flex items-center gap-4 rounded-lg border border-primary/10 bg-card p-5 shadow-school-sm">
            {s.photo ? (
              <img src={cld(s.photo, 160)} alt={s.name} className="h-20 w-20 shrink-0 rounded-full object-cover" loading="lazy" />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-secondary-lighter">
                <Trophy className="h-9 w-9 text-secondary" aria-hidden="true" />
              </div>
            )}
            <div>
              <p className="text-2xl md:text-3xl font-bold text-primary">{s.percentage}</p>
              <p className="font-semibold">{s.name} <SampleTag show={s.isSample} /></p>
              <p className="text-sm text-muted-foreground">{s.className}, {s.year}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Toppers;
