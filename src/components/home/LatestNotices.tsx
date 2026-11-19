import { Link } from "react-router-dom";
import { ChevronRight, Megaphone } from "lucide-react";
import { useNotices } from "@/hooks/useNotices";
import { useLanguage } from "@/lib/i18n";

const SHOWN = 3;

/** Home page card with the newest notices (replaces the moving ticker on this page). Hidden when there are none. */
const LatestNotices = () => {
  const { notices } = useNotices();
  const { lang, t } = useLanguage();
  if (!notices.length) return null;

  const date = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "short" });

  return (
    <section className="container mx-auto px-4">
      <div className="overflow-hidden rounded-2xl border border-secondary/40 bg-card shadow-school-sm">
        <div className="flex items-center justify-between gap-3 bg-secondary/20 px-4 py-3">
          <h2 className="flex items-center gap-2 text-lg font-bold text-primary">
            <Megaphone className="h-5 w-5" aria-hidden="true" />
            {t("home.latestNotices")}
          </h2>
          <Link to="/events" className="inline-flex min-h-11 items-center text-sm font-semibold text-primary underline-offset-2 hover:underline">
            {t("notice.viewAll")}
          </Link>
        </div>
        <ul className="divide-y">
          {notices.slice(0, SHOWN).map((n) => (
            <li key={n.id}>
              <Link to="/events" className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted active:bg-muted">
                <span className="w-14 shrink-0 rounded-lg bg-primary/10 py-1.5 text-center text-xs font-semibold leading-tight text-primary">
                  {date(n.created_at)}
                </span>
                <span className="min-w-0 flex-1">
                  {n.is_important && (
                    <span className="mr-2 rounded bg-red-600 px-1.5 py-0.5 align-middle text-[11px] font-bold text-white">{t("notice.new")}</span>
                  )}
                  <span className="font-medium">{n.title}</span>
                </span>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default LatestNotices;
