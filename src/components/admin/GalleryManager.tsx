import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Link2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { cld } from "@/lib/cloudinary";
import { uploadImage, uploadsEnabled } from "@/lib/upload";

type Photo = { id: number; url: string; caption: string; category: string; created_at: string };

const DEFAULT_CATEGORIES = ["campus", "academics", "events", "sports", "facilities", "celebrations"];

const GalleryManager = ({ token, onError }: { token: string; onError: (message: string) => void }) => {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [canUpload, setCanUpload] = useState<boolean | null>(null);
  const [caption, setCaption] = useState("");
  const [category, setCategory] = useState("events");
  const [link, setLink] = useState("");
  const [progress, setProgress] = useState("");
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    const res = await api<Photo[]>("/api/admin/gallery", {}, token);
    if (res.success) setPhotos(res.data ?? []);
    else onError(res.message ?? "Could not load photos.");
  }, [token, onError]);

  useEffect(() => {
    load();
    uploadsEnabled(token).then(setCanUpload);
  }, [load, token]);

  // Refresh our list and the public gallery after any change.
  const changed = async () => {
    await load();
    queryClient.invalidateQueries({ queryKey: ["gallery"] });
  };

  const save = (url: string, publicId?: string) =>
    api("/api/admin/gallery", { method: "POST", body: JSON.stringify({ url, publicId, caption, category }) }, token);

  const onFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    const list = Array.from(files);
    let done = 0;
    for (const file of list) {
      setProgress(`Uploading ${done + 1} of ${list.length}…`);
      try {
        const { url, publicId } = await uploadImage(file, token);
        const res = await save(url, publicId);
        if (!res.success) throw new Error(res.message);
        done++;
      } catch (err) {
        onError(`${file.name}: ${err instanceof Error ? err.message : "upload failed"}`);
      }
    }
    setProgress(done ? `${done} photo${done > 1 ? "s" : ""} added to the gallery.` : "");
    if (fileInput.current) fileInput.current.value = "";
    await changed();
  };

  const addLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await save(link.trim());
    if (!res.success) return onError(res.message ?? "Could not add photo.");
    setLink("");
    setProgress("Photo added to the gallery.");
    await changed();
  };

  const update = async (id: number, patch: Partial<Pick<Photo, "caption" | "category">>) => {
    const res = await api(`/api/admin/gallery/${id}`, { method: "PATCH", body: JSON.stringify(patch) }, token);
    if (!res.success) onError(res.message ?? "Could not save.");
    await changed();
  };

  const remove = async (photo: Photo) => {
    if (!window.confirm(`Delete this photo${photo.caption ? ` ("${photo.caption}")` : ""} from the website?`)) return;
    const res = await api(`/api/admin/gallery/${photo.id}`, { method: "DELETE" }, token);
    if (!res.success) onError(res.message ?? "Could not delete.");
    await changed();
  };

  const categories = Array.from(new Set([...DEFAULT_CATEGORIES, ...photos.map((p) => p.category)]));
  const shown = filter === "all" ? photos : photos.filter((p) => p.category === filter);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-start">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Add photos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="g-caption">Caption (for all photos in this batch)</Label>
            <Input id="g-caption" value={caption} onChange={(e) => setCaption(e.target.value)} maxLength={200} placeholder="e.g. Annual Sports Day 2026" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="g-category">Category</Label>
            <Input id="g-category" list="g-categories" value={category} onChange={(e) => setCategory(e.target.value)} maxLength={40} />
            <datalist id="g-categories">
              {categories.map((c) => <option key={c} value={c} />)}
            </datalist>
            <p className="text-xs text-muted-foreground">Pick one or type a new category. It becomes a filter button on the Gallery page.</p>
          </div>

          {canUpload !== false ? (
            <>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onFiles(e.target.files)}
              />
              <Button className="w-full h-12 text-base" onClick={() => fileInput.current?.click()} disabled={canUpload === null || progress.startsWith("Uploading")}>
                <ImagePlus className="h-5 w-5 mr-2" aria-hidden="true" />
                Choose photos from phone / computer
              </Button>
            </>
          ) : (
            <p className="rounded bg-amber-100 p-3 text-sm text-amber-900">
              Photo upload is not set up yet (Cloudinary keys missing on the server). You can still add a photo by pasting its link below.
            </p>
          )}
          {progress && <p role="status" className="text-sm font-medium text-green-700">{progress}</p>}

          <form onSubmit={addLink} className="space-y-2 border-t pt-4">
            <Label htmlFor="g-link">…or paste an image link</Label>
            <div className="flex gap-2">
              <Input id="g-link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://…" required />
              <Button type="submit" variant="outline" aria-label="Add photo from link">
                <Link2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <div>
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
          {["all", ...categories.filter((c) => photos.some((p) => p.category === c))].map((c) => (
            <Button key={c} size="sm" variant={filter === c ? "default" : "outline"} className="shrink-0 rounded-full capitalize" onClick={() => setFilter(c)}>
              {c} ({c === "all" ? photos.length : photos.filter((p) => p.category === c).length})
            </Button>
          ))}
        </div>
        {shown.length === 0 && <p className="text-muted-foreground">No photos yet.</p>}
        {shown.length > 0 && (
          <p className="mb-3 text-sm text-muted-foreground">Tap a caption or category to change it (saves automatically), or use the red button to delete a photo.</p>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {shown.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-lg border bg-card">
              <img src={cld(p.url, 400)} alt={p.caption} className="aspect-square w-full object-cover" loading="lazy" />
              <div className="space-y-2 p-2">
                <Input
                  aria-label="Caption"
                  defaultValue={p.caption}
                  placeholder="Caption"
                  className="h-9"
                  onBlur={(e) => e.target.value !== p.caption && update(p.id, { caption: e.target.value })}
                />
                <div className="flex gap-2">
                  <Input
                    aria-label="Category"
                    list="g-categories"
                    defaultValue={p.category}
                    className="h-9"
                    onBlur={(e) => e.target.value && e.target.value !== p.category && update(p.id, { category: e.target.value })}
                  />
                  <Button size="icon" variant="destructive" className="h-9 w-9 shrink-0" onClick={() => remove(p)} aria-label="Delete photo">
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GalleryManager;
