import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Download, Phone } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import { useSchool, useSiteContent } from "@/hooks/useSiteContent";
import { useLanguage } from "@/lib/i18n";
import { usePageTitle } from "@/hooks/usePageTitle";

const Admissions = () => {
  const school = useSchool();
  const { admissionSteps, admissionDocuments, ageCriteria } = useSiteContent();
  const { t } = useLanguage();
  usePageTitle("Admissions");

  return (
    <Layout>
      <div className="space-y-12 md:space-y-16">
        <section className="bg-gradient-subtle py-10 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">Nursery to Class XI</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">Admissions</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Join {school.name}, a CBSE-affiliated school in Fatehpur. Here is everything you need to apply.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="hero" size="lg" asChild>
                <a href="#enquiry">{t("cta.enquire")}</a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href={school.prospectusUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="h-5 w-5 mr-2" aria-hidden="true" />
                  {t("cta.prospectus")}
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Steps + form */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">How to apply</h2>
              <ol className="space-y-6">
                {admissionSteps.map((step, index) => (
                  <li key={step.title} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold text-primary">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8 rounded-lg bg-secondary-lighter p-5">
                <p className="font-semibold mb-2">Prefer to talk?</p>
                <a href={`tel:${school.phone}`} className="inline-flex items-center gap-2 text-lg font-bold text-primary hover:underline">
                  <Phone className="h-5 w-5" aria-hidden="true" />
                  {school.phoneDisplay}
                </a>
                <p className="text-sm text-muted-foreground mt-1">{school.officeHours[0]}</p>
              </div>
            </div>
            <EnquiryForm />
          </div>
        </section>

        {/* Documents + age */}
        <section className="bg-gradient-subtle py-10 md:py-16">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-school-sm border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Documents required</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {admissionDocuments.map((doc) => (
                    <li key={doc} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                      <span className="text-muted-foreground">{doc}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="shadow-school-sm border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Age criteria (early years)</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 font-semibold">Class</th>
                      <th className="py-2 font-semibold">Minimum age</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ageCriteria.map((row) => (
                      <tr key={row.className} className="border-b last:border-0">
                        <td className="py-2">{row.className}</td>
                        <td className="py-2 text-muted-foreground">{row.age}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p className="text-sm text-muted-foreground mt-4">
                  Admission to Class XI is based on Class X board results and seat availability in each stream.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Admissions;
