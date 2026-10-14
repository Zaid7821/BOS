/**
 * Adds automatic format/quality (and optional width) to a Cloudinary URL so
 * images load as small WebP/AVIF files on mobile data. Non-Cloudinary URLs
 * are returned unchanged.
 */
export const cld = (url: string, width?: number) => {
  if (!url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  const transforms = ["f_auto", "q_auto", width ? `w_${width},c_limit` : ""].filter(Boolean).join(",");
  return url.replace("/upload/", `/upload/${transforms}/`);
};

/**
 * Builds a srcSet so phones download a small copy and big screens a sharp one.
 * Use with a `sizes` attribute describing how wide the image is shown.
 */
export const cldSrcSet = (url: string, widths: number[] = [400, 800, 1200]) =>
  url.includes("res.cloudinary.com") ? widths.map((w) => `${cld(url, w)} ${w}w`).join(", ") : undefined;
