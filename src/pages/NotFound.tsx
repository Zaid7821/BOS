import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { usePageTitle } from "@/hooks/usePageTitle";

const NotFound = () => {
  usePageTitle("Page not found");
  return (
    <Layout>
      <section className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">Page not found</h1>
        <p className="text-lg text-muted-foreground mb-8">This page doesn't exist. It may have been moved or the link may be wrong.</p>
        <Button variant="hero" asChild>
          <Link to="/">Go to the home page</Link>
        </Button>
      </section>
    </Layout>
  );
};

export default NotFound;
