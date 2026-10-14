import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";
import { useNotices } from "@/hooks/useNotices";
import { useLanguage } from "@/lib/i18n";

/** Scrolling notice strip under the header. Hidden when there are no notices. */
const NoticeTicker = () => {
  const { notices } = useNotices();
  const { t } = useLanguage();
  if (!notices.length) return null;

  const items = notices.map((n) => (
    <span key={n.id} className="mx-8 inline-flex items-center gap-2">
      {n.is_important && <span className="rounded bg-red-600 px-1.5 py-0.5 text-[11px] font-bold text-white">NEW</span>}
      {n.title}
    </span>
  ));

  return (
    <div className="bg-secondary text-secondary-foreground text-sm">
      <div className="container mx-auto flex items-center gap-3 px-4 py-2">
        <span className="flex shrink-0 items-center gap-1.5 font-semibold">
          <Megaphone className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t("notice.label")}</span>
        </span>
        <div className="ticker relative flex-1 overflow-hidden whitespace-nowrap" aria-live="off">
          <div className="ticker-track inline-block">
            {items}
            <span aria-hidden="true">{items}</span>
          </div>
        </div>
        <Link to="/events" className="shrink-0 font-semibold underline underline-offset-2 hover:no-underline">
          {t("notice.viewAll")}
        </Link>
      </div>
    </div>
  );
};

export default NoticeTicker;
