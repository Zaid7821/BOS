import { Quote } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useLanguage } from "@/lib/i18n";
import SampleTag from "./SampleTag";

const Testimonials = () => {
  const { t } = useLanguage();
  const items = useSiteContent().testimonials;
  if (!items.length) return null;
  return (
    <section className="bg-gradient-subtle py-10 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-primary mb-10 text-center">{t("home.testimonialsTitle")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <figure key={i} className="rounded-lg bg-card p-6 shadow-school-sm border border-primary/10">
              <Quote className="h-7 w-7 text-secondary mb-3" aria-hidden="true" />
              <blockquote className="text-foreground leading-relaxed">{item.quote}</blockquote>
              <figcaption className="mt-4 text-sm">
                <span className="font-semibold text-primary">{item.name}</span>{" "}
                <span className="text-muted-foreground">{item.role}</span> <SampleTag show={item.isSample} />
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
