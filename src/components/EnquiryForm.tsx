import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSchool, useSiteContent } from "@/hooks/useSiteContent";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/i18n";

const empty = { studentName: "", classApplying: "", parentName: "", phone: "", email: "", previousSchool: "", message: "" };

const EnquiryForm = () => {
  const school = useSchool();
  const { classOptions } = useSiteContent();
  const { t } = useLanguage();
  const [form, setForm] = useState(empty);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<{ success?: boolean; message?: string }>({});

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [e.target.id]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.classApplying) {
      setStatus({ success: false, message: "Please select the class you are applying for." });
      return;
    }
    setSending(true);
    setStatus({});
    const res = await api("/api/enquiry", { method: "POST", body: JSON.stringify(form) });
    if (res.success) setForm(empty);
    setStatus({
      success: res.success,
      message: res.message ?? (res.success ? "Enquiry received." : `Could not send. Please call ${school.phoneDisplay}.`),
    });
    setSending(false);
  };

  return (
    <Card id="enquiry" className="shadow-school-lg border-primary/10 scroll-mt-28">
      <CardHeader>
        <CardTitle className="text-2xl text-primary">{t("form.enquiryTitle")}</CardTitle>
        <CardDescription>{t("form.enquiryDesc")}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="studentName">{t("form.studentName")} *</Label>
              <Input id="studentName" value={form.studentName} onChange={update} required maxLength={120} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classApplying">{t("form.class")} *</Label>
              <Select value={form.classApplying} onValueChange={(v) => setForm((f) => ({ ...f, classApplying: v }))}>
                <SelectTrigger id="classApplying">
                  <SelectValue placeholder={t("form.selectClass")} />
                </SelectTrigger>
                <SelectContent>
                  {classOptions.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="parentName">{t("form.parentName")} *</Label>
              <Input id="parentName" value={form.parentName} onChange={update} required maxLength={120} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t("form.phone")} *</Label>
              <Input
                id="phone"
                type="tel"
                inputMode="numeric"
                pattern="[0-9+\-\s]{10,15}"
                title="10-digit mobile number"
                value={form.phone}
                onChange={update}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("form.email")}</Label>
              <Input id="email" type="email" value={form.email} onChange={update} maxLength={160} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="previousSchool">{t("form.previousSchool")}</Label>
              <Input id="previousSchool" value={form.previousSchool} onChange={update} maxLength={200} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="message">{t("form.message")}</Label>
            <Textarea id="message" rows={3} value={form.message} onChange={update} maxLength={2000} />
          </div>
          <Button type="submit" variant="hero" className="w-full text-base py-3" disabled={sending}>
            <Send className="w-5 h-5 mr-2" aria-hidden="true" />
            {sending ? t("form.sending") : t("cta.enquire")}
          </Button>
          {status.message && (
            <p role="status" className={`text-sm ${status.success ? "text-green-700" : "text-red-600"}`}>
              {status.message}
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default EnquiryForm;
