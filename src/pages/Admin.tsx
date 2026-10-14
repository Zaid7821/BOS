import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Search, Trash2 } from "lucide-react";
import GalleryManager from "@/components/admin/GalleryManager";
import ContentEditor from "@/components/admin/ContentEditor";
import { api } from "@/lib/api";
import { SCHOOL } from "@/data/site";
import { usePageTitle } from "@/hooks/usePageTitle";

type Enquiry = {
  id: number;
  student_name: string;
  class_applying: string;
  parent_name: string;
  phone: string;
  email: string | null;
  previous_school: string | null;
  message: string | null;
  status: string;
  admin_note: string | null;
  created_at: string;
};
type Message = { id: number; name: string; email: string; phone: string | null; subject: string; message: string; created_at: string };
type Notice = { id: number; title: string; body: string | null; link: string | null; is_important: boolean; is_active: boolean; created_at: string };

const TOKEN_KEY = "bos-admin-token";
const statuses = ["new", "contacted", "admitted", "closed"];
const when = (iso: string) => new Date(iso).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });
const statusColor: Record<string, string> = {
  new: "bg-blue-100 text-blue-900",
  contacted: "bg-amber-100 text-amber-900",
  admitted: "bg-green-100 text-green-900",
  closed: "bg-gray-200 text-gray-700",
};
const whatsappLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "").replace(/^(\d{10})$/, "91$1")}`;

/** Saves the given enquiries as a CSV file that opens in Excel (BOM keeps Hindi names readable). */
const downloadCsv = (rows: Enquiry[]) => {
  const header = ["Received", "Student", "Class", "Parent", "Phone", "Email", "Previous school", "Message", "Status", "Office note"];
  const cell = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const lines = rows.map((e) =>
    [when(e.created_at), e.student_name, e.class_applying, e.parent_name, e.phone, e.email, e.previous_school, e.message, e.status, e.admin_note]
      .map(cell)
      .join(","),
  );
  const blob = new Blob(["\uFEFF" + [header.map(cell).join(","), ...lines].join("\r\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `admission-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
};

const Login = ({ onLogin }: { onLogin: (token: string) => void }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await api("/api/admin/login", { method: "POST", body: JSON.stringify({ password }) });
    setBusy(false);
    if (res.success && res.token) onLogin(res.token);
    else setError(res.message ?? "Login failed.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-primary">School admin</CardTitle>
          <p className="text-sm text-muted-foreground">{SCHOOL.name}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoFocus />
            </div>
            <Button type="submit" className="w-full" disabled={busy}>{busy ? "Logging in…" : "Log in"}</Button>
            {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const Admin = () => {
  usePageTitle("Admin");
  const [token, setToken] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  });
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState({ title: "", body: "", link: "", isImportant: false });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
    setToken(null);
  }, []);

  const load = useCallback(async () => {
    if (!token) return;
    const [e, m, n] = await Promise.all([
      api<Enquiry[]>("/api/admin/enquiries", {}, token),
      api<Message[]>("/api/admin/messages", {}, token),
      api<Notice[]>("/api/admin/notices", {}, token),
    ]);
    if (!e.success && (e as { status?: number }).status === 401) return logout();
    if (!e.success || !m.success || !n.success) setError(e.message || m.message || n.message || "Could not load data.");
    else setError("");
    setEnquiries(e.data ?? []);
    setMessages(m.data ?? []);
    setNotices(n.data ?? []);
  }, [token, logout]);

  useEffect(() => {
    load();
  }, [load]);

  if (!token) {
    return (
      <Login
        onLogin={(tkn) => {
          try {
            sessionStorage.setItem(TOKEN_KEY, tkn);
          } catch {
            /* ignore */
          }
          setToken(tkn);
        }}
      />
    );
  }

  const call = async (path: string, method: string, body?: unknown) => {
    const res = await api(path, { method, body: body ? JSON.stringify(body) : undefined }, token);
    if (!res.success) setError(res.message ?? "Action failed.");
    await load();
    return res.success;
  };

  const addNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (await call("/api/admin/notices", "POST", draft)) setDraft({ title: "", body: "", link: "", isImportant: false });
  };

  const newCount = enquiries.filter((e) => e.status === "new").length;
  const q = search.trim().toLowerCase();
  const shownEnquiries = enquiries.filter(
    (e) =>
      (statusFilter === "all" || e.status === statusFilter) &&
      (!q || [e.student_name, e.parent_name, e.phone, e.class_applying].some((v) => v.toLowerCase().includes(q))),
  );

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="font-bold">School admin</p>
            <p className="truncate text-sm text-primary-foreground/80">{SCHOOL.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" asChild><Link to="/">View website</Link></Button>
            <Button variant="outline" size="sm" className="bg-transparent text-primary-foreground" onClick={logout}>Log out</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 md:py-8">
        {error && (
          <div role="alert" className="mb-4 flex items-start justify-between gap-3 rounded bg-red-100 p-3 text-red-800">
            <span>{error}</span>
            <button type="button" className="font-semibold underline" onClick={() => setError("")}>Dismiss</button>
          </div>
        )}
        <Tabs defaultValue="enquiries">
          <TabsList className="mb-6 flex h-auto w-full justify-start overflow-x-auto sm:w-auto sm:flex-wrap">
            <TabsTrigger value="enquiries">Enquiries {newCount > 0 && <Badge className="ml-2">{newCount} new</Badge>}</TabsTrigger>
            <TabsTrigger value="notices">Notices ({notices.length})</TabsTrigger>
            <TabsTrigger value="messages">Messages ({messages.length})</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
            <TabsTrigger value="content">Website content</TabsTrigger>
          </TabsList>

          <TabsContent value="enquiries">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                <Input
                  aria-label="Search enquiries"
                  placeholder="Search by name, phone or class"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-background"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {["all", ...statuses].map((st) => (
                  <Button
                    key={st}
                    size="sm"
                    variant={statusFilter === st ? "default" : "outline"}
                    className="shrink-0 capitalize"
                    onClick={() => setStatusFilter(st)}
                  >
                    {st} ({st === "all" ? enquiries.length : enquiries.filter((e) => e.status === st).length})
                  </Button>
                ))}
              </div>
              <Button variant="outline" size="sm" className="shrink-0" disabled={!shownEnquiries.length} onClick={() => downloadCsv(shownEnquiries)}>
                <Download className="h-4 w-4 mr-1.5" aria-hidden="true" /> Export to Excel
              </Button>
            </div>

            {enquiries.length === 0 ? (
              <p className="text-muted-foreground">No enquiries yet. They appear here when parents use the admission enquiry form.</p>
            ) : shownEnquiries.length === 0 ? (
              <p className="text-muted-foreground">No enquiries match this search.</p>
            ) : (
              <div className="space-y-3">
                {shownEnquiries.map((e) => (
                  <div key={e.id} className="rounded-lg border bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="text-lg font-semibold">
                          {e.student_name} <span className="font-normal text-muted-foreground">· {e.class_applying}</span>
                        </p>
                        <p className="text-xs text-muted-foreground">{when(e.created_at)}</p>
                      </div>
                      <label className="sr-only" htmlFor={`status-${e.id}`}>Status</label>
                      <select
                        id={`status-${e.id}`}
                        value={e.status}
                        onChange={(ev) => call(`/api/admin/enquiries/${e.id}`, "PATCH", { status: ev.target.value })}
                        className={`rounded border px-2 py-1.5 text-sm font-semibold capitalize ${statusColor[e.status] ?? ""}`}
                      >
                        {statuses.map((st) => <option key={st} value={st}>{st}</option>)}
                      </select>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1.4fr]">
                      <div className="text-sm">
                        <p><span className="text-muted-foreground">Parent:</span> {e.parent_name}</p>
                        {e.email && <p className="break-all text-muted-foreground">{e.email}</p>}
                        {e.previous_school && <p><span className="text-muted-foreground">Previous school:</span> {e.previous_school}</p>}
                        {e.message && <p className="mt-1 whitespace-pre-line">“{e.message}”</p>}
                      </div>
                      <div className="flex flex-wrap items-start gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={`tel:${e.phone}`}>Call {e.phone}</a>
                        </Button>
                        <Button size="sm" className="bg-[#25D366] text-white hover:bg-[#1ebe5b]" asChild>
                          <a href={whatsappLink(e.phone)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Textarea
                          aria-label="Office note"
                          rows={2}
                          defaultValue={e.admin_note ?? ""}
                          placeholder="Office note, e.g. “Called, visiting on Monday”"
                          className="text-sm"
                          onBlur={(ev) => ev.target.value !== (e.admin_note ?? "") && call(`/api/admin/enquiries/${e.id}`, "PATCH", { note: ev.target.value })}
                        />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="shrink-0 text-red-600"
                          aria-label={`Delete enquiry for ${e.student_name}`}
                          onClick={() => window.confirm(`Delete the enquiry for ${e.student_name}?`) && call(`/api/admin/enquiries/${e.id}`, "DELETE")}
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="notices">
            <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-6 items-start">
              <Card>
                <CardHeader><CardTitle className="text-primary">Post a notice</CardTitle></CardHeader>
                <CardContent>
                  <form onSubmit={addNotice} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="n-title">Title *</Label>
                      <Input id="n-title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required maxLength={200} placeholder="e.g. School closed on 2 October" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="n-body">Details</Label>
                      <Textarea id="n-body" rows={3} value={draft.body} onChange={(e) => setDraft({ ...draft, body: e.target.value })} maxLength={2000} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="n-link">Link to PDF or page (optional)</Label>
                      <Input id="n-link" value={draft.link} onChange={(e) => setDraft({ ...draft, link: e.target.value })} placeholder="https://…" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="n-imp" checked={draft.isImportant} onCheckedChange={(v) => setDraft({ ...draft, isImportant: v === true })} />
                      <Label htmlFor="n-imp">Mark as important (shows first, with a NEW tag)</Label>
                    </div>
                    <Button type="submit">Post notice</Button>
                  </form>
                </CardContent>
              </Card>
              <div className="space-y-3">
                {notices.length === 0 && <p className="text-muted-foreground">No notices yet. Posted notices appear in the scrolling bar and on the Notices page.</p>}
                {notices.map((n) => (
                  <div key={n.id} className={`rounded-lg border bg-card p-4 ${n.is_active ? "" : "opacity-60"}`}>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {n.is_important && <Badge className="bg-red-600 hover:bg-red-600">Important</Badge>}
                      {!n.is_active && <Badge variant="outline">Hidden</Badge>}
                      <span className="text-xs text-muted-foreground">{when(n.created_at)}</span>
                    </div>
                    <p className="font-semibold">{n.title}</p>
                    {n.body && <p className="text-sm text-muted-foreground whitespace-pre-line">{n.body}</p>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" onClick={() => call(`/api/admin/notices/${n.id}`, "PATCH", { isActive: !n.is_active })}>
                        {n.is_active ? "Hide" : "Show"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => call(`/api/admin/notices/${n.id}`, "PATCH", { isImportant: !n.is_important })}>
                        {n.is_important ? "Unmark important" : "Mark important"}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => window.confirm(`Delete notice "${n.title}"?`) && call(`/api/admin/notices/${n.id}`, "DELETE")}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="messages">
            {messages.length === 0 ? (
              <p className="text-muted-foreground">No messages yet. They appear here when visitors use the contact form.</p>
            ) : (
              <div className="space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className="rounded-lg border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">{m.name} <Badge variant="secondary" className="ml-1">{m.subject}</Badge></p>
                      <span className="text-xs text-muted-foreground">{when(m.created_at)}</span>
                    </div>
                    <p className="text-sm">
                      <a href={`mailto:${m.email}`} className="text-primary underline">{m.email}</a>
                      {m.phone && <> · <a href={`tel:${m.phone}`} className="text-primary underline">{m.phone}</a></>}
                    </p>
                    <p className="mt-2 whitespace-pre-line">{m.message}</p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() => window.confirm("Delete this message?") && call(`/api/admin/messages/${m.id}`, "DELETE")}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="gallery">
            <GalleryManager token={token} onError={setError} />
          </TabsContent>

          <TabsContent value="content">
            <ContentEditor token={token} onError={setError} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
