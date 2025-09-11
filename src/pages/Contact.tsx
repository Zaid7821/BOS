import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Calendar } from "lucide-react";

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Address",
      details: [
        "123 Education Street",
        "Learning City, LC 12345",
        "United States"
      ]
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: [
        "Main Office: +1 (555) 123-4567",
        "Admissions: +1 (555) 123-4568",
        "Fax: +1 (555) 123-4569"
      ]
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: [
        "info@brilliantorientalschool.edu",
        "admissions@brilliantorientalschool.edu",
        "principal@brilliantorientalschool.edu"
      ]
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 8:00 AM - 5:00 PM",
        "Saturday: 9:00 AM - 2:00 PM",
        "Sunday: Closed"
      ]
    }
  ];

  const departments = [
    {
      name: "Main Office",
      contact: "Dr. Sarah Chen",
      phone: "+1 (555) 123-4567",
      email: "office@brilliantorientalschool.edu",
      hours: "8:00 AM - 5:00 PM"
    },
    {
      name: "Admissions Office",
      contact: "Ms. Emily Rodriguez",
      phone: "+1 (555) 123-4568",
      email: "admissions@brilliantorientalschool.edu",
      hours: "8:30 AM - 4:30 PM"
    },
    {
      name: "Academic Affairs",
      contact: "Prof. Michael Johnson",
      phone: "+1 (555) 123-4570",
      email: "academics@brilliantorientalschool.edu",
      hours: "9:00 AM - 4:00 PM"
    },
    {
      name: "Student Services",
      contact: "Mr. David Thompson",
      phone: "+1 (555) 123-4571",
      email: "students@brilliantorientalschool.edu",
      hours: "8:00 AM - 5:00 PM"
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted");
  };

  return (
    <Layout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">
              Get In Touch
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're here to help! Reach out to us for admissions information, 
              campus tours, or any questions about our educational programs.
            </p>
          </div>
        </section>

        {/* Contact Information Cards */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center shadow-school-md border-primary/10 hover:shadow-school-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary-lighter">
                    <info.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-primary">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-muted-foreground text-sm">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contact Form and Map */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Send Us a Message</h2>
              <Card className="shadow-school-lg border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center">
                    <MessageCircle className="w-6 h-6 mr-3 text-secondary" />
                    Contact Form
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" placeholder="Enter your first name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" placeholder="Enter your last name" required />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input id="email" type="email" placeholder="Enter your email" required />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input id="phone" type="tel" placeholder="Enter your phone number" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admissions">Admissions Inquiry</SelectItem>
                          <SelectItem value="tour">Campus Tour Request</SelectItem>
                          <SelectItem value="academics">Academic Information</SelectItem>
                          <SelectItem value="enrollment">Current Student Enrollment</SelectItem>
                          <SelectItem value="general">General Question</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Please describe your inquiry or question in detail..."
                        rows={5}
                        required
                      />
                    </div>
                    
                    <Button type="submit" variant="hero" className="w-full text-lg py-3">
                      <Send className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* School Map */}
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">Find Us</h2>
              <Card className="shadow-school-lg border-primary/10 mb-6">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-primary rounded-lg flex items-center justify-center">
                    <div className="text-center text-primary-foreground">
                      <MapPin className="w-16 h-16 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">Interactive Map</h3>
                      <p className="text-primary-foreground/80">
                        123 Education Street, Learning City
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <div className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <MapPin className="w-5 h-5 mr-3" />
                  Get Directions
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-5 h-5 mr-3" />
                  Schedule Campus Tour
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-5 h-5 mr-3" />
                  Call Main Office
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Department Contacts */}
        <section className="bg-gradient-subtle py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Department Contacts</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect directly with the right department for your specific needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {departments.map((dept, index) => (
                <Card key={index} className="shadow-school-md border-primary/10 hover:shadow-school-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl text-primary">{dept.name}</CardTitle>
                    <CardDescription className="text-secondary font-medium">
                      {dept.contact}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <Phone className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{dept.phone}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{dept.email}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{dept.hours}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Emergency Contact */}
        <section className="container mx-auto px-4">
          <Card className="bg-gradient-primary text-primary-foreground shadow-school-lg">
            <CardContent className="pt-12 pb-12 text-center">
              <h2 className="text-3xl font-bold mb-6">Emergency Contact</h2>
              <p className="text-xl mb-6 text-primary-foreground/90 max-w-2xl mx-auto">
                For urgent matters outside of office hours, please contact our emergency line
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6 text-secondary" />
                  <span className="text-xl font-semibold">Emergency: +1 (555) 123-9999</span>
                </div>
                <div className="text-primary-foreground/80">
                  Available 24/7 for urgent school matters
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions before reaching out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center shadow-school-md border-primary/10">
              <CardHeader>
                <CardTitle className="text-primary">Admissions Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Learn about application deadlines, requirements, and enrollment procedures
                </p>
                <Button variant="outline" size="sm">
                  View Admissions Info
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center shadow-school-md border-primary/10">
              <CardHeader>
                <CardTitle className="text-primary">Tuition & Fees</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Information about tuition costs, payment plans, and financial aid options
                </p>
                <Button variant="outline" size="sm">
                  View Pricing
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center shadow-school-md border-primary/10">
              <CardHeader>
                <CardTitle className="text-primary">Academic Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Details about our curriculum, extracurricular activities, and special programs
                </p>
                <Button variant="outline" size="sm">
                  View Programs
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;