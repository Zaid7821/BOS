import { Link } from "react-router-dom";
import { BookOpen, GraduationCap, Images, IndianRupee, Megaphone, PhoneCall } from "lucide-react";
import { useLanguage, type TKey } from "@/lib/i18n";

const tiles: { to: string; key: TKey; icon: typeof BookOpen; color: string }[] = [
  { to: "/admissions", key: "nav.admissions", icon: GraduationCap, color: "bg-blue-100 text-blue-800" },
  { to: "/fees", key: "nav.fees", icon: IndianRupee, color: "bg-emerald-100 text-emerald-800" },
  { to: "/events", key: "nav.events", icon: Megaphone, color: "bg-amber-100 text-amber-800" },
  { to: "/gallery", key: "nav.gallery", icon: Images, color: "bg-pink-100 text-pink-800" },
  { to: "/academics", key: "nav.academics", icon: BookOpen, color: "bg-violet-100 text-violet-800" },
  { to: "/contact", key: "nav.contact", icon: PhoneCall, color: "bg-sky-100 text-sky-800" },
];

/** App-style shortcut tiles under the hero, so parents on phones tap instead of scrolling. */
const QuickTiles = () => {
  const { t } = useLanguage();
  return (
    <nav aria-label={t("footer.quickLinks")} className="container relative z-10 mx-auto -mt-8 px-4 md:-mt-12">
      <ul className="grid grid-cols-3 gap-2.5 rounded-2xl bg-card p-3 shadow-school-md ring-1 ring-primary/10 sm:gap-3 md:grid-cols-6 md:p-4">
        {tiles.map(({ to, key, icon: Icon, color }) => (
          <li key={to}>
            <Link
              to={to}
              className="flex h-full min-h-[92px] flex-col items-center justify-center gap-2 rounded-xl px-1 py-3 text-center transition-colors hover:bg-muted active:bg-muted"
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-full ${color}`}>
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="text-[13px] font-semibold leading-tight text-foreground sm:text-sm">{t(key)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default QuickTiles;
