import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, Users, ShieldCheck } from "lucide-react";
import StatsCounter from "@/components/StatsCounter";
import SampleTag from "@/components/SampleTag";
import { useSchool, useSiteContent } from "@/hooks/useSiteContent";
import { useLanguage } from "@/lib/i18n";
import { usePageTitle } from "@/hooks/usePageTitle";

const About = () => {
  const school = useSchool();
  const { lang, t } = useLanguage();
  usePageTitle(t("nav.about"));
  const staffList = useSiteContent().staff;
  const vars = { year: school.founded, name: lang === "hi" ? school.nameHi : school.name };
  // Admin-written history (School details) wins; otherwise the built-in text in the visitor's language.
  const history = school.aboutHistory ?? t("about.history", vars).split(/\n\s*\n/);
  const values = t("about.values").split("\n").map((v) => v.trim()).filter(Boolean);

  return (
    <Layout>
      <div className="space-y-12 md:space-y-16">
        {/* Hero */}
        <section className="bg-gradient-subtle py-10 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">{t("about.badge")}</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">{t("about.title", vars)}</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">{t("about.intro", vars)}</p>
          </div>
        </section>

        {/* History + affiliation */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">{t("about.historyTitle")}</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed max-w-prose">
                {history.map((para, i) => <p key={i} className="whitespace-pre-line">{para}</p>)}
              </div>
            </div>

            <Card className="border-primary/20 shadow-school-md self-start">
              <CardHeader>
                <ShieldCheck className="h-10 w-10 text-accent mb-2" aria-hidden="true" />
                <CardTitle className="text-2xl text-primary">{t("about.affiliationTitle")}</CardTitle>
                <CardDescription>{t("about.affiliationBoard")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">{t("header.affiliationNo")}</span>
                  <span className="font-bold text-primary">{school.affiliationNo}</span>
                </div>
                <div className="flex justify-between gap-4 border-b pb-2">
                  <span className="text-muted-foreground">{t("about.levelLabel")}</span>
                  <span className="font-semibold text-right">{t("about.level")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("about.establishedLabel")}</span>
                  <span className="font-semibold">{school.founded}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Mission, Vision, Values */}
        <section className="bg-gradient-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-secondary" aria-hidden="true" />
                  <CardTitle className="text-xl">{t("about.missionTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/90">{t("home.missionText")}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader className="text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-secondary" aria-hidden="true" />
                  <CardTitle className="text-xl">{t("about.visionTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/90">{t("home.visionText")}</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-secondary" aria-hidden="true" />
                  <CardTitle className="text-xl">{t("about.valuesTitle")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-primary-foreground/90 list-disc pl-5">
                    {values.map((v) => <li key={v}>{v}</li>)}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Staff */}
        {staffList.length > 0 && (
          <section className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">{t("about.staffTitle")}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {staffList.map((member, index) => (
                <Card key={index} className="shadow-school-sm border-primary/10 text-center">
                  <CardHeader>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                      {member.name.replace(/^(Mr|Mrs|Ms|Dr)\.?\s+/i, "").split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <CardTitle className="text-lg text-primary">
                      {member.name} <SampleTag show={member.isSample} />
                    </CardTitle>
                    <CardDescription className="text-secondary font-medium">{member.position}</CardDescription>
                  </CardHeader>
                  {member.qualification && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{member.qualification}</p>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          </section>
        )}

        <StatsCounter />
      </div>
    </Layout>
  );
};

export default About;
