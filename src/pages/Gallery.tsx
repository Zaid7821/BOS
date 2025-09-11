import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Video, Download, ExternalLink, Users, Calendar } from "lucide-react";

const Gallery = () => {
  const photoGalleries = [
    {
      title: "Science Fair 2024",
      date: "March 2024",
      category: "Academic Events",
      description: "Students showcasing innovative projects and experiments",
      imageCount: 45,
      featured: true
    },
    {
      title: "Cultural Festival",
      date: "February 2024", 
      category: "School Events",
      description: "Celebrating diversity through performances and cultural displays",
      imageCount: 38,
      featured: true
    },
    {
      title: "New STEM Laboratory",
      date: "February 2024",
      category: "Facilities",
      description: "State-of-the-art science and technology facilities",
      imageCount: 24,
      featured: false
    },
    {
      title: "Winter Sports Championships",
      date: "January 2024",
      category: "Sports",
      description: "Our teams competing in regional winter sports competitions",
      imageCount: 32,
      featured: false
    },
    {
      title: "Graduation Ceremony 2023",
      date: "May 2023",
      category: "Graduation",
      description: "Celebrating our graduating class achievements",
      imageCount: 56,
      featured: true
    },
    {
      title: "Art Exhibition",
      date: "December 2023",
      category: "Arts",
      description: "Student artwork and creative projects on display",
      imageCount: 28,
      featured: false
    }
  ];

  const videoGalleries = [
    {
      title: "School Tour 2024",
      duration: "8:45",
      category: "School Overview",
      description: "Take a virtual tour of our beautiful campus and facilities",
      views: "2.1K",
      featured: true
    },
    {
      title: "Principal's Welcome Message",
      duration: "3:22",
      category: "Administration",
      description: "Welcome message from our principal to new families",
      views: "1.8K",
      featured: false
    },
    {
      title: "Student Life Documentary",
      duration: "15:30",
      category: "Student Life",
      description: "A day in the life of Brilliant Oriental School students",
      views: "3.4K",
      featured: true
    },
    {
      title: "Drama Club Performance",
      duration: "12:15",
      category: "Arts",
      description: "Annual drama club performance highlights",
      views: "892",
      featured: false
    },
    {
      title: "Science Experiment Showcase",
      duration: "6:58",
      category: "Academic",
      description: "Students demonstrating exciting science experiments",
      views: "1.5K",
      featured: false
    },
    {
      title: "Music Concert 2024",
      duration: "18:42",
      category: "Arts",
      description: "Annual spring music concert featuring all grade levels",
      views: "2.7K",
      featured: true
    }
  ];

  const facilityImages = [
    {
      title: "Main Building",
      description: "Our historic main academic building",
      category: "Architecture"
    },
    {
      title: "Science Laboratories",
      description: "Modern chemistry, biology, and physics labs",
      category: "Academic Facilities"
    },
    {
      title: "Library & Media Center",
      description: "Extensive collection and digital resources",
      category: "Learning Spaces"
    },
    {
      title: "Sports Complex",
      description: "Indoor gymnasium and outdoor athletic fields",
      category: "Recreation"
    },
    {
      title: "Cafeteria",
      description: "Spacious dining area with healthy meal options",
      category: "Student Services"
    },
    {
      title: "Computer Labs",
      description: "Latest technology for digital learning",
      category: "Technology"
    },
    {
      title: "Art Studios",
      description: "Creative spaces for visual and performing arts",
      category: "Arts"
    },
    {
      title: "School Gardens",
      description: "Outdoor learning spaces and sustainability projects",
      category: "Environment"
    }
  ];

  const categoryColors = {
    "Academic Events": "bg-primary text-primary-foreground",
    "School Events": "bg-secondary text-secondary-foreground",
    "Facilities": "bg-accent text-accent-foreground",
    "Sports": "bg-muted text-muted-foreground",
    "Graduation": "bg-accent text-accent-foreground",
    "Arts": "bg-secondary text-secondary-foreground",
    "School Overview": "bg-primary text-primary-foreground",
    "Administration": "bg-muted text-muted-foreground",
    "Student Life": "bg-accent text-accent-foreground",
    "Academic": "bg-primary text-primary-foreground"
  };

  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">
              Visual Journey
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              School Gallery
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Explore our vibrant school community through photos and videos of 
              student activities, campus facilities, and memorable moments.
            </p>
          </div>
        </section>

        {/* Gallery Tabs */}
        <section className="container mx-auto px-4">
          <Tabs defaultValue="photos" className="w-full">
            <div className="text-center mb-8">
              <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3">
                <TabsTrigger value="photos">Photo Gallery</TabsTrigger>
                <TabsTrigger value="videos">Video Gallery</TabsTrigger>
                <TabsTrigger value="facilities">Campus Tour</TabsTrigger>
              </TabsList>
            </div>

            {/* Photo Gallery */}
            <TabsContent value="photos" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Photo Galleries</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Browse through our collection of photos capturing school life and events
                </p>
              </div>

              {/* Featured Galleries */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center">
                  <Camera className="w-6 h-6 mr-2 text-secondary" />
                  Featured Collections
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photoGalleries.filter(gallery => gallery.featured).map((gallery, index) => (
                    <Card key={index} className="shadow-school-lg border-primary/20 bg-gradient-subtle hover:shadow-school-glow transition-all duration-300">
                      <div className="aspect-video bg-gradient-primary rounded-t-lg flex items-center justify-center">
                        <Camera className="w-16 h-16 text-primary-foreground/60" />
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg text-primary">{gallery.title}</CardTitle>
                          <Badge className={categoryColors[gallery.category as keyof typeof categoryColors]}>
                            {gallery.category}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{gallery.date}</span>
                          </span>
                          <span>{gallery.imageCount} photos</span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{gallery.description}</p>
                        <Button variant="outline" className="w-full">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Gallery
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* All Galleries */}
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-6">All Photo Collections</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {photoGalleries.map((gallery, index) => (
                    <Card key={index} className="shadow-school-md border-primary/10 hover:shadow-school-lg transition-all duration-300">
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-20 h-20 bg-gradient-primary rounded-lg flex items-center justify-center">
                            <Camera className="w-8 h-8 text-primary-foreground" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-lg font-semibold text-primary">{gallery.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {gallery.imageCount} photos
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-2">{gallery.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">{gallery.date}</span>
                              <Button variant="ghost" size="sm">
                                View Gallery
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Video Gallery */}
            <TabsContent value="videos" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Video Gallery</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Watch videos showcasing our school culture, events, and student achievements
                </p>
              </div>

              {/* Featured Videos */}
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-primary mb-6 flex items-center">
                  <Video className="w-6 h-6 mr-2 text-secondary" />
                  Featured Videos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videoGalleries.filter(video => video.featured).map((video, index) => (
                    <Card key={index} className="shadow-school-lg border-primary/20 bg-gradient-subtle hover:shadow-school-glow transition-all duration-300">
                      <div className="aspect-video bg-gradient-primary rounded-t-lg flex items-center justify-center relative">
                        <Video className="w-16 h-16 text-primary-foreground/60" />
                        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                          {video.duration}
                        </div>
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg text-primary">{video.title}</CardTitle>
                          <Badge className={categoryColors[video.category as keyof typeof categoryColors]}>
                            {video.category}
                          </Badge>
                        </div>
                        <CardDescription className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{video.views} views</span>
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground mb-4">{video.description}</p>
                        <Button variant="outline" className="w-full">
                          <Video className="w-4 h-4 mr-2" />
                          Watch Video
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* All Videos */}
              <div>
                <h3 className="text-2xl font-semibold text-primary mb-6">All Videos</h3>
                <div className="space-y-4">
                  {videoGalleries.map((video, index) => (
                    <Card key={index} className="shadow-school-md border-primary/10 hover:shadow-school-lg transition-all duration-300">
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <div className="w-32 h-20 bg-gradient-primary rounded-lg flex items-center justify-center relative">
                            <Video className="w-8 h-8 text-primary-foreground" />
                            <div className="absolute bottom-1 right-1 bg-black/70 text-white px-1 py-0.5 rounded text-xs">
                              {video.duration}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-lg font-semibold text-primary">{video.title}</h4>
                              <Badge variant="outline" className="text-xs">
                                {video.views} views
                              </Badge>
                            </div>
                            <p className="text-muted-foreground text-sm mb-3">{video.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="secondary" className="text-xs">
                                {video.category}
                              </Badge>
                              <Button variant="ghost" size="sm">
                                <Video className="w-4 h-4 mr-1" />
                                Watch
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Campus Facilities */}
            <TabsContent value="facilities" className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-primary mb-4">Campus Facilities</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Take a visual tour of our state-of-the-art facilities and learning spaces
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {facilityImages.map((facility, index) => (
                  <Card key={index} className="shadow-school-md border-primary/10 hover:shadow-school-lg transition-all duration-300 group">
                    <div className="aspect-square bg-gradient-primary rounded-t-lg flex items-center justify-center group-hover:bg-gradient-secondary transition-all duration-300">
                      <Camera className="w-12 h-12 text-primary-foreground/60" />
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-primary">{facility.title}</CardTitle>
                      <Badge variant="outline" className="text-xs self-start">
                        {facility.category}
                      </Badge>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm">
                        {facility.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                  <Camera className="mr-2 h-5 w-5" />
                  Schedule Campus Tour
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Download Section */}
        <section className="bg-gradient-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Download High-Resolution Images</h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Need high-quality images for presentations or publications? Download our official 
              school photo package.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                <Download className="mr-2 h-5 w-5" />
                Download Photo Package
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Request Custom Photos
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Gallery;