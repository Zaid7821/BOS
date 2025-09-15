import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Calendar, DollarSign, FileText, Users, Clock, Download } from "lucide-react";

const Admissions = () => {
  const applicationSteps = [
    {
      step: 1,
      title: "Submit Online Application",
      description: "Complete our comprehensive online application form with student and family information.",
      deadline: "Rolling admissions"
    },
    {
      step: 2,
      title: "Academic Records",
      description: "Submit official transcripts and standardized test scores from previous schools.",
      deadline: "2 weeks after application"
    },
    {
      step: 3,
      title: "Entrance Examination",
      description: "Take our placement exam to assess academic readiness and placement.",
      deadline: "Scheduled after application review"
    },
    {
      step: 4,
      title: "Interview Process",
      description: "Meet with our admissions team and participate in a student interview.",
      deadline: "2-3 weeks after exam"
    },
    {
      step: 5,
      title: "Decision Notification",
      description: "Receive admission decision and enrollment information.",
      deadline: "Within 1 week of interview"
    }
  ];

  const eligibilityRequirements = {
    primary: [
      "Age appropriate for grade level (K-5)",
      "Basic school readiness assessment",
      "Health and immunization records",
      "Previous school records (if applicable)"
    ],
    middle: [
      "Completed elementary education",
      "Minimum GPA of 2.5 from previous school",
      "English proficiency assessment",
      "Character reference letter"
    ],
    high: [
      "Completed middle school education",
      "Minimum GPA of 3.0 from previous school",
      "Standardized test scores (if available)",
      "Personal essay and recommendations"
    ]
  };

  const importantDates = [
    {
      date: "January 15",
      event: "Application Portal Opens",
      description: "Online applications begin for the next academic year"
    },
    {
      date: "March 1",
      event: "Priority Deadline",
      description: "Priority consideration for new student applications"
    },
    {
      date: "April 15",
      event: "Admission Decisions",
      description: "Initial admission decisions sent to families"
    },
    {
      date: "May 1",
      event: "Enrollment Deadline",
      description: "Deadline for enrollment deposit and confirmation"
    },
    {
      date: "June 15",
      event: "Final Application Deadline",
      description: "Last day to submit applications for fall semester"
    },
    {
      date: "August 1",
      event: "New Student Orientation",
      description: "Welcome orientation for all new students and families"
    }
  ];

  const tuitionFees = [
    {
      grade: "Kindergarten - Grade 2",
      tuition: "$15,000",
      fees: "$1,500",
      total: "$16,500"
    },
    {
      grade: "Grade 3 - Grade 5", 
      tuition: "$17,000",
      fees: "$1,800",
      total: "$18,800"
    },
    {
      grade: "Grade 6 - Grade 8",
      tuition: "$19,000", 
      fees: "$2,000",
      total: "$21,000"
    },
    {
      grade: "Grade 9 - Grade 12",
      tuition: "$22,000",
      fees: "$2,500",
      total: "$24,500"
    }
  ];

  const scholarships = [
    {
      name: "Academic Excellence Scholarship",
      amount: "Up to 50% tuition",
      criteria: "Outstanding academic performance and standardized test scores"
    },
    {
      name: "Merit-Based Scholarship",
      amount: "Up to 30% tuition", 
      criteria: "Strong academic record and leadership potential"
    },
    {
      name: "Need-Based Financial Aid",
      amount: "Varies",
      criteria: "Demonstrated financial need through FAFSA application"
    },
    {
      name: "Sibling Discount",
      amount: "15% for 2nd child, 25% for 3rd+",
      criteria: "Multiple children enrolled simultaneously"
    }
  ];

  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">
              Join Our Community
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Admissions Information
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Begin your journey with Brilliant Oriental School. Learn about our admission 
              process, requirements, and how to become part of our educational community.
            </p>
          </div>
        </section>

        {/* Application Process */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Application Process</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Follow our streamlined five-step process to join our school community
            </p>
          </div>
          
          <div className="space-y-6">
            {applicationSteps.map((step, index) => (
              <Card key={index} className="shadow-school-md border-primary/10 relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-primary"></div>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary">{step.title}</CardTitle>
                      <CardDescription className="text-muted-foreground">
                        {step.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {step.deadline}
                    </Badge>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

         
        </section>

        {/* Eligibility Requirements */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Eligibility Requirements</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Review the specific requirements for each grade level
              </p>
            </div>

            <Tabs defaultValue="primary" className="w-full">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
                <TabsTrigger value="primary">Primary</TabsTrigger>
                <TabsTrigger value="middle">Middle</TabsTrigger>
                <TabsTrigger value="high">High School</TabsTrigger>
              </TabsList>

              <div className="mt-8">
                <TabsContent value="primary">
                  <Card className="shadow-school-md border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Primary School (K-5)</CardTitle>
                      <CardDescription>Requirements for kindergarten through grade 5</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {eligibilityRequirements.primary.map((req, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-accent" />
                            <span className="text-muted-foreground">{req}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="middle">
                  <Card className="shadow-school-md border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">Middle School (6-8)</CardTitle>
                      <CardDescription>Requirements for grades 6 through 8</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {eligibilityRequirements.middle.map((req, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-accent" />
                            <span className="text-muted-foreground">{req}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="high">
                  <Card className="shadow-school-md border-primary/10">
                    <CardHeader>
                      <CardTitle className="text-2xl text-primary">High School (9-12)</CardTitle>
                      <CardDescription>Requirements for grades 9 through 12</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {eligibilityRequirements.high.map((req, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-accent" />
                            <span className="text-muted-foreground">{req}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </section>

        {/* Important Dates */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Important Dates</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mark your calendar with these key admission and enrollment dates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {importantDates.map((item, index) => (
              <Card key={index} className="shadow-school-md border-primary/10 hover:shadow-school-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-8 h-8 text-secondary" />
                    <div>
                      <CardTitle className="text-lg text-primary">{item.event}</CardTitle>
                      <CardDescription className="text-secondary font-medium">
                        {item.date}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tuition & Financial Aid */}
        <section className="bg-gradient-primary py-16 text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Tuition & Financial Aid</h2>
              <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Affordable education with comprehensive financial assistance programs
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tuition Table */}
              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <DollarSign className="w-6 h-6 mr-3 text-secondary" />
                    Annual Tuition & Fees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {tuitionFees.map((fee, index) => (
                      <div key={index} className="flex justify-between items-center py-3 border-b border-white/20">
                        <div>
                          <div className="font-medium">{fee.grade}</div>
                          <div className="text-sm text-primary-foreground/70">
                            Tuition: {fee.tuition} | Fees: {fee.fees}
                          </div>
                        </div>
                        <div className="text-lg font-bold text-secondary">{fee.total}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Scholarships */}
              <Card className="bg-white/10 border-white/20 text-primary-foreground">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center">
                    <Users className="w-6 h-6 mr-3 text-secondary" />
                    Financial Aid Programs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {scholarships.map((scholarship, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="font-medium">{scholarship.name}</div>
                          <Badge variant="secondary" className="text-primary">
                            {scholarship.amount}
                          </Badge>
                        </div>
                        <p className="text-sm text-primary-foreground/70">{scholarship.criteria}</p>
                        {index < scholarships.length - 1 && <div className="border-b border-white/20 pt-2"></div>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                <Download className="mr-2 h-5 w-5" />
                Download Financial Aid Application
              </Button>
            </div>
          </div>
        </section>

        {/* Contact Admissions */}
        <section className="container mx-auto px-4 text-center">
          <Card className="shadow-school-lg border-primary/10 bg-gradient-subtle">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-3xl font-bold text-primary mb-6">
                Questions About Admissions?
              </h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our admissions team is here to help you through every step of the process. 
                Contact us for personalized guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" className="text-lg px-8 py-4">
                  Schedule Campus Tour
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Contact Admissions
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </Layout>
  );
};

export default Admissions;