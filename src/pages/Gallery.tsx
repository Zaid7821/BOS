import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Youtube } from "lucide-react";
import { SCHOOL } from "@/data/site";
import { useGallery, useSiteContent } from "@/hooks/useSiteContent";
import { cld, cldSrcSet } from "@/lib/cloudinary";
import { usePageTitle } from "@/hooks/usePageTitle";

const label = (c: string) => c.charAt(0).toUpperCase() + c.slice(1);

const Gallery = () => {
  usePageTitle("Gallery");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const { photos: galleryImages, isLoading } = useGallery();
  const { videoIds: youtubeVideoIds } = useSiteContent();

  const categories = ["all", ...Array.from(new Set(galleryImages.map((img) => img.category)))];

  const filteredImages =
    selectedCategory === "all" ? galleryImages : galleryImages.filter((img) => img.category === selectedCategory);

  return (
    <Layout>
      <div className="space-y-12 md:space-y-16">
        <section className="bg-gradient-subtle py-10 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">School Gallery</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">Our campus, classrooms, and events.</p>
          </div>
        </section>

        <section className="container mx-auto px-4">
          {/* Filter chips: one swipeable row on phones, wrapped and centred on larger screens */}
          <div
            className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:mb-8 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
            role="group"
            aria-label="Filter photos"
          >
            {categories.map((c) => (
              <Button
                key={c}
                variant={selectedCategory === c ? "default" : "outline"}
                className="shrink-0 rounded-full"
                aria-pressed={selectedCategory === c}
                onClick={() => setSelectedCategory(c)}
              >
                {label(c)}
              </Button>
            ))}
          </div>

          {isLoading && <p className="text-center text-muted-foreground">Loading photos…</p>}
          {!isLoading && filteredImages.length === 0 && (
            <p className="text-center text-muted-foreground">New photos will appear here soon.</p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {filteredImages.map((img, index) => (
              <button
                key={img.src}
                type="button"
                className="group overflow-hidden rounded-lg shadow-school-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={() => {
                  setActiveIndex(index);
                  setLightboxOpen(true);
                }}
                aria-label={`Open photo: ${img.alt}`}
              >
                <img
                  src={cld(img.src, 600)}
                  srcSet={cldSrcSet(img.src, [300, 600])}
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                  alt={img.alt}
                  className="w-full aspect-square sm:aspect-auto sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6 text-center">Videos</h2>
          {youtubeVideoIds.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
              {youtubeVideoIds.map((id) => (
                <div key={id} className="aspect-video overflow-hidden rounded-lg shadow-school-sm">
                  <iframe
                    className="h-full w-full"
                    src={`https://www.youtube-nocookie.com/embed/${id}`}
                    title="School video"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ))}
            </div>
          )}
          <div className="text-center">
            <Button variant="outline" size="lg" className="h-auto whitespace-normal py-3" asChild>
              <a href={SCHOOL.social.youtube} target="_blank" rel="noopener noreferrer">
                <Youtube className="h-5 w-5 mr-2 text-red-600" aria-hidden="true" />
                Watch more on our YouTube channel
              </a>
            </Button>
          </div>
        </section>

        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={filteredImages.map((img) => ({ src: cld(img.src, 1600), alt: img.alt }))}
          index={activeIndex}
          plugins={[Zoom, Thumbnails]}
        />
      </div>
    </Layout>
  );
};

export default Gallery;
