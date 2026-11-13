import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bus, Phone } from "lucide-react";
import SampleTag from "@/components/SampleTag";
import { useSchool, useSiteContent } from "@/hooks/useSiteContent";
import { useLanguage } from "@/lib/i18n";
import { usePageTitle } from "@/hooks/usePageTitle";

const AskOffice = ({ text }: { text: string }) => {
  const school = useSchool();
  const { t } = useLanguage();
  return (
    <div className="rounded-lg border border-dashed border-primary/30 p-6 md:p-8 text-center">
      <p className="text-lg mb-4">{text}</p>
      <Button variant="hero" asChild>
        <a href={`tel:${school.phone}`}>
          <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
          {t("cta.call")}
        </a>
      </Button>
    </div>
  );
};

const Fees = () => {
  const { t } = useLanguage();
  usePageTitle(t("nav.fees"));
  const { fees: feeRows, transport: routes } = useSiteContent();
  const year = new Date().getFullYear();
  const session = `${year}–${String(year + 1).slice(-2)}`;
  const columns = [t("fees.colAdmission"), t("fees.colMonthly"), t("fees.colAnnual")];

  return (
    <Layout>
      <div className="space-y-12 md:space-y-16">
        <section className="bg-gradient-subtle py-10 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">{t("fees.badge", { session })}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">{t("fees.title")}</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">{t("fees.intro")}</p>
          </div>
        </section>

        <section className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">{t("fees.structureTitle")}</h2>
          {feeRows.length ? (
            <>
            {/* Phones: one card per class group, no sideways scrolling */}
            <div className="space-y-3 md:hidden">
              {feeRows.map((row) => (
                <div key={row.group} className="rounded-lg border border-primary/10 bg-card p-4 shadow-school-sm">
                  <p className="mb-2 font-semibold text-primary">{row.group} <SampleTag show={row.isSample} /></p>
                  <dl className="space-y-1.5 text-sm">
                    {[
                      [columns[0], row.admission],
                      [columns[1], row.monthly],
                      [columns[2], row.annual],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between gap-4 border-t border-border/60 pt-1.5">
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd className="text-right font-medium">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto rounded-lg border border-primary/10 shadow-school-sm">
              <table className="w-full min-w-[560px] text-left">
                <thead className="bg-primary text-primary-foreground">
                  <tr>
                    <th className="px-4 py-3">{t("fees.colClasses")}</th>
                    {columns.map((c) => <th key={c} className="px-4 py-3">{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {feeRows.map((row) => (
                    <tr key={row.group} className="border-b last:border-0 even:bg-muted/50">
                      <td className="px-4 py-3 font-semibold">{row.group} <SampleTag show={row.isSample} /></td>
                      <td className="px-4 py-3">{row.admission}</td>
                      <td className="px-4 py-3">{row.monthly}</td>
                      <td className="px-4 py-3">{row.annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          ) : (
            <AskOffice text={t("fees.askFees")} />
          )}
          <p className="text-sm text-muted-foreground mt-4">{t("fees.note")}</p>
        </section>

        <section className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 flex items-center gap-3">
            <Bus className="h-8 w-8 text-secondary" aria-hidden="true" />
            {t("fees.transportTitle")}
          </h2>
          {routes.length ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {routes.map((r) => (
                <Card key={r.route} className="shadow-school-sm border-primary/10">
                  <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0">
                    <CardTitle className="text-xl text-primary">{r.route} <SampleTag show={r.isSample} /></CardTitle>
                    <span className="font-semibold">{r.monthlyFee} {t("fees.perMonth")}</span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{r.stops.join(" → ")}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <AskOffice text={t("fees.askTransport")} />
          )}
        </section>
      </div>
    </Layout>
  );
};

export default Fees;
