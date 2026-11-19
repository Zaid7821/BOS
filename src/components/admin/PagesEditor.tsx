import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  AlignLeft, ArrowDown, ArrowLeft, ArrowUp, ExternalLink, Eye, FileText, Heading, Image as ImageIcon,
  Info, Link2, Pencil, Plus, Table, Trash2, Upload, Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageBlocks from "@/components/PageBlocks";
import { api } from "@/lib/api";
import { uploadImage } from "@/lib/upload";
import { cld } from "@/lib/cloudinary";
import { PAGES_QUERY_KEY, type CustomPage, type PageBlock, type PagePlacement } from "@/hooks/useCustomPages";

type Props = { token: string; onError: (message: string) => void };

/** Block being edited: plain strings, with the table kept as text (one row per line, columns split by |). */
type EditBlock = Record<string, string> & { type: PageBlock["type"]; _id: string };
type Draft = Omit<CustomPage, "blocks" | "id"> & { id?: number; blocks: EditBlock[] };

const BLOCK_TYPES: { type: PageBlock["type"]; label: string; icon: typeof Heading; hint: string }[] = [
  { type: "heading", label: "Heading", icon: Heading, hint: "A title for a part of the page." },
  { type: "paragraph", label: "Paragraph", icon: AlignLeft, hint: "Normal text. Press Enter for a new line." },
  { type: "image", label: "Photo", icon: ImageIcon, hint: "Upload a photo from your phone or computer." },
  { type: "document", label: "PDF / document", icon: FileText, hint: "Upload a PDF, or paste a Google Drive link." },
  { type: "button", label: "Button", icon: Link2, hint: "A button that opens a link." },
  { type: "video", label: "YouTube video", icon: Youtube, hint: "Paste the link from YouTube's Share button." },
  { type: "table", label: "Table", icon: Table, hint: "Rows and columns, e.g. a timetable or book list." },
  { type: "notice", label: "Notice box", icon: Info, hint: "Highlighted text for important information." },
];
const blockInfo = (type: string) => BLOCK_TYPES.find((b) => b.type === type)!;

const PLACEMENTS: { value: PagePlacement; label: string }[] = [
  { value: "footer", label: "Footer only" },
  { value: "menu", label: "Menu and footer" },
  { value: "none", label: "Nowhere (link only)" },
];
const placementLabel = (p: PagePlacement) => ({ footer: "Footer", menu: "Menu + footer", none: "Link only" })[p];

let nextId = 0;
const newId = () => `b${++nextId}`;

/** "Holiday Homework 2026!" -> "holiday-homework-2026" */
const slugify = (text: string) =>
  text.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

const toEdit = (b: PageBlock): EditBlock => {
  if (b.type === "table") return { type: "table", _id: newId(), table: b.rows.map((r) => r.join(" | ")).join("\n") };
  return { ...(b as Record<string, string>), type: b.type, _id: newId() };
};

const fromEdit = ({ _id, ...b }: EditBlock): PageBlock => {
  if (b.type === "table") {
    const rows = (b.table ?? "").split("\n").map((line) => line.split("|").map((c) => c.trim())).filter((r) => r.some(Boolean));
    return { type: "table", rows };
  }
  // Drop empty optional fields so saved pages stay tidy.
  return Object.fromEntries(Object.entries(b).filter(([, v]) => v.trim() !== "")) as PageBlock;
};

const emptyBlock = (type: PageBlock["type"]): EditBlock =>
  type === "table" ? { type, _id: newId(), table: "Class | Book | Publisher\n" } : { type, _id: newId() };

const blankDraft = (): Draft => ({ slug: "", titleEn: "", titleHi: "", placement: "footer", status: "draft", blocks: [] });

const toDraft = (p: CustomPage): Draft => ({ ...p, blocks: p.blocks.map(toEdit) });

/** Same shape the server expects, also used to spot unsaved changes. */
const payload = (d: Draft) => ({
  slug: d.slug.trim(),
  titleEn: d.titleEn.trim(),
  titleHi: d.titleHi.trim(),
  placement: d.placement,
  status: d.status,
  blocks: d.blocks.map(fromEdit),
});

const selectClass = "h-12 w-full rounded-md border bg-background px-3 text-base";

/* ---------------- One block in the editor ---------------- */

const BlockFields = ({ block, set, token, onError }: { block: EditBlock; set: (key: string, value: string) => void; token: string; onError: (m: string) => void }) => {
  const [uploading, setUploading] = useState(false);
  const id = (key: string) => `${block._id}-${key}`;

  const upload = async (file?: File) => {
    if (!file) return;
    setUploading(true);
    try {
      set("url", (await uploadImage(file, token)).url);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Upload failed.");
    }
    setUploading(false);
  };

  // An English box and an optional Hindi box side by side (stacked on phones).
  const bilingual = (key: string, label: string, long = false) => {
    const Field = long ? Textarea : Input;
    return (
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor={id(key)}>{label} (English){key === "text" || (block.type === "button" && key === "label") ? " *" : ""}</Label>
          <Field id={id(key)} value={block[key] ?? ""} onChange={(e) => set(key, e.target.value)} {...(long ? { rows: 4 } : {})} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor={id(`${key}Hi`)}>{label} (हिंदी, optional)</Label>
          <Field id={id(`${key}Hi`)} lang="hi" value={block[`${key}Hi`] ?? ""} onChange={(e) => set(`${key}Hi`, e.target.value)} {...(long ? { rows: 4 } : {})} />
        </div>
      </div>
    );
  };

  const urlField = (label: string, accept?: string) => (
    <div className="space-y-1.5">
      <Label htmlFor={id("url")}>{label} *</Label>
      <div className="flex items-center gap-2">
        {block.type === "image" && block.url && <img src={cld(block.url, 160)} alt="" className="h-12 w-12 shrink-0 rounded object-cover" />}
        <Input id={id("url")} type="url" value={block.url ?? ""} placeholder={accept ? "https://… or upload" : "https://…"} onChange={(e) => set("url", e.target.value)} />
        {block.url && block.type !== "image" && (
          <Button type="button" size="icon" variant="outline" className="h-10 w-10 shrink-0" asChild aria-label="Open link">
            <a href={block.url} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
          </Button>
        )}
        {accept && (
          <Button type="button" size="icon" variant="outline" className="h-10 w-10 shrink-0" asChild aria-label="Upload file">
            <label className="cursor-pointer">
              <Upload className="h-4 w-4" aria-hidden="true" />
              <input type="file" accept={accept} className="sr-only" disabled={uploading} onChange={(e) => upload(e.target.files?.[0])} />
            </label>
          </Button>
        )}
      </div>
      {uploading && <p className="text-xs text-muted-foreground">Uploading…</p>}
    </div>
  );

  switch (block.type) {
    case "heading":
      return bilingual("text", "Heading");
    case "paragraph":
    case "notice":
      return bilingual("text", "Text", true);
    case "image":
      return <div className="space-y-3">{urlField("Photo", "image/*")}{bilingual("caption", "Caption")}</div>;
    case "document":
      return (
        <div className="space-y-3">
          {urlField("PDF or link", "application/pdf,image/*")}
          {bilingual("label", "Button text")}
          <p className="text-xs text-muted-foreground">Leave the button text empty to show “Open document”.</p>
        </div>
      );
    case "button":
      return (
        <div className="space-y-3">
          {bilingual("label", "Button text")}
          <div className="space-y-1.5">
            <Label htmlFor={id("url")}>Link *</Label>
            <Input id={id("url")} value={block.url ?? ""} placeholder="https://… or /admissions" onChange={(e) => set("url", e.target.value)} />
            <p className="text-xs text-muted-foreground">A full web link, or a page on this website such as /admissions or /fees.</p>
          </div>
        </div>
      );
    case "video":
      return urlField("YouTube link");
    case "table":
      return (
        <div className="space-y-1.5">
          <Label htmlFor={id("table")}>Table *</Label>
          <Textarea id={id("table")} rows={6} className="font-mono" value={block.table ?? ""} onChange={(e) => set("table", e.target.value)} />
          <p className="text-xs text-muted-foreground">
            One row per line. Separate columns with a <strong>|</strong> sign. The first line is the heading row. Example:
            <br />
            <code>Class | Book | Publisher</code>
            <br />
            <code>VI | Mathematics | NCERT</code>
          </p>
        </div>
      );
    default:
      return null;
  }
};

/* ---------------- Page editor ---------------- */

const PageForm = ({ initial, token, onError, onDone }: { initial: Draft; token: string; onError: (m: string) => void; onDone: (saved?: CustomPage) => void }) => {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState<Draft>(initial);
  const [savedPayload, setSavedPayload] = useState(() => JSON.stringify(payload(initial)));
  // Fill the address from the title until the admin types an address of their own.
  const [autoSlug, setAutoSlug] = useState(!initial.slug);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(false);
  const lastBlock = useRef<HTMLDivElement>(null);
  const [scrollToNew, setScrollToNew] = useState(false);

  const dirty = JSON.stringify(payload(draft)) !== savedPayload;

  useEffect(() => {
    if (scrollToNew) lastBlock.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setScrollToNew(false);
  }, [scrollToNew]);

  // Warn before closing the tab with unsaved work.
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const update = (patch: Partial<Draft>) => {
    setStatus("");
    setDraft((d) => ({ ...d, ...patch }));
  };
  const setBlock = (i: number) => (key: string, value: string) => {
    setStatus("");
    setDraft((d) => ({ ...d, blocks: d.blocks.map((b, j) => (j === i ? { ...b, [key]: value } : b)) }));
  };
  const moveBlock = (i: number, by: number) =>
    setDraft((d) => {
      const blocks = [...d.blocks];
      [blocks[i], blocks[i + by]] = [blocks[i + by], blocks[i]];
      return { ...d, blocks };
    });
  const removeBlock = (i: number) => {
    if (!window.confirm(`Delete this ${blockInfo(draft.blocks[i].type).label.toLowerCase()} block?`)) return;
    update({ blocks: draft.blocks.filter((_, j) => j !== i) });
  };
  const addBlock = (type: PageBlock["type"]) => {
    update({ blocks: [...draft.blocks, emptyBlock(type)] });
    setScrollToNew(true);
  };

  const save = async () => {
    const body = payload(draft);
    if (!body.titleEn) return onError("Please write the page title in English.");
    if (!body.slug) return onError("Please write the page address, e.g. holiday-homework");
    setBusy(true);
    const res = await api<CustomPage>(
      draft.id ? `/api/admin/pages/${draft.id}` : "/api/admin/pages",
      { method: draft.id ? "PUT" : "POST", body: JSON.stringify(body) },
      token,
    );
    setBusy(false);
    if (!res.success || !res.data) return onError(res.message ?? "Could not save the page.");
    const saved = toDraft(res.data);
    setDraft(saved);
    setSavedPayload(JSON.stringify(payload(saved)));
    setAutoSlug(false);
    setStatus(res.data.status === "published" ? "Saved. The page is live on the website." : "Saved as a draft. Visitors can’t see it yet.");
    queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
    onDone(res.data);
  };

  const back = () => {
    if (dirty && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    onDone();
  };

  const isPublished = draft.status === "published" && !dirty;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="ghost" className="-ml-3" onClick={back}>
          <ArrowLeft className="h-4 w-4 mr-1.5" aria-hidden="true" /> All pages
        </Button>
        {draft.id && isPublished && (
          <Button variant="outline" size="sm" asChild>
            <a href={`/p/${draft.slug}`} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1.5" aria-hidden="true" /> View on website
            </a>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">{draft.id ? "Edit page" : "New page"}</CardTitle>
          <CardDescription>Fields marked * are required.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="page-title-en">Page title (English) *</Label>
              <Input
                id="page-title-en"
                value={draft.titleEn}
                placeholder="Holiday Homework"
                onChange={(e) => update({ titleEn: e.target.value, ...(autoSlug ? { slug: slugify(e.target.value) } : {}) })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="page-title-hi">Page title (हिंदी, optional)</Label>
              <Input id="page-title-hi" lang="hi" value={draft.titleHi} placeholder="अवकाश गृहकार्य" onChange={(e) => update({ titleHi: e.target.value })} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="page-slug">Page address *</Label>
            <div className="flex items-center rounded-md border bg-muted/50 focus-within:ring-2 focus-within:ring-ring">
              <span className="shrink-0 pl-3 text-sm text-muted-foreground">/p/</span>
              <Input
                id="page-slug"
                className="border-0 bg-transparent pl-1 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={draft.slug}
                placeholder="holiday-homework"
                onChange={(e) => {
                  setAutoSlug(false);
                  update({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 60) });
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Small letters, numbers and dashes. Changing it later breaks links people already shared.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="page-placement">Where to show a link to it</Label>
              <select id="page-placement" className={selectClass} value={draft.placement} onChange={(e) => update({ placement: e.target.value as PagePlacement })}>
                {PLACEMENTS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
              <p className="text-xs text-muted-foreground">
                “Menu” means the phone menu and the top bar on computers. “Link only” pages are not listed anywhere; share their address yourself.
              </p>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="page-status">Who can see it</Label>
              <select id="page-status" className={selectClass} value={draft.status} onChange={(e) => update({ status: e.target.value as Draft["status"] })}>
                <option value="draft">Draft (hidden)</option>
                <option value="published">Published (everyone)</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-primary">Page content</h3>
        {draft.blocks.length === 0 && (
          <p className="rounded-lg border border-dashed p-6 text-center text-muted-foreground">
            The page is empty. Add a block below, for example a paragraph or a PDF.
          </p>
        )}
        {draft.blocks.map((block, i) => {
          const info = blockInfo(block.type);
          return (
            <Card key={block._id} ref={i === draft.blocks.length - 1 ? lastBlock : undefined}>
              <CardContent className="space-y-3 pt-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <info.icon className="h-4 w-4" aria-hidden="true" /> {i + 1}. {info.label}
                  </span>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="h-10 w-10" disabled={i === 0} onClick={() => moveBlock(i, -1)} aria-label="Move up">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10" disabled={i === draft.blocks.length - 1} onClick={() => moveBlock(i, 1)} aria-label="Move down">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="h-10 text-red-600" onClick={() => removeBlock(i)} aria-label={`Delete block ${i + 1}`}>
                      <Trash2 className="h-4 w-4 sm:mr-1" aria-hidden="true" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{info.hint}</p>
                <BlockFields block={block} set={setBlock(i)} token={token} onError={onError} />
              </CardContent>
            </Card>
          );
        })}

        <div className="rounded-lg border bg-muted/40 p-3">
          <p className="mb-2 text-sm font-medium">Add a block</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {BLOCK_TYPES.map((b) => (
              <Button key={b.type} variant="outline" className="h-11 justify-start bg-background" onClick={() => addBlock(b.type)}>
                <b.icon className="h-4 w-4 mr-2 shrink-0" aria-hidden="true" />
                <span className="truncate">{b.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {preview && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Preview</CardTitle>
            <CardDescription>How visitors will see the page (English). Unsaved changes are included.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <h1 className="text-center text-3xl font-bold text-primary">{draft.titleEn || "Page title"}</h1>
            <PageBlocks blocks={payload(draft).blocks} />
          </CardContent>
        </Card>
      )}

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center gap-2 border-t bg-muted/95 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button onClick={save} disabled={busy || (Boolean(draft.id) && !dirty)}>{busy ? "Saving…" : "Save changes"}</Button>
        <Button variant="outline" onClick={() => setPreview((p) => !p)}>
          <Eye className="h-4 w-4 mr-1.5" aria-hidden="true" /> {preview ? "Hide preview" : "Preview"}
        </Button>
        {dirty && !status && <span className="text-sm text-amber-700">Unsaved changes</span>}
        {status && <span role="status" className="text-sm font-medium text-green-700">{status}</span>}
      </div>
    </div>
  );
};

/* ---------------- List of pages ---------------- */

const PagesEditor = ({ token, onError }: Props) => {
  const queryClient = useQueryClient();
  const [pages, setPages] = useState<CustomPage[] | null>(null);
  const [editing, setEditing] = useState<Draft | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const res = await api<CustomPage[]>("/api/admin/pages", {}, token);
    if (!res.success) return onError(res.message ?? "Could not load the pages.");
    setPages(res.data ?? []);
  }, [token, onError]);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (page: CustomPage) => {
    if (!window.confirm(`Delete the page “${page.titleEn}”? Its link will stop working. This cannot be undone.`)) return;
    const res = await api(`/api/admin/pages/${page.id}`, { method: "DELETE" }, token);
    if (!res.success) return onError(res.message ?? "Could not delete the page.");
    setMessage(`Deleted “${page.titleEn}”.`);
    queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
    load();
  };

  const move = async (i: number, by: number) => {
    if (!pages) return;
    const next = [...pages];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    setPages(next);
    const res = await api("/api/admin/pages/order", { method: "POST", body: JSON.stringify({ ids: next.map((p) => p.id) }) }, token);
    if (!res.success) {
      onError(res.message ?? "Could not change the order.");
      return load();
    }
    queryClient.invalidateQueries({ queryKey: PAGES_QUERY_KEY });
  };

  if (editing) {
    return (
      <PageForm
        initial={editing}
        token={token}
        onError={onError}
        // After a save the editor stays open (it keeps the saved page itself); only refresh the list behind it.
        onDone={(saved) => (saved ? load() : setEditing(null))}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Pages</CardTitle>
        <CardDescription>
          Make your own pages, such as Holiday Homework, Book List or School Rules. Each page gets its own address on the website.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={() => { setMessage(""); setEditing(blankDraft()); }}>
          <Plus className="h-4 w-4 mr-1.5" aria-hidden="true" /> Add page
        </Button>
        {message && <p role="status" className="text-sm font-medium text-green-700">{message}</p>}

        {pages === null ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : pages.length === 0 ? (
          <p className="text-muted-foreground">No pages yet. Press “Add page” to make the first one.</p>
        ) : (
          <ul className="space-y-3">
            {pages.map((page, i) => (
              <li key={page.id} className="rounded-lg border bg-background p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-primary">{page.titleEn}</p>
                    <p className="break-all text-sm text-muted-foreground">/p/{page.slug}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge className={page.status === "published" ? "bg-green-100 text-green-900 hover:bg-green-100" : "bg-gray-200 text-gray-700 hover:bg-gray-200"}>
                        {page.status === "published" ? "Published" : "Draft"}
                      </Badge>
                      <Badge variant="outline">{placementLabel(page.placement)}</Badge>
                      <Badge variant="outline">{page.blocks.length} block{page.blocks.length === 1 ? "" : "s"}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <Button size="icon" variant="ghost" className="h-10 w-10" disabled={i === 0} onClick={() => move(i, -1)} aria-label={`Move ${page.titleEn} up`}>
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-10 w-10" disabled={i === pages.length - 1} onClick={() => move(i, 1)} aria-label={`Move ${page.titleEn} down`}>
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="h-10" onClick={() => { setMessage(""); setEditing(toDraft(page)); }}>
                      <Pencil className="h-4 w-4 mr-1.5" aria-hidden="true" /> Edit
                    </Button>
                    {page.status === "published" && (
                      <Button size="sm" variant="outline" className="h-10" asChild>
                        <a href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-1.5" aria-hidden="true" /> View
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-10 text-red-600" onClick={() => remove(page)}>
                      <Trash2 className="h-4 w-4 mr-1.5" aria-hidden="true" /> Delete
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="text-xs text-muted-foreground">The arrows change the order of the links in the menu and footer.</p>
      </CardContent>
    </Card>
  );
};

export default PagesEditor;
