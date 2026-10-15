import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, BookOpen, Users, ShieldCheck } from "lucide-react";
import StatsCounter from "@/components/StatsCounter";
import SampleTag from "@/components/SampleTag";
import { useSchool, useSiteContent } from "@/hooks/useSiteContent";
import { usePageTitle } from "@/hooks/usePageTitle";

const About = () => {
  const school = useSchool();
  usePageTitle("About Us");
  const staffList = useSiteContent().staff;

  return (
    <Layout>
      <div className="space-y-12 md:space-y-16">
        {/* Hero */}
        <section className="bg-gradient-subtle py-10 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">About Our School</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">Excellence in education since {school.founded}</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Our history, our values, and the people who teach our students.
            </p>
          </div>
        </section>

        {/* History + affiliation */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Our history</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed max-w-prose">
                {school.aboutHistory ? (
                  school.aboutHistory.map((para, i) => <p key={i} className="whitespace-pre-line">{para}</p>)
                ) : (
                <>
                <p>
                  Founded in {school.founded} in Pakka Talab, Fatehpur, Brilliant Oriental School began with a clear aim: to give
                  children of the region a strong education together with good character and values.
                </p>
                <p>
                  Over the years the school has grown steadily, and it is now <strong className="text-foreground">{school.name}</strong>,
                  affiliated to the Central Board of Secondary Education (CBSE), New Delhi, offering classes from Nursery to Class XII.
                </p>
                <p>
                  Our students are prepared for the CBSE Class X and Class XII board examinations, and for the colleges and careers
                  that follow.
                </p>
                </>
                )}
              </div>
            </div>

            <Card className="border-primary/20 shadow-school-md self-start">
              <CardHeader>
                <ShieldCheck className="h-10 w-10 text-accent mb-2" aria-hidden="true" />
                <CardTitle className="text-2xl text-primary">CBSE affiliation</CardTitle>
                <CardDescription>Central Board of Secondary Education, New Delhi</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-muted-foreground">Affiliation no.</span>
                  <span className="font-bold text-primary">{school.affiliationNo}</span>
                </div>
                <div className="flex justify-between gap-4 border-b pb-2">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-semibold text-right">Senior Secondary (up to Class XII)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Established</span>
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
                  <CardTitle className="text-xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/90">
                    To give every child a complete education that combines rigorous academics with good values, critical thinking,
                    and creativity.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader className="text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-secondary" aria-hidden="true" />
                  <CardTitle className="text-xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/90">
                    To be a leading school in the region that shapes students with strong character, academic excellence, and respect
                    for every culture.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-secondary" aria-hidden="true" />
                  <CardTitle className="text-xl">Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-primary-foreground/90 list-disc pl-5">
                    <li>Excellence in education</li>
                    <li>Faith, honesty and good manners</li>
                    <li>Discipline and respect for all</li>
                    <li>Curiosity and creativity</li>
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
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-4">Our leadership & faculty</h2>
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
