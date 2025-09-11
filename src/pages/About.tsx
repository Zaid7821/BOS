import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Award, BookOpen } from "lucide-react";

const About = () => {
  const staffMembers = [
    {
      name: "Dr. Sarah Chen",
      position: "Principal",
      department: "Administration",
      experience: "15 years in educational leadership",
      education: "Ph.D. in Educational Administration"
    },
    {
      name: "Prof. Michael Rodriguez",
      position: "Vice Principal",
      department: "Academic Affairs",
      experience: "12 years in academic administration",
      education: "M.Ed. in Curriculum Development"
    },
    {
      name: "Ms. Emily Johnson",
      position: "Mathematics Department Head",
      department: "Mathematics",
      experience: "10 years teaching advanced mathematics",
      education: "M.S. in Mathematics Education"
    },
    {
      name: "Dr. Ahmad Hassan",
      position: "Science Department Head",
      department: "Science",
      experience: "14 years in science education",
      education: "Ph.D. in Chemistry"
    },
    {
      name: "Ms. Lisa Wang",
      position: "English Department Head",
      department: "Language Arts",
      experience: "8 years in language education",
      education: "M.A. in English Literature"
    },
    {
      name: "Mr. David Thompson",
      position: "Student Affairs Coordinator",
      department: "Student Services",
      experience: "6 years in student counseling",
      education: "M.A. in School Counseling"
    }
  ];

  const milestones = [
    {
      year: "1995",
      event: "School Founded",
      description: "Brilliant Oriental School was established with a vision to provide world-class education."
    },
    {
      year: "2000",
      event: "First Graduating Class",
      description: "Our first cohort of students graduated with 100% college acceptance rate."
    },
    {
      year: "2005",
      event: "International Accreditation",
      description: "Received accreditation from the International Schools Association."
    },
    {
      year: "2010",
      event: "Campus Expansion",
      description: "Expanded facilities to include state-of-the-art science labs and library."
    },
    {
      year: "2015",
      event: "Technology Integration",
      description: "Implemented comprehensive digital learning platforms across all grades."
    },
    {
      year: "2020",
      event: "Excellence Award",
      description: "Recognized as 'School of Excellence' by the Department of Education."
    }
  ];

  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">
              About Our School
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Excellence in Education Since 1995
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Learn about our rich history, dedicated staff, and commitment to providing 
              exceptional education in a nurturing, multicultural environment.
            </p>
          </div>
        </section>

        {/* School History */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Our History</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground">
                <p className="mb-4">
                  Founded in 1995, Brilliant Oriental School began as a small institution with 
                  a big dream: to create an educational environment where students from diverse 
                  backgrounds could thrive academically while developing strong character and 
                  cultural awareness.
                </p>
                <p className="mb-4">
                  Over nearly three decades, we have grown from a modest school with 50 students 
                  to a thriving educational community serving over 1,200 students from kindergarten 
                  through grade 12. Our commitment to excellence has remained unwavering throughout 
                  this journey.
                </p>
                <p>
                  Today, we stand proud as one of the region's most respected educational institutions, 
                  known for our innovative teaching methods, diverse student body, and remarkable 
                  academic achievements.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <Card key={index} className="shadow-school-sm border-primary/10">
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold">
                        {milestone.year.slice(-2)}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-primary">{milestone.event}</CardTitle>
                        <CardDescription className="text-sm text-muted-foreground">
                          {milestone.year}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{milestone.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="bg-gradient-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 text-secondary" />
                  <CardTitle className="text-xl">Our Mission</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/90">
                    To provide comprehensive, multicultural education that combines rigorous 
                    academics with character development, fostering critical thinking, creativity, 
                    and respect for diversity.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader className="text-center">
                  <Award className="h-12 w-12 mx-auto mb-4 text-secondary" />
                  <CardTitle className="text-xl">Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/90">
                    To be a leading educational institution that cultivates global citizens 
                    with strong character, academic excellence, and cultural awareness, 
                    preparing them to thrive in an interconnected world.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader className="text-center">
                  <Users className="h-12 w-12 mx-auto mb-4 text-secondary" />
                  <CardTitle className="text-xl">Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-primary-foreground/90">
                    <li>• Excellence in Education</li>
                    <li>• Respect for Diversity</li>
                    <li>• Character Development</li>
                    <li>• Global Citizenship</li>
                    <li>• Innovation & Creativity</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Staff Profiles */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Meet Our Faculty</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our dedicated team of educators brings passion, expertise, and years of experience 
              to create an exceptional learning environment.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {staffMembers.map((staff, index) => (
              <Card key={index} className="shadow-school-md hover:shadow-school-lg transition-all duration-300 border-primary/10">
                <CardHeader className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                    {staff.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <CardTitle className="text-lg text-primary">{staff.name}</CardTitle>
                  <CardDescription className="text-secondary font-medium">
                    {staff.position}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {staff.department}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <strong>Experience:</strong> {staff.experience}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Education:</strong> {staff.education}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Statistics */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">1,200+</div>
                <div className="text-muted-foreground">Students Enrolled</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">85+</div>
                <div className="text-muted-foreground">Faculty Members</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">100%</div>
                <div className="text-muted-foreground">College Acceptance</div>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-primary">29</div>
                <div className="text-muted-foreground">Years of Excellence</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;