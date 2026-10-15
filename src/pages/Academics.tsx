import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays } from "lucide-react";
import { useSchool, useSiteContent } from "@/hooks/useSiteContent";
import { usePageTitle } from "@/hooks/usePageTitle";

const Academics = () => {
  const school = useSchool();
  const { stages, streams, sessionCalendar } = useSiteContent();
  usePageTitle("Academics");

  return (
    <Layout>
      <div className="space-y-12 md:space-y-16">
        <section className="bg-gradient-subtle py-10 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">CBSE Curriculum</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">Academics</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              We follow the CBSE curriculum with NCERT textbooks from Nursery to Class XII. Affiliation No. {school.affiliationNo}.
            </p>
          </div>
        </section>

        {/* Stages */}
        <section className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">Stages of schooling</h2>
          <div className="space-y-6">
            {stages.map((stage) => (
              <Card key={stage.level} className="shadow-school-sm border-primary/10">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1">
                    <CardTitle className="text-2xl text-primary">{stage.level}</CardTitle>
                    <span className="text-lg font-semibold text-secondary">{stage.classes}</span>
                  </div>
                  <CardDescription className="text-base">{stage.description}</CardDescription>
                </CardHeader>
                {stage.subjects.length > 0 && stage.subjects[0] !== "See streams below" && (
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {stage.subjects.map((s) => (
                        <Badge key={s} variant="secondary" className="font-normal">{s}</Badge>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Streams */}
        <section className="bg-gradient-subtle py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">Streams in Class XI & XII</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Students choose a stream after Class X based on their interest and board results.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {streams.map((stream) => (
                <Card key={stream.name} className="shadow-school-sm border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">{stream.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-1.5 text-sm text-muted-foreground list-disc pl-5">
                      {stream.subjects.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Session calendar */}
        <section className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-2 text-center">Academic session at a glance</h2>
            <p className="text-center text-muted-foreground mb-8">
              The CBSE session runs from April to March. Exact dates are shared on the notice board.
            </p>
            <ol className="relative border-l-2 border-primary/20 ml-3 space-y-6">
              {sessionCalendar.map((item) => (
                <li key={item.term} className="ml-6">
                  <span className="absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full bg-secondary">
                    <CalendarDays className="h-3 w-3 text-secondary-foreground" aria-hidden="true" />
                  </span>
                  <p className="font-semibold text-primary">{item.term}</p>
                  <p className="text-muted-foreground">{item.period}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Academics;
