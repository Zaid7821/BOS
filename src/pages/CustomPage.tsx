import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import PageBlocks from "@/components/PageBlocks";
import NotFound from "@/pages/NotFound";
import { pageTitle, useCustomPage } from "@/hooks/useCustomPages";
import { useLanguage } from "@/lib/i18n";
import { usePageTitle } from "@/hooks/usePageTitle";

/** A page staff made in Admin > Pages, at /p/<slug>. */
const CustomPage = () => {
  const { slug = "" } = useParams();
  const { lang } = useLanguage();
  const { data: page, isPending } = useCustomPage(slug);
  const title = page ? pageTitle(page, lang) : undefined;
  // NotFound sets its own title, but this (parent) effect runs after it, so repeat it here.
  usePageTitle(!isPending && !page ? "Page not found" : title);

  if (!isPending && !page) return <NotFound />;

  return (
    <Layout>
      <section className="bg-gradient-subtle py-10 md:py-16">
        <div className="container mx-auto px-4 text-center">
          {page ? (
            <h1 className="text-3xl md:text-5xl font-bold text-primary">{title}</h1>
          ) : (
            <div aria-hidden className="mx-auto h-10 md:h-14 w-2/3 max-w-md animate-pulse rounded bg-muted" />
          )}
        </div>
      </section>
      <div className="container mx-auto max-w-4xl px-4 py-8 md:py-12">
        {page ? (
          <PageBlocks blocks={page.blocks} />
        ) : (
          <div aria-hidden className="space-y-3">
            {[0, 1, 2].map((i) => <div key={i} className="h-5 animate-pulse rounded bg-muted" />)}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CustomPage;
