import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Navigation } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSchool } from "@/hooks/useSiteContent";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/i18n";
import { usePageTitle } from "@/hooks/usePageTitle";

const emptyForm = { name: "", email: "", phone: "", subject: "", message: "" };

const Contact = () => {
  const school = useSchool();
  const { t } = useLanguage();
  usePageTitle("Contact");

  const mapQuery = encodeURIComponent(school.mapQuery);
  const whatsappHref = `https://wa.me/${school.whatsapp}?text=${encodeURIComponent(t("whatsapp.message"))}`;

  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((prev) => ({ ...prev, [e.target.id]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.subject) {
      setStatus({ success: false, message: "Please choose a subject." });
      return;
    }
    setIsSubmitting(true);
    setStatus({});
    const res = await api("/api/contact", { method: "POST", body: JSON.stringify(form) });
    if (res.success) setForm(emptyForm);
    setStatus({ success: res.success, message: res.message });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="space-y-12 md:space-y-16">
        <section className="bg-gradient-subtle py-10 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-6">Get In Touch</Badge>
            <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 md:mb-6">Contact Us</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Call, WhatsApp, or visit us for admissions, campus visits, or any other question.
            </p>
          </div>
        </section>

        {/* Quick actions + details */}
        <section className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            <Button variant="hero" size="lg" className="h-auto py-4 text-base" asChild>
              <a href={`tel:${school.phone}`}>
                <Phone className="h-5 w-5 mr-2" aria-hidden="true" />
                {t("cta.call")}
              </a>
            </Button>
            <Button size="lg" className="h-auto py-4 text-base bg-[#25D366] hover:bg-[#1ebe5b] text-white" asChild>
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                {t("cta.whatsapp")}
              </a>
            </Button>
            <Button variant="outline" size="lg" className="h-auto py-4 text-base" asChild>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`} target="_blank" rel="noopener noreferrer">
                <Navigation className="h-5 w-5 mr-2" aria-hidden="true" />
                {t("cta.directions")}
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <MapPin className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="font-semibold text-primary">Address</h2>
                  <p className="text-muted-foreground">{school.addressLines.join(", ")}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Phone className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="font-semibold text-primary">Phone & WhatsApp</h2>
                  <a href={`tel:${school.phone}`} className="text-muted-foreground hover:text-primary hover:underline">
                    {school.phoneDisplay}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Mail className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="font-semibold text-primary">Email</h2>
                  <a href={`mailto:${school.email}`} className="text-muted-foreground hover:text-primary hover:underline">
                    {school.email}
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <Clock className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="font-semibold text-primary">Office hours</h2>
                  {school.officeHours.map((h) => (
                    <p key={h} className="text-muted-foreground">{h}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-lg border border-primary/10 shadow-school-sm min-h-[260px] md:min-h-[320px]">
              <iframe
                title={`Map showing ${school.name}`}
                src={`https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`}
                className="h-full min-h-[260px] md:min-h-[320px] w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        {/* Contact form */}
        <section className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <Card className="shadow-school-lg border-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Send us a message</CardTitle>
                <CardDescription>
                  We reply within one working day. For admissions, the{" "}
                  <Link to="/admissions#enquiry" className="font-semibold text-primary underline underline-offset-2">admission enquiry form</Link>{" "}
                  is faster.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name *</Label>
                    <Input id="name" value={form.name} onChange={handleChange} required maxLength={120} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={form.email} onChange={handleChange} required maxLength={160} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" inputMode="numeric" pattern="[0-9+\-\s]{10,15}" value={form.phone} onChange={handleChange} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={form.subject} onValueChange={(v) => setForm((p) => ({ ...p, subject: v }))}>
                      <SelectTrigger id="subject">
                        <SelectValue placeholder="Choose a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admissions">Admissions</SelectItem>
                        <SelectItem value="visit">Campus visit</SelectItem>
                        <SelectItem value="fees">Fees & transport</SelectItem>
                        <SelectItem value="academics">Academics</SelectItem>
                        <SelectItem value="general">General question</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" rows={5} value={form.message} onChange={handleChange} required maxLength={3000} />
                  </div>
                  <Button type="submit" variant="hero" className="w-full text-base py-3" disabled={isSubmitting}>
                    <Send className="w-5 h-5 mr-2" aria-hidden="true" />
                    {isSubmitting ? t("form.sending") : "Send message"}
                  </Button>
                  {status.message && (
                    <p role="status" className={`text-sm ${status.success ? "text-green-700" : "text-red-600"}`}>
                      {status.message}
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Helpful links */}
        <section className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center">Quick answers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Admission process", text: "Steps, documents, and age criteria.", to: "/admissions", cta: "See admissions" },
              { title: "Fees & transport", text: "Fee structure and school bus routes.", to: "/fees", cta: "See fees" },
              { title: "Academic programs", text: "CBSE curriculum and Class XI–XII streams.", to: "/academics", cta: "See academics" },
            ].map((item) => (
              <Card key={item.title} className="text-center shadow-school-sm border-primary/10">
                <CardHeader>
                  <CardTitle className="text-primary">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{item.text}</p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={item.to}>{item.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;
