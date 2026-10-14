import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ExternalLink, Megaphone } from "lucide-react";
import SampleTag from "@/components/SampleTag";
import { useNotices } from "@/hooks/useNotices";
import { useSiteContent } from "@/hooks/useSiteContent";
import { usePageTitle } from "@/hooks/usePageTitle";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

const Events = () => {
  usePageTitle("Notices & Events");
  const { notices, loaded } = useNotices();
  const eventList = useSiteContent().events;

  return (
    <Layout>
      <div className="space-y-12 md:space-y-16">
        <section className="bg-gradient-subtle py-10 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">Stay Updated</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">Notices & Events</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Latest announcements from the school office and upcoming events.
            </p>
          </div>
        </section>

        <section className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 flex items-center gap-3">
            <Megaphone className="h-7 w-7 text-secondary" aria-hidden="true" />
            Notice board
          </h2>
          {!loaded ? (
            <p className="text-muted-foreground">Loading notices…</p>
          ) : notices.length === 0 ? (
            <p className="rounded-lg border border-dashed p-6 text-muted-foreground">
              No notices right now. New announcements from the school office will appear here.
            </p>
          ) : (
            <ul className="space-y-4">
              {notices.map((n) => (
                <li key={n.id} className={`rounded-lg border p-5 ${n.is_important ? "border-red-300 bg-red-50" : "border-primary/10 bg-card"}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    {n.is_important && <Badge className="bg-red-600 hover:bg-red-600">Important</Badge>}
                    <span className="text-sm text-muted-foreground">{formatDate(n.created_at)}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{n.title}</h3>
                  {n.body && <p className="text-muted-foreground mt-1 whitespace-pre-line">{n.body}</p>}
                  {n.link && (
                    <a href={n.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 font-semibold text-primary underline underline-offset-2">
                      Open attachment <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>

        {eventList.length > 0 && (
          <section className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 flex items-center gap-3">
              <Calendar className="h-7 w-7 text-secondary" aria-hidden="true" />
              Upcoming events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventList.map((e) => (
                <Card key={e.title} className="shadow-school-sm border-primary/10">
                  <CardHeader>
                    <div className="flex items-center justify-between gap-2">
                      <Badge variant="secondary">{e.category}</Badge>
                      <span className="text-sm font-medium text-muted-foreground">{e.date}</span>
                    </div>
                    <CardTitle className="text-xl text-primary pt-2">{e.title} <SampleTag show={e.isSample} /></CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{e.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default Events;
