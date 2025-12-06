// import Layout from "@/components/Layout";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Calendar } from "lucide-react";
// import { useState } from "react";

// const Contact = () => {
//   const contactInfo = [
//     {
//       icon: MapPin,
//       title: "Our Address",
//       details: [
//         "Pakka Talab",
//         "Fatehpur, UP 212601",
//         "India"
//       ]
//     },
//     {
//       icon: Phone,
//       title: "Phone Numbers",
//       details: [
//         "Main Office: 9565313000",
//         "Admissions: 9565313000",

//       ]
//     },
//     {
//       icon: Mail,
//       title: "Email Addresses",
//       details: [
//         "info@bosfatehpur.in",

//       ]
//     },
//     {
//       icon: Clock,
//       title: "Office Hours",
//       details: [
//         "Monday - Friday: 8:00 AM - 5:00 PM",
//         "Saturday: 9:00 AM - 2:00 PM",
//         "Sunday: Closed"
//       ]
//     }
//   ];

//   const [formState, setFormState] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phone: '',
//     subject: '',
//     message: ''
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState<{
//     success?: boolean;
//     message?: string;
//   }>({});

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     setSubmitStatus({});

//     try {
//       const response = await fetch('/api/contact', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name: `${formState.firstName} ${formState.lastName}`,
//           email: formState.email,
//           subject: formState.subject,
//           message: formState.message
//         }),
//       });

//       const result = await response.json();
//       if (result.success) {
//         setFormState({
//           firstName: '',
//           lastName: '',
//           email: '',
//           phone: '',
//           subject: '',
//           message: ''
//         });
//       }
//       setSubmitStatus(result);
//     } catch (error) {
//       setSubmitStatus({
//         success: false,
//         message: 'Failed to submit form. Please try again.'
//       });
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { id, value } = e.target;
//     setFormState(prev => ({
//       ...prev,
//       [id]: value
//     }));
//   };

//   const handleSelectChange = (value: string) => {
//     setFormState(prev => ({
//       ...prev,
//       subject: value
//     }));
//   };

//   return (
//     <Layout>
//       <div className="space-y-16">
//         {/* Hero Section */}
//         <section className="bg-gradient-subtle py-16">
//           <div className="container mx-auto px-4 text-center">
//             <Badge variant="secondary" className="mb-6">
//               Get In Touch
//             </Badge>
//             <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">
//               Contact Us
//             </h1>
//             <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
//               We're here to help! Reach out to us for admissions information, 
//               campus tours, or any questions about our educational programs.
//             </p>
//           </div>
//         </section>

//         {/* Contact Information Cards */}
//         <section className="container mx-auto px-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
//             {contactInfo.map((info, index) => (
//               <Card key={index} className="text-center shadow-school-md border-primary/10 hover:shadow-school-lg transition-all duration-300">
//                 <CardHeader>
//                   <div className="mx-auto mb-4 p-3 rounded-full bg-primary-lighter">
//                     <info.icon className="h-8 w-8 text-primary" />
//                   </div>
//                   <CardTitle className="text-xl text-primary">{info.title}</CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-2">
//                     {info.details.map((detail, idx) => (
//                       <p key={idx} className="text-muted-foreground text-sm">
//                         {detail}
//                       </p>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </section>

//         {/* Contact Form */}
//         <section className="container mx-auto px-4">
//           <div className="max-w-2xl mx-auto">
//             <div>
//               <h2 className="text-3xl font-bold text-primary mb-6">Send Us a Message</h2>
//               <Card className="shadow-school-lg border-primary/10">
//                 <CardHeader>
//                   <CardTitle className="text-xl text-primary flex items-center">
//                     <MessageCircle className="w-6 h-6 mr-3 text-secondary" />
//                     Contact Form
//                   </CardTitle>
//                   <CardDescription>
//                     Fill out the form below and we'll get back to you within 24 hours
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor="firstName">First Name</Label>
//                         <Input
//                           id="firstName"
//                           placeholder="Enter your first name"
//                           value={formState.firstName}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>
//                       <div className="space-y-2">
//                         <Label htmlFor="lastName">Last Name</Label>
//                         <Input
//                           id="lastName"
//                           placeholder="Enter your last name"
//                           value={formState.lastName}
//                           onChange={handleChange}
//                           required
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="email">Email Address</Label>
//                       <Input
//                         id="email"
//                         type="email"
//                         placeholder="Enter your email"
//                         value={formState.email}
//                         onChange={handleChange}
//                         required
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="phone">Phone Number</Label>
//                       <Input
//                         id="phone"
//                         type="tel"
//                         placeholder="Enter your phone number"
//                         value={formState.phone}
//                         onChange={handleChange}
//                       />
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="subject">Subject</Label>
//                       <Select value={formState.subject} onValueChange={handleSelectChange}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select a subject" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="admissions">Admissions Inquiry</SelectItem>
//                           <SelectItem value="tour">Campus Tour Request</SelectItem>
//                           <SelectItem value="academics">Academic Information</SelectItem>
//                           <SelectItem value="enrollment">Current Student Enrollment</SelectItem>
//                           <SelectItem value="general">General Question</SelectItem>
//                           <SelectItem value="other">Other</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor="message">Message</Label>
//                       <Textarea
//                         id="message"
//                         placeholder="Please describe your inquiry or question in detail..."
//                         value={formState.message}
//                         onChange={handleChange}
//                         rows={5}
//                         required
//                       />
//                     </div>

//                     <Button type="submit" variant="hero" className="w-full text-lg py-3">
//                       <Send className="w-5 h-5 mr-2" />
//                       Send Message
//                     </Button>
//                   </form>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </section>



//         {/* FAQ */}
//         <section className="container mx-auto px-4">
//           <div className="text-center mb-12">
//             <h2 className="text-3xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
//             <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
//               Find quick answers to common questions before reaching out
//             </p>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <Card className="text-center shadow-school-md border-primary/10">
//               <CardHeader>
//                 <CardTitle className="text-primary">Admissions Process</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground mb-4">
//                   Learn about application deadlines, requirements, and enrollment procedures
//                 </p>
//                 <Button variant="outline" size="sm">
//                   View Admissions Info
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card className="text-center shadow-school-md border-primary/10">
//               <CardHeader>
//                 <CardTitle className="text-primary">Tuition & Fees</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground mb-4">
//                   Information about tuition costs, payment plans, and financial aid options
//                 </p>
//                 <Button variant="outline" size="sm">
//                   View Pricing
//                 </Button>
//               </CardContent>
//             </Card>

//             <Card className="text-center shadow-school-md border-primary/10">
//               <CardHeader>
//                 <CardTitle className="text-primary">Academic Programs</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <p className="text-muted-foreground mb-4">
//                   Details about our curriculum, extracurricular activities, and special programs
//                 </p>
//                 <Button variant="outline" size="sm">
//                   View Programs
//                 </Button>
//               </CardContent>
//             </Card>
//           </div>
//         </section>
//       </div>
//     </Layout>
//   );
// };

// export default Contact;




import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react";
import { useState } from "react";

// 🔹 BACKEND URL from Vite env (.env.local me VITE_API_BASE_URL set hoga)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Contact = () => {
  const contactInfo = [
    {
      icon: MapPin,
      title: "Our Address",
      details: ["Pakka Talab", "Fatehpur, UP 212601", "India"],
    },
    {
      icon: Phone,
      title: "Phone Numbers",
      details: ["Main Office: 9565313000", "Admissions: 9565313000"],
    },
    {
      icon: Mail,
      title: "Email Addresses",
      details: ["info@bosfatehpur.in"],
    },
    {
      icon: Clock,
      title: "Office Hours",
      details: [
        "Monday - Friday: 8:00 AM - 5:00 PM",
        "Saturday: 9:00 AM - 2:00 PM",
        "Sunday: Closed",
      ],
    },
  ];

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success?: boolean;
    message?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({});

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${formState.firstName} ${formState.lastName}`,
          email: formState.email,
          subject: formState.subject,
          message: formState.message,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setFormState({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }
      setSubmitStatus(result);
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Failed to submit form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { id, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormState((prev) => ({
      ...prev,
      subject: value,
    }));
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
              <Card
                key={index}
                className="text-center shadow-school-md border-primary/10 hover:shadow-school-lg transition-all duration-300"
              >
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary-lighter">
                    <info.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-primary">
                    {info.title}
                  </CardTitle>
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

        {/* Contact Form */}
        <section className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-6">
                Send Us a Message
              </h2>
              <Card className="shadow-school-lg border-primary/10">
                <CardHeader>
                  <CardTitle className="text-xl text-primary flex items-center">
                    <MessageCircle className="w-6 h-6 mr-3 text-secondary" />
                    Contact Form
                  </CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you within 24
                    hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="Enter your first name"
                          value={formState.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Enter your last name"
                          value={formState.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formState.phone}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Select
                        value={formState.subject}
                        onValueChange={handleSelectChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admissions">
                            Admissions Inquiry
                          </SelectItem>
                          <SelectItem value="tour">
                            Campus Tour Request
                          </SelectItem>
                          <SelectItem value="academics">
                            Academic Information
                          </SelectItem>
                          <SelectItem value="enrollment">
                            Current Student Enrollment
                          </SelectItem>
                          <SelectItem value="general">
                            General Question
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Please describe your inquiry or question in detail..."
                        value={formState.message}
                        onChange={handleChange}
                        rows={5}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="hero"
                      className="w-full text-lg py-3"
                      disabled={isSubmitting}
                    >
                      <Send className="w-5 h-5 mr-2" />
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>

                    {submitStatus.message && (
                      <p
                        className={`text-sm mt-2 ${submitStatus.success
                          ? "text-green-600"
                          : "text-red-600"
                          }`}
                      >
                        {submitStatus.message}
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find quick answers to common questions before reaching out
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center shadow-school-md border-primary/10">
              <CardHeader>
                <CardTitle className="text-primary">
                  Admissions Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Learn about application deadlines, requirements, and
                  enrollment procedures
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
                  Information about tuition costs, payment plans, and financial
                  aid options
                </p>
                <Button variant="outline" size="sm">
                  View Pricing
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center shadow-school-md border-primary/10">
              <CardHeader>
                <CardTitle className="text-primary">
                  Academic Programs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Details about our curriculum, extracurricular activities, and
                  special programs
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
