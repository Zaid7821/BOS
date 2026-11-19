import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Megaphone } from "lucide-react";
import { useNotices } from "@/hooks/useNotices";
import { useLanguage } from "@/lib/i18n";

/**
 * Slim bar under the header with the newest notice; the whole bar opens the Notices page.
 * It stays still (moving text is hard to read on phones). Hidden on the home page, which has
 * its own "Latest notices" card, and when there are no notices.
 */
const NoticeTicker = () => {
  const { pathname } = useLocation();
  const { notices } = useNotices();
  const { t } = useLanguage();
  if (pathname === "/" || !notices.length) return null;
  const latest = notices[0];

  return (
    <Link to="/events" className="block bg-secondary text-secondary-foreground text-sm hover:bg-secondary-light">
      <div className="container mx-auto flex min-h-11 items-center gap-3 px-4 py-2">
        <span className="flex shrink-0 items-center gap-1.5 font-semibold">
          <Megaphone className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">{t("notice.label")}</span>
        </span>
        <span className="min-w-0 flex-1 truncate">
          {latest.is_important && <span className="mr-2 rounded bg-red-600 px-1.5 py-0.5 text-[11px] font-bold text-white">{t("notice.new")}</span>}
          {latest.title}
        </span>
        <span className="flex shrink-0 items-center font-semibold">
          <span className="hidden sm:inline">{t("notice.viewAll")}</span>
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
};

export default NoticeTicker;
