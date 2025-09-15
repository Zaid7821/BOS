import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/plugins/thumbnails.css";

// Sample gallery images
const galleryImages = [
  {
    src: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757605559/BOS17_rjngmh.jpg",
    alt: "School building",
    category: "campus"
  },
  {
    src: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757604935/BOS9_dosdt0.jpg",
    alt: "Classroom session",
    category: "academics"
  },
  {
    src: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757604936/BOS10_fqknaj.jpg", 
    alt: "Sports day",
    category: "events"
  },
  {
    src: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757604935/BOS5_plhby7.jpg",
    alt: "Science lab",
    category: "facilities"
  },
  {
    src: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757604937/BOS16_i4dhvh.jpg",
    alt: "Annual function",
    category: "events"
  },
  {
    src: "https://res.cloudinary.com/djfhmzjuz/image/upload/v1757606202/BOS18_eprioe_flgobs.jpg",
    alt: "Library",
    category: "facilities"
  }
];

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter images based on selected category
  const filteredImages = selectedCategory === "all"
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  // Lightbox handlers
  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  };

  return (
    <Layout>
      <div className="space-y-16">
        {/* Gallery Header */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              School Gallery
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our state-of-the-art facilities, vibrant campus life, and memorable events
            </p>
          </div>
        </section>

        {/* Gallery Content */}
        <section className="container mx-auto px-4">
          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            <Button
              variant={selectedCategory === "campus" ? "default" : "outline"}
              onClick={() => setSelectedCategory("campus")}
            >
              Campus
            </Button>
            <Button
              variant={selectedCategory === "academics" ? "default" : "outline"}
              onClick={() => setSelectedCategory("academics")}
            >
              Academics
            </Button>
            <Button
              variant={selectedCategory === "events" ? "default" : "outline"}
              onClick={() => setSelectedCategory("events")}
            >
              Events
            </Button>
            <Button
              variant={selectedCategory === "facilities" ? "default" : "outline"}
              onClick={() => setSelectedCategory("facilities")}
            >
              Facilities
            </Button>
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((img, index) => (
              <Card 
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => openLightbox(filteredImages.indexOf(img))}
              >
                <CardContent className="p-0">
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-48 object-cover rounded-lg"
                    loading="lazy"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Lightbox */}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={filteredImages}
          index={activeIndex}
          plugins={[Zoom, Thumbnails]}
        />
      </div>
    </Layout>
  );
};

export default Gallery;