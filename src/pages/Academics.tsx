import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Users, Award, Clock, Download, ExternalLink } from "lucide-react";

const Academics = () => {
  const programs = [
    {
      level: "Primary School",
      grades: "Kindergarten - Grade 5",
      description: "Foundation years focusing on core subjects and character development",
      subjects: ["English Language Arts", "Mathematics", "Science", "Social Studies", "Arts", "Physical Education"],
      highlights: ["Small class sizes", "Individualized attention", "Play-based learning", "Character education"]
    },
    {
      level: "Middle School", 
      grades: "Grade 6 - Grade 8",
      description: "Transitional years preparing students for advanced academic challenges",
      subjects: ["Advanced Mathematics", "Biology, Chemistry, Physics", "Literature & Writing", "World History", "Foreign Languages", "Technology"],
      highlights: ["STEM focus", "Project-based learning", "Leadership opportunities", "Peer mentoring"]
    },
    {
      level: "High School",
      grades: "Grade 9 - Grade 12", 
      description: "College preparatory program with advanced placement options",
      subjects: ["Calculus & Statistics", "Advanced Sciences", "AP Courses", "World Literature", "Global Studies", "Specialized Electives"],
      highlights: ["AP programs", "College counseling", "Internship opportunities", "University partnerships"]
    }
  ];

  const apCourses = [
    "AP Calculus AB/BC", "AP Biology", "AP Chemistry", "AP Physics", 
    "AP English Literature", "AP English Language", "AP World History", 
    "AP US History", "AP Computer Science", "AP Art & Design"
  ];

  const examInfo = [
    {
      exam: "SAT",
      description: "Standardized test for college admissions",
      avgScore: "1,350",
      prepAvailable: true
    },
    {
      exam: "ACT", 
      description: "Alternative standardized test for college admissions",
      avgScore: "30",
      prepAvailable: true
    },
    {
      exam: "AP Exams",
      description: "Advanced Placement examinations",
      avgScore: "4.2/5",
      prepAvailable: true
    },
    {
      exam: "TOEFL",
      description: "Test of English as a Foreign Language",
      avgScore: "105",
      prepAvailable: true
    }
  ];

  const curriculum = [
    {
      subject: "STEM Education",
      description: "Comprehensive Science, Technology, Engineering, and Mathematics program",
      features: ["Modern laboratories", "Robotics club", "Science fairs", "Tech competitions"]
    },
    {
      subject: "Liberal Arts",
      description: "Well-rounded humanities education fostering critical thinking",
      features: ["Literature analysis", "Creative writing", "Public speaking", "Cultural studies"]
    },
    {
      subject: "Languages",
      description: "Multilingual education preparing global citizens",
      features: ["Mandarin Chinese", "Spanish", "French", "ESL support"]
    },
    {
      subject: "Arts & Culture",
      description: "Creative expression through various artistic mediums",
      features: ["Visual arts", "Music program", "Drama club", "Cultural festivals"]
    }
  ];

  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">
              Academic Excellence
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Comprehensive Academic Programs
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From kindergarten through grade 12, our rigorous curriculum prepares students 
              for success in higher education and beyond.
            </p>
          </div>
        </section>

        {/* Academic Programs */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Academic Programs</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our structured programs ensure progressive learning and development at every stage
            </p>
          </div>
          
          <div className="space-y-8">
            {programs.map((program, index) => (
              <Card key={index} className="shadow-school-md border-primary/10">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <CardTitle className="text-2xl text-primary">{program.level}</CardTitle>
                      <CardDescription className="text-lg text-secondary font-medium">
                        {program.grades}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="self-start md:self-center">
                      <Users className="w-4 h-4 mr-1" />
                      15:1 Student-Teacher Ratio
                    </Badge>
                  </div>
                  <p className="text-muted-foreground">{program.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-3">Core Subjects</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {program.subjects.map((subject, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-3">Program Highlights</h4>
                      <ul className="space-y-1">
                        {program.highlights.map((highlight, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-center">
                            <Award className="w-4 h-4 mr-2 text-accent" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Curriculum Details */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Curriculum Excellence</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Our comprehensive curriculum balances academic rigor with creative expression
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {curriculum.map((area, index) => (
                <Card key={index} className="shadow-school-md border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary flex items-center">
                      <BookOpen className="w-6 h-6 mr-3 text-secondary" />
                      {area.subject}
                    </CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-2">
                      {area.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Advanced Placement & Exams */}
        <section className="container mx-auto px-4">
          <Tabs defaultValue="ap" className="w-full">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">Advanced Programs & Assessments</h2>
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                <TabsTrigger value="ap">AP Programs</TabsTrigger>
                <TabsTrigger value="exams">Standardized Tests</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="ap" className="space-y-6">
              <Card className="shadow-school-md border-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">Advanced Placement Courses</CardTitle>
                  <CardDescription>
                    College-level courses available to qualified high school students
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {apCourses.map((course, index) => (
                      <Badge key={index} variant="secondary" className="p-3 text-center">
                        {course}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button variant="academic" className="flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Download AP Course Catalog
                    </Button>
                    <Button variant="outline" className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View AP Prep Schedule
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="exams" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {examInfo.map((exam, index) => (
                  <Card key={index} className="shadow-school-md border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-xl text-primary">{exam.exam}</CardTitle>
                      <CardDescription>{exam.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">School Average:</span>
                          <Badge variant="secondary">{exam.avgScore}</Badge>
                        </div>
                        {exam.prepAvailable && (
                          <div className="flex items-center text-accent">
                            <Award className="w-4 h-4 mr-2" />
                            <span className="text-sm">Prep courses available</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Academic Calendar */}
        <section className="bg-gradient-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Academic Calendar</h2>
            <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto">
              Stay informed about important academic dates, exam schedules, and school events
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader>
                  <Clock className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <CardTitle>Fall Semester</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/90">August 28 - December 20</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader>
                  <Clock className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <CardTitle>Spring Semester</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/90">January 15 - May 30</p>
                </CardContent>
              </Card>
              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader>
                  <Clock className="w-8 h-8 mx-auto mb-2 text-secondary" />
                  <CardTitle>Summer Programs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/90">June 10 - July 25</p>
                </CardContent>
              </Card>
            </div>
            <div className="mt-8">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                <Download className="mr-2 h-5 w-5" />
                Download Full Calendar
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Academics;