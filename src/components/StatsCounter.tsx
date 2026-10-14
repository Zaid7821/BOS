import { useEffect, useRef, useState } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useLanguage, type TKey } from "@/lib/i18n";
import SampleTag from "./SampleTag";

const CountUp = ({ to, suffix = "" }: { to: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      setValue(to);
      return;
    }
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 1400;
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        setValue(Math.round(to * (1 - Math.pow(1 - progress, 3))));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [to]);

  return (
    <span ref={ref}>
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
};

const mdCols: Record<number, string> = { 1: "md:grid-cols-1", 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" };

const StatsCounter = () => {
  const { t } = useLanguage();
  const items = useSiteContent().stats;
  if (!items.length) return null;
  return (
    <section className="bg-primary text-primary-foreground py-10 md:py-12">
      <div className={`container mx-auto px-4 grid grid-cols-2 gap-6 md:gap-8 text-center ${mdCols[items.length] ?? "md:grid-cols-4"}`}>
        {items.map((s) => (
          <div key={s.labelKey}>
            <div className="text-3xl md:text-5xl font-bold text-secondary">
              <CountUp to={s.value} suffix={s.suffix} />
            </div>
            <div className="mt-2 text-primary-foreground/85">
              {t(s.labelKey as TKey)} <SampleTag show={s.isSample} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsCounter;
