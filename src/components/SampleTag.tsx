/** Small yellow tag shown only in development next to placeholder content (see src/data/site.ts). */
const SampleTag = ({ show }: { show?: boolean }) =>
  show && import.meta.env.DEV ? (
    <span
      title="Placeholder content. Replace it in src/data/site.ts. It is hidden in the production build."
      className="inline-block rounded bg-yellow-300 px-1.5 py-0.5 text-[10px] font-semibold text-yellow-950 align-middle"
    >
      Sample
    </span>
  ) : null;

export default SampleTag;
