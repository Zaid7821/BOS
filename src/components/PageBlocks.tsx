import { Link } from "react-router-dom";
import { ExternalLink, FileText, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cld, cldSrcSet } from "@/lib/cloudinary";
import { youtubeId } from "@/hooks/useSiteContent";
import { pick, type PageBlock } from "@/hooks/useCustomPages";
import { useLanguage } from "@/lib/i18n";

/** Phones: one card per row (no sideways scrolling). Larger screens: a normal table. First row = headings. */
const BlockTable = ({ rows }: { rows: string[][] }) => {
  const [head, ...body] = rows;
  const width = Math.max(...rows.map((r) => r.length));
  const cells = (r: string[]) => Array.from({ length: width }, (_, i) => r[i] ?? "");
  if (!body.length) body.push([]); // a table with only headings still shows them

  return (
    <>
      <div className="space-y-3 md:hidden">
        {body.map((r, i) => (
          <dl key={i} className="rounded-lg border border-primary/10 bg-card p-4 shadow-school-sm space-y-1.5 text-sm">
            {cells(r).map((value, c) => (
              <div key={c} className="flex justify-between gap-4 border-t border-border/60 pt-1.5 first:border-0 first:pt-0">
                <dt className="text-muted-foreground">{head[c]}</dt>
                <dd className="text-right font-medium">{value || "—"}</dd>
              </div>
            ))}
          </dl>
        ))}
      </div>
      <div className="hidden md:block overflow-x-auto rounded-lg border border-primary/10 shadow-school-sm">
        <table className="w-full text-left">
          <thead className="bg-primary text-primary-foreground">
            <tr>{cells(head).map((h, c) => <th key={c} className="px-4 py-3">{h}</th>)}</tr>
          </thead>
          <tbody>
            {body.map((r, i) => (
              <tr key={i} className="border-b last:border-0 even:bg-muted/50 align-top">
                {cells(r).map((value, c) => <td key={c} className="px-4 py-3">{value}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

const PageBlockView = ({ block, first }: { block: PageBlock; first: boolean }) => {
  const { lang, t } = useLanguage();

  switch (block.type) {
    case "heading":
      return <h2 className="pt-2 text-2xl md:text-3xl font-bold text-primary">{pick(lang, block.text, block.textHi)}</h2>;

    case "paragraph":
      return <p className="whitespace-pre-line text-base md:text-lg leading-relaxed text-foreground/90">{pick(lang, block.text, block.textHi)}</p>;

    case "notice":
      return (
        <div className="flex gap-3 rounded-lg border-l-4 border-secondary bg-secondary/15 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
          <p className="whitespace-pre-line font-medium">{pick(lang, block.text, block.textHi)}</p>
        </div>
      );

    case "image": {
      const caption = pick(lang, block.caption, block.captionHi);
      return (
        <figure>
          <img
            src={cld(block.url, 1200)}
            srcSet={cldSrcSet(block.url)}
            sizes="(min-width: 1024px) 896px, 100vw"
            alt={caption}
            loading={first ? "eager" : "lazy"}
            className="w-full rounded-lg shadow-school-sm"
          />
          {caption && <figcaption className="mt-2 text-center text-sm text-muted-foreground">{caption}</figcaption>}
        </figure>
      );
    }

    case "document":
      return (
        <Button variant="outline" className="h-auto min-h-11 whitespace-normal py-2 text-left" asChild>
          <a href={block.url} target="_blank" rel="noopener noreferrer">
            <FileText className="h-5 w-5 mr-2 shrink-0 text-primary" aria-hidden="true" />
            {pick(lang, block.label, block.labelHi) || t("pages.openDocument")}
          </a>
        </Button>
      );

    case "button": {
      const label = pick(lang, block.label, block.labelHi);
      return (
        <Button variant="hero" className="h-auto min-h-11 whitespace-normal py-2" asChild>
          {block.url.startsWith("/") ? (
            <Link to={block.url}>{label}</Link>
          ) : (
            <a href={block.url} target="_blank" rel="noopener noreferrer">
              {label}
              <ExternalLink className="h-4 w-4 ml-2 shrink-0" aria-hidden="true" />
            </a>
          )}
        </Button>
      );
    }

    case "video": {
      const id = youtubeId(block.url);
      if (!id) return null;
      return (
        <div className="aspect-video overflow-hidden rounded-lg shadow-school-sm">
          <iframe
            className="h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title="Video"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    case "table":
      return block.rows.length ? <BlockTable rows={block.rows} /> : null;

    default:
      return null;
  }
};

/** Shows a staff-made page's blocks. Used by the public page and by the admin preview. */
const PageBlocks = ({ blocks }: { blocks: PageBlock[] }) => (
  <div className="space-y-6">
    {/* Each block in its own box, so buttons never end up side by side */}
    {blocks.map((block, i) => (
      <div key={i}>
        <PageBlockView block={block} first={i === 0} />
      </div>
    ))}
  </div>
);

export default PageBlocks;
