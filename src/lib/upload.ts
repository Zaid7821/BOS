import { api } from "@/lib/api";

type Signature =
  | { enabled: false }
  | { enabled: true; cloudName: string; apiKey: string; folder: string; timestamp: number; signature: string };

/** True when the server has Cloudinary keys, so photos can be uploaded (otherwise only links can be pasted). */
export const uploadsEnabled = async (token: string) => {
  const res = await api<Signature>("/api/admin/upload-signature", {}, token);
  return Boolean(res.success && res.data?.enabled);
};

const MAX_SIDE = 2000;

/** Phone photos are often 4000px+ and several MB; shrink them first so uploads are quick on mobile data. */
const shrink = async (file: File): Promise<Blob> => {
  if (!file.type.startsWith("image/") || file.type === "image/gif") return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
    if (scale === 1 && file.size < 2_000_000) return file;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    return blob ?? file;
  } catch {
    return file; // Format the browser cannot decode (e.g. some HEIC files): let Cloudinary handle it.
  }
};

/** Uploads one image to Cloudinary using a signature from our server. */
export const uploadImage = async (file: File, token: string): Promise<{ url: string; publicId: string }> => {
  const sig = await api<Signature>("/api/admin/upload-signature", {}, token);
  if (!sig.success || !sig.data) throw new Error(sig.message ?? "Could not start the upload.");
  if (!sig.data.enabled) throw new Error("Photo upload is not set up on the server yet. Paste an image link instead.");

  const { cloudName, apiKey, folder, timestamp, signature } = sig.data;
  const form = new FormData();
  form.append("file", await shrink(file), file.name);
  form.append("api_key", apiKey);
  form.append("timestamp", String(timestamp));
  form.append("folder", folder);
  form.append("signature", signature);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: "POST", body: form });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || !body.secure_url) throw new Error(body.error?.message ?? "Upload failed. Please try again.");
  return { url: body.secure_url, publicId: body.public_id };
};
