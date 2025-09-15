import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Award, GraduationCap, Star } from "lucide-react";

const Home = () => {
  const highlights = [
    {
      icon: Award,
      title: "Award-Winning Education",
      description: "Recognized for excellence in academic achievement and student development."
    },
    {
      icon: Users,
      title: "Expert Faculty",
      description: "Dedicated teachers with advanced degrees and years of experience."
    },
    {
      icon: GraduationCap, // Islamic focus
      title: "Islamic Values & Character",
      description: "Balanced education that nurtures faith, good manners, and spirituality along with academics."
    }
  ];

  const achievements = [
    "Top 3 Schools in the Region",
    "State Mathematics Champions",
    "Science Fair Winners"
  ];

  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-hero text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="animate-fade-in">
              <Badge variant="secondary" className="mb-6 text-sm px-4 py-2">
                Excellence in Education Since 2006
              </Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                Welcome to
                <span className="block text-secondary animate-glow">
                  Brilliant Oriental School
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-primary-foreground/90 max-w-3xl mx-auto">
                Nurturing brilliant minds, fostering creativity, and building tomorrow's leaders 
                in a diverse and inclusive learning environment.
              </p>
              
            </div>
          </div>
        </section>

        {/* Vision & Mission */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-in-left">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Our Vision & Mission
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-secondary mb-3">Vision</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    To be a leading educational institution that cultivates global citizens 
                    with strong character, academic excellence, and cultural awareness, 
                    preparing them to thrive in an interconnected world.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-secondary mb-3">Mission</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We provide a comprehensive, multicultural education that combines 
                    rigorous academics with character development, fostering critical 
                    thinking, creativity, and respect for diversity in our students.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className="text-center animate-scale-in shadow-school-md border-primary/10"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="pt-6">
                    <Star className="h-8 w-8 text-secondary mx-auto mb-3" />
                    <p className="text-sm font-medium text-primary">{achievement}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* School Highlights */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                Why Choose Brilliant Oriental School?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover what makes our school a premier destination for quality education
              </p>
            </div>
            {/* FIX: balanced grid (3 columns instead of 4) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {highlights.map((highlight, index) => (
                <Card
                  key={index}
                  className="text-center animate-fade-in shadow-school-md hover:shadow-school-lg transition-all duration-300 hover:scale-105 border-primary/10"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <CardHeader>
                    <div className="mx-auto mb-4 p-3 rounded-full bg-primary-lighter">
                      <highlight.icon className="h-8 w-8 text-primary" />
                    </div>
                    <CardTitle className="text-xl text-primary">{highlight.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground">
                      {highlight.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

       
      </div>
    </Layout>
  );
};

export default Home;
