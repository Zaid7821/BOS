import Layout from "@/components/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { useSchool, useSiteContent, type BoardResult, type DisclosureDoc, type DisclosureRow } from "@/hooks/useSiteContent";
import { useLanguage } from "@/lib/i18n";
import { usePageTitle } from "@/hooks/usePageTitle";

/**
 * CBSE Mandatory Public Disclosure (Appendix IX of the Affiliation Bye-Laws 2018).
 * Every value comes from the admin panel (Website content > CBSE disclosure).
 */

const EMPTY = "—";
const isLink = (value: string) => /^https:\/\/\S+$/.test(value.trim());

const Value = ({ value }: { value: string }) =>
  !value.trim() ? (
    <span className="text-muted-foreground">{EMPTY}</span>
  ) : isLink(value) ? (
    <a href={value.trim()} target="_blank" rel="noopener noreferrer" className="break-all text-primary underline">
      {value.trim()}
    </a>
  ) : (
    <span className="whitespace-pre-line">{value}</span>
  );

const SectionTitle = ({ id, children }: { id: string; children: React.ReactNode }) => (
  <h2 id={id} className="scroll-mt-28 text-xl md:text-2xl font-bold text-primary mb-4">{children}</h2>
);

const tableClass = "hidden md:block overflow-x-auto rounded-lg border border-primary/10 shadow-school-sm";
const headClass = "bg-primary text-primary-foreground";

/** Sections A, D and E: information / details pairs. */
const InfoTable = ({ rows }: { rows: DisclosureRow[] }) => {
  const { t } = useLanguage();
  return (
    <>
      <ol className="space-y-3 md:hidden">
        {rows.map((row, i) => (
          <li key={i} className="rounded-lg border border-primary/10 bg-card p-4 shadow-school-sm">
            <p className="text-sm text-muted-foreground">{i + 1}. {row.label}</p>
            <p className="mt-1 font-medium"><Value value={row.value} /></p>
          </li>
        ))}
      </ol>
      <div className={tableClass}>
        <table className="w-full text-left">
          <thead className={headClass}>
            <tr>
              <th className="w-20 px-4 py-3">{t("disclosure.colSno")}</th>
              <th className="px-4 py-3">{t("disclosure.colInfo")}</th>
              <th className="px-4 py-3">{t("disclosure.colDetails")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b last:border-0 even:bg-muted/50 align-top">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3">{row.label}</td>
                <td className="px-4 py-3 font-medium"><Value value={row.value} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const DocLink = ({ url }: { url: string }) => {
  const { t } = useLanguage();
  if (!isLink(url)) return <span className="text-muted-foreground">{EMPTY}</span>;
  return (
    <Button variant="outline" size="sm" className="h-11 shrink-0" asChild>
      <a href={url.trim()} target="_blank" rel="noopener noreferrer">
        <FileText className="h-4 w-4 mr-1.5" aria-hidden="true" />
        {t("disclosure.view")}
      </a>
    </Button>
  );
};

/** Sections B and C: documents with a link to the PDF. */
const DocTable = ({ docs }: { docs: DisclosureDoc[] }) => {
  const { t } = useLanguage();
  return (
    <>
      <ol className="space-y-3 md:hidden">
        {docs.map((d, i) => (
          <li key={i} className="flex items-center justify-between gap-3 rounded-lg border border-primary/10 bg-card p-4 shadow-school-sm">
            <p className="text-sm">{i + 1}. {d.title}</p>
            <DocLink url={d.url} />
          </li>
        ))}
      </ol>
      <div className={tableClass}>
        <table className="w-full text-left">
          <thead className={headClass}>
            <tr>
              <th className="w-20 px-4 py-3">{t("disclosure.colSno")}</th>
              <th className="px-4 py-3">{t("disclosure.colDocument")}</th>
              <th className="w-32 px-4 py-3">{t("disclosure.colLink")}</th>
            </tr>
          </thead>
          <tbody>
            {docs.map((d, i) => (
              <tr key={i} className="border-b last:border-0 even:bg-muted/50 align-middle">
                <td className="px-4 py-3">{i + 1}</td>
                <td className="px-4 py-3">{d.title}</td>
                <td className="px-4 py-3"><DocLink url={d.url} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

/** Pass % as entered, or worked out from passed / registered. */
const passPercent = (r: BoardResult) => {
  if (r.percentage?.trim()) return r.percentage.trim().replace(/%$/, "") + "%";
  const registered = Number(r.registered);
  const passed = Number(r.passed);
  if (!(registered > 0) || !(passed >= 0) || r.passed?.trim() === "") return EMPTY;
  return `${Number(((passed / registered) * 100).toFixed(2))}%`;
};

/** Board results, one table per class (Class X, Class XII), newest year first. */
const ResultTables = ({ results }: { results: BoardResult[] }) => {
  const { t } = useLanguage();
  const groups = [...new Set(results.map((r) => r.exam.trim()))];
  const cols = [t("disclosure.colYear"), t("disclosure.colRegistered"), t("disclosure.colPassed"), t("disclosure.colPassPct"), t("disclosure.colRemarks")];
  if (!groups.length) return <p className="text-muted-foreground">{t("disclosure.noResults")}</p>;

  return (
    <div className="space-y-6">
      {groups.map((exam) => {
        const rows = results.filter((r) => r.exam.trim() === exam).sort((a, b) => b.year.localeCompare(a.year));
        const cells = (r: BoardResult) => [r.year, r.registered, r.passed, passPercent(r), r.remarks];
        return (
          <div key={exam}>
            <h4 className="mb-3 text-lg font-semibold text-primary">{exam}</h4>
            <div className="space-y-3 md:hidden">
              {rows.map((r, i) => (
                <dl key={i} className="rounded-lg border border-primary/10 bg-card p-4 shadow-school-sm space-y-1.5 text-sm">
                  {cells(r).map((value, c) => (
                    <div key={c} className="flex justify-between gap-4 border-t border-border/60 pt-1.5 first:border-0 first:pt-0">
                      <dt className="text-muted-foreground">{cols[c]}</dt>
                      <dd className="text-right font-medium">{value?.trim() || EMPTY}</dd>
                    </div>
                  ))}
                </dl>
              ))}
            </div>
            <div className={tableClass}>
              <table className="w-full text-left">
                <thead className={headClass}>
                  <tr>{cols.map((c) => <th key={c} className="px-4 py-3">{c}</th>)}</tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-b last:border-0 even:bg-muted/50">
                      {cells(r).map((value, c) => <td key={c} className="px-4 py-3">{value?.trim() || EMPTY}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const Disclosure = () => {
  const { t } = useLanguage();
  usePageTitle(t("disclosure.title"));
  const school = useSchool();
  const { disclosure } = useSiteContent();

  return (
    <Layout>
      <div className="space-y-10 md:space-y-14">
        <section className="bg-gradient-subtle py-10 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">CBSE {t("header.affiliationNo")} {school.affiliationNo}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">{t("disclosure.title")}</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">{t("disclosure.intro")}</p>
          </div>
        </section>

        <div className="container mx-auto px-4 max-w-5xl space-y-10 md:space-y-14">
          <section>
            <SectionTitle id="general">{t("disclosure.generalTitle")}</SectionTitle>
            <InfoTable rows={disclosure.general} />
          </section>

          <section>
            <SectionTitle id="documents">{t("disclosure.documentsTitle")}</SectionTitle>
            <DocTable docs={disclosure.documents} />
          </section>

          <section className="space-y-6">
            <SectionTitle id="academics">{t("disclosure.academicsTitle")}</SectionTitle>
            <DocTable docs={disclosure.academics} />
            <h3 className="pt-2 text-lg md:text-xl font-semibold text-primary">{t("disclosure.resultsTitle")}</h3>
            <ResultTables results={disclosure.results} />
          </section>

          <section>
            <SectionTitle id="staff">{t("disclosure.staffTitle")}</SectionTitle>
            <InfoTable rows={disclosure.staff} />
          </section>

          <section>
            <SectionTitle id="infrastructure">{t("disclosure.infraTitle")}</SectionTitle>
            <InfoTable rows={disclosure.infrastructure} />
          </section>
        </div>
      </div>
    </Layout>
  );
};

export default Disclosure;
