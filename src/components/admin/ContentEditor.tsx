import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowDown, ArrowUp, Plus, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { DEFAULT_LOGO, useSavedContent, type SiteContent } from "@/hooks/useSiteContent";
import { cld } from "@/lib/cloudinary";
import { events, fees, staff, stats, testimonials, toppers, transportRoutes, youtubeVideoIds, type Sampleable } from "@/data/site";

const SAMPLE = "__sample";

type FieldType = "text" | "textarea" | "list" | "image";
type Field = { key: string; label: string; type?: FieldType; placeholder?: string; required?: boolean };
type ListSection = {
  key: Exclude<keyof SiteContent, "stats">;
  title: string;
  hint: string;
  item: string;
  fields: Field[];
  defaults: Record<string, unknown>[];
};

// Built-in content used to pre-fill a section that was never saved, so admins can edit or delete what the site shows.
// Placeholder rows keep a marker so the editor can label them as examples.
const builtIn = <T extends Sampleable>(rows: T[]) => rows.map(({ isSample, ...rest }) => (isSample ? { ...rest, [SAMPLE]: "1" } : rest));

const SECTIONS: ListSection[] = [
  {
    key: "toppers",
    title: "Board toppers",
    hint: "Shown on the home page.",
    item: "topper",
    defaults: builtIn(toppers),
    fields: [
      { key: "name", label: "Student name", required: true },
      { key: "className", label: "Class / stream", placeholder: "Class XII (Science)", required: true },
      { key: "year", label: "Year", placeholder: "2026" },
      { key: "percentage", label: "Percentage", placeholder: "95.4%", required: true },
      { key: "photo", label: "Photo (optional)", type: "image" },
    ],
  },
  {
    key: "events",
    title: "Upcoming events",
    hint: "Shown on the Notices & Events page.",
    item: "event",
    defaults: builtIn(events),
    fields: [
      { key: "title", label: "Event name", required: true },
      { key: "date", label: "Date", placeholder: "14 November 2026", required: true },
      { key: "category", label: "Type", placeholder: "Sports / Academic / Cultural" },
      { key: "description", label: "Short description", type: "textarea" },
    ],
  },
  {
    key: "fees",
    title: "Fee structure",
    hint: "Shown on the Fees page. Leave empty to show “contact the office”.",
    item: "class group",
    defaults: builtIn(fees),
    fields: [
      { key: "group", label: "Classes", placeholder: "Class I – V", required: true },
      { key: "admission", label: "Admission fee (one time)", placeholder: "₹5,000" },
      { key: "monthly", label: "Monthly tuition fee", placeholder: "₹1,200" },
      { key: "annual", label: "Annual charges", placeholder: "₹3,000" },
    ],
  },
  {
    key: "transport",
    title: "Bus routes",
    hint: "Shown on the Fees page.",
    item: "route",
    defaults: builtIn(transportRoutes),
    fields: [
      { key: "route", label: "Route name", placeholder: "Route 1 – Civil Lines", required: true },
      { key: "stops", label: "Stops (separate with commas)", type: "list", placeholder: "Civil Lines, Station Road, Pakka Talab" },
      { key: "monthlyFee", label: "Monthly fee", placeholder: "₹800" },
    ],
  },
  {
    key: "testimonials",
    title: "Parent & student reviews",
    hint: "Shown on the home page. Only add quotes the person agreed to share.",
    item: "review",
    defaults: builtIn(testimonials),
    fields: [
      { key: "quote", label: "What they said", type: "textarea", required: true },
      { key: "name", label: "Name", required: true },
      { key: "role", label: "Who they are", placeholder: "Parent, Class VI" },
    ],
  },
  {
    key: "staff",
    title: "Leadership & staff",
    hint: "Shown on the About page.",
    item: "staff member",
    defaults: builtIn(staff),
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "position", label: "Position", placeholder: "PGT – Physics", required: true },
      { key: "qualification", label: "Qualification", placeholder: "M.Sc., B.Ed." },
    ],
  },
  {
    key: "videos",
    title: "YouTube videos",
    hint: "Shown on the Gallery page. Paste the link from the YouTube app's Share button.",
    item: "video",
    defaults: youtubeVideoIds.map((id) => ({ url: `https://youtu.be/${id}` })),
    fields: [{ key: "url", label: "YouTube link", placeholder: "https://youtu.be/…", required: true }],
  },
];

type Row = Record<string, string>;

// Editing works on plain strings; lists (bus stops) are joined/split around that.
const toRows = (section: ListSection, items: Record<string, unknown>[]): Row[] =>
  items.map((item) => ({
    ...Object.fromEntries(
      section.fields.map((f) => {
        const v = item[f.key];
        return [f.key, Array.isArray(v) ? v.join(", ") : typeof v === "string" || typeof v === "number" ? String(v) : ""];
      }),
    ),
    ...(item[SAMPLE] ? { [SAMPLE]: "1" } : {}),
  }));

const fromRows = (section: ListSection, rows: Row[]) =>
  rows
    .filter((row) => section.fields.some((f) => row[f.key]?.trim()))
    .map((row) =>
      Object.fromEntries(
        section.fields.map((f) => {
          const v = row[f.key]?.trim() ?? "";
          return [f.key, f.type === "list" ? v.split(",").map((s) => s.trim()).filter(Boolean) : v];
        }),
      ),
    );

const ListEditor = ({ section, saved, token, onError }: { section: ListSection; saved: unknown; token: string; onError: (m: string) => void }) => {
  const queryClient = useQueryClient();
  const isSaved = Array.isArray(saved);
  const initial = () => toRows(section, isSaved ? (saved as Record<string, unknown>[]) : section.defaults);
  const [rows, setRows] = useState<Row[]>(initial);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Reload when switching sections or when fresh data arrives from the server.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setRows(initial()), [section.key, saved]);

  // Editing an example row turns it into real content.
  const set = (i: number, key: string, value: string) => {
    setStatus("");
    setRows((r) => r.map((row, j) => (j === i ? { ...row, [key]: value, [SAMPLE]: "" } : row)));
  };
  const move = (i: number, by: number) =>
    setRows((r) => {
      const next = [...r];
      [next[i], next[i + by]] = [next[i + by], next[i]];
      return next;
    });
  const add = () => setRows((r) => [...r, Object.fromEntries(section.fields.map((f) => [f.key, ""]))]);
  const remove = (i: number) => {
    setStatus("");
    setRows((r) => r.filter((_, j) => j !== i));
  };
  const dirty = JSON.stringify(rows) !== JSON.stringify(initial());

  const upload = async (i: number, key: string, file?: File) => {
    if (!file) return;
    setUploading(`${i}-${key}`);
    try {
      const { url } = await uploadImage(file, token);
      set(i, key, url);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed.");
    }
    setUploading(null);
  };

  const save = async () => {
    const examples = rows.filter((r) => r[SAMPLE]).length;
    if (examples && !window.confirm(`${examples} example item(s) are still in the list and will appear on the live website. Save anyway? (Delete them first if they are not real.)`)) return;
    const value = fromRows(section, rows);
    const missing = value.findIndex((item) => section.fields.some((f) => f.required && !item[f.key]?.length));
    if (missing >= 0) {
      const field = section.fields.find((f) => f.required && !value[missing][f.key]?.length);
      return onError(`${section.item[0].toUpperCase()}${section.item.slice(1)} ${missing + 1}: “${field?.label}” is required.`);
    }
    setBusy(true);
    const res = await api(`/api/admin/content/${section.key}`, { method: "PUT", body: JSON.stringify({ value }) }, token);
    setBusy(false);
    if (!res.success) return onError(res.message ?? "Could not save.");
    setStatus("Saved. The website now shows this.");
    queryClient.invalidateQueries({ queryKey: ["site-content"] });
  };

  return (
    <div className="space-y-4">
      {!isSaved && (
        <p className="rounded bg-muted p-3 text-sm text-muted-foreground">
          This is what the website shows right now. Change any item, delete the ones you don’t want, then press <strong>Save changes</strong>.
          Items marked <strong>Example</strong> are placeholders: they are hidden on the live site until you edit them.
        </p>
      )}
      {rows.length === 0 && <p className="text-muted-foreground">Nothing here yet. Press “Add {section.item}”.</p>}

      {rows.map((row, i) => (
        <Card key={i}>
          <CardContent className="space-y-3 pt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-semibold text-primary capitalize">
                {section.item} {i + 1}
                {row[SAMPLE] && <span className="ml-2 rounded bg-yellow-300 px-1.5 py-0.5 text-[10px] normal-case text-yellow-950">Example</span>}
              </span>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-9 w-9" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">
                  <ArrowUp className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-9 w-9" disabled={i === rows.length - 1} onClick={() => move(i, 1)} aria-label="Move down">
                  <ArrowDown className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost" className="h-9 text-red-600" onClick={() => remove(i)} aria-label={`Delete ${section.item} ${i + 1}`}>
                  <Trash2 className="h-4 w-4 sm:mr-1" aria-hidden="true" />
                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {section.fields.map((f) => {
                const id = `${section.key}-${i}-${f.key}`;
                return (
                  <div key={f.key} className={`space-y-1.5 ${f.type === "textarea" || f.type === "list" ? "sm:col-span-2" : ""}`}>
                    <Label htmlFor={id}>{f.label}{f.required && " *"}</Label>
                    {f.type === "textarea" ? (
                      <Textarea id={id} rows={3} value={row[f.key]} placeholder={f.placeholder} onChange={(e) => set(i, f.key, e.target.value)} />
                    ) : f.type === "image" ? (
                      <div className="flex items-center gap-2">
                        {row[f.key] && <img src={row[f.key]} alt="" className="h-10 w-10 shrink-0 rounded-full object-cover" />}
                        <Input id={id} value={row[f.key]} placeholder="https://… or upload" onChange={(e) => set(i, f.key, e.target.value)} />
                        <Button size="icon" variant="outline" className="shrink-0" asChild aria-label="Upload photo">
                          <label className="cursor-pointer">
                            <Upload className="h-4 w-4" aria-hidden="true" />
                            <input type="file" accept="image/*" className="sr-only" disabled={uploading !== null} onChange={(e) => upload(i, f.key, e.target.files?.[0])} />
                          </label>
                        </Button>
                      </div>
                    ) : (
                      <Input id={id} value={row[f.key]} placeholder={f.placeholder} onChange={(e) => set(i, f.key, e.target.value)} />
                    )}
                    {uploading === `${i}-${f.key}` && <p className="text-xs text-muted-foreground">Uploading…</p>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-2 border-t bg-muted/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button variant="outline" onClick={add}>
          <Plus className="h-4 w-4 mr-1" aria-hidden="true" /> Add {section.item}
        </Button>
        <Button onClick={save} disabled={busy || (isSaved && !dirty)}>{busy ? "Saving…" : "Save changes"}</Button>
        {dirty && (
          <Button variant="ghost" onClick={() => setRows(initial())}>
            Undo changes
          </Button>
        )}
        {dirty && !status && <span className="text-sm text-amber-700">Unsaved changes</span>}
        {status && <span role="status" className="text-sm font-medium text-green-700">{status}</span>}
      </div>
    </div>
  );
};

const statOf = (labelKey: string) => String(stats.find((s) => s.labelKey === labelKey)?.value ?? "");
const builtInStats = { students: statOf("stats.students"), teachers: statOf("stats.teachers"), result: statOf("stats.result") };

const StatsEditor = ({ saved, token, onError }: { saved?: SiteContent["stats"]; token: string; onError: (m: string) => void }) => {
  const queryClient = useQueryClient();
  const start = () => saved ?? builtInStats;
  const [values, setValues] = useState<NonNullable<SiteContent["stats"]>>(start);
  const [status, setStatus] = useState("");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => setValues(start()), [saved]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api("/api/admin/content/stats", { method: "PUT", body: JSON.stringify({ value: values }) }, token);
    if (!res.success) return onError(res.message ?? "Could not save.");
    setStatus("Saved.");
    queryClient.invalidateQueries({ queryKey: ["site-content"] });
  };

  const fields = [
    ["students", "Number of students", "1200"],
    ["teachers", "Number of teachers", "55"],
    ["result", "Board exam pass %", "100"],
  ] as const;

  return (
    <form onSubmit={save} className="space-y-4 max-w-md">
      <p className="text-sm text-muted-foreground">
        The counters on the home and About pages. “Years of excellence” is worked out automatically. Leave a box empty to hide that counter.
      </p>
      {fields.map(([key, label, placeholder]) => (
        <div key={key} className="space-y-1.5">
          <Label htmlFor={`stat-${key}`}>{label}</Label>
          <Input
            id={`stat-${key}`}
            inputMode="numeric"
            value={values[key] ?? ""}
            placeholder={placeholder}
            onChange={(e) => {
              setStatus("");
              setValues({ ...values, [key]: e.target.value.replace(/[^\d.]/g, "") });
            }}
          />
        </div>
      ))}
      <div className="flex items-center gap-3">
        <Button type="submit">Save numbers</Button>
        {status && <span role="status" className="text-sm font-medium text-green-700">{status}</span>}
      </div>
    </form>
  );
};

const LogoEditor = ({ saved, token, onError }: { saved?: SiteContent["branding"]; token: string; onError: (m: string) => void }) => {
  const queryClient = useQueryClient();
  const [logo, setLogo] = useState(saved?.logo ?? "");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => setLogo(saved?.logo ?? ""), [saved]);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["site-content"] });

  const upload = async (file?: File) => {
    if (!file) return;
    setBusy(true);
    setStatus("Uploading…");
    try {
      const { url } = await uploadImage(file, token);
      setLogo(url);
      setStatus("Uploaded. Check the preview, then press Save logo.");
    } catch (err) {
      setStatus("");
      onError(err instanceof Error ? err.message : "Upload failed.");
    }
    setBusy(false);
  };

  const save = async () => {
    const res = await api("/api/admin/content/branding", { method: "PUT", body: JSON.stringify({ value: { logo: logo.trim() } }) }, token);
    if (!res.success) return onError(res.message ?? "Could not save.");
    setStatus("Saved. The new logo now shows on the website.");
    refresh();
  };

  const reset = async () => {
    if (!window.confirm("Go back to the original school logo?")) return;
    const res = await api("/api/admin/content/branding", { method: "DELETE" }, token);
    if (!res.success) return onError(res.message ?? "Could not reset.");
    setLogo("");
    setStatus("The original logo is back on the website.");
    refresh();
  };

  const preview = logo.trim() || DEFAULT_LOGO;
  const changed = logo.trim() !== (saved?.logo ?? "");

  return (
    <div className="space-y-5 max-w-lg">
      <p className="text-sm text-muted-foreground">
        Shown in the website header, the footer and the browser tab. Use a square image (for example 500 × 500 px), ideally a PNG
        with a transparent or white background.
      </p>

      <div className="flex flex-wrap items-center gap-6 rounded-lg border bg-background p-4">
        <div className="text-center">
          <img src={cld(preview, 240)} alt="Logo preview" className="h-24 w-24 rounded object-contain" />
          <p className="mt-1 text-xs text-muted-foreground">{logo.trim() ? (changed ? "New (not saved)" : "Current logo") : "Original logo"}</p>
        </div>
        {/* How it looks in the website header */}
        <div className="flex min-w-0 items-center gap-3 rounded border px-3 py-2">
          <img src={cld(preview, 112)} alt="" className="h-11 w-11 shrink-0 object-contain" />
          <span className="text-sm font-bold leading-tight text-primary">Header preview</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" asChild disabled={busy}>
          <label className="cursor-pointer">
            <Upload className="h-4 w-4 mr-2" aria-hidden="true" />
            Upload new logo
            <input type="file" accept="image/*" className="sr-only" disabled={busy} onChange={(e) => upload(e.target.files?.[0])} />
          </label>
        </Button>
        <Button onClick={save} disabled={busy || !logo.trim() || !changed}>Save logo</Button>
        {saved?.logo && (
          <Button variant="ghost" onClick={reset} disabled={busy}>Use original logo</Button>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="logo-url">…or paste an image link</Label>
        <Input id="logo-url" value={logo} placeholder="https://…" onChange={(e) => { setStatus(""); setLogo(e.target.value); }} />
      </div>

      {status && <p role="status" className="text-sm font-medium text-green-700">{status}</p>}
    </div>
  );
};

const ContentEditor = ({ token, onError }: { token: string; onError: (message: string) => void }) => {
  const { data: saved = {}, isLoading } = useSavedContent();
  const [active, setActive] = useState<string>(SECTIONS[0].key);
  const section = SECTIONS.find((s) => s.key === active);

  if (isLoading) return <p className="text-muted-foreground">Loading…</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
      <nav aria-label="Website sections" className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
        {[{ key: "logo", title: "School logo" }, ...SECTIONS.map((s) => ({ key: s.key, title: s.title })), { key: "stats", title: "Home page numbers" }].map((s) => (
          <Button
            key={s.key}
            variant={active === s.key ? "default" : "outline"}
            className="shrink-0 justify-start"
            onClick={() => setActive(s.key)}
          >
            {s.title}
          </Button>
        ))}
      </nav>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{section?.title ?? (active === "logo" ? "School logo" : "Home page numbers")}</CardTitle>
          {section && <CardDescription>{section.hint}</CardDescription>}
        </CardHeader>
        <CardContent>
          {section ? (
            <ListEditor key={section.key} section={section} saved={saved[section.key]} token={token} onError={onError} />
          ) : active === "logo" ? (
            <LogoEditor saved={saved.branding} token={token} onError={onError} />
          ) : (
            <StatsEditor saved={saved.stats} token={token} onError={onError} />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentEditor;
