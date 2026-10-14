import type { ReactNode } from "react";

/**
 * Shared layout for the About / Contact / Advertise / Privacy / Terms pages: eyebrow, title, short lead
 * paragraph, optional "last updated" line, then the body in the site's article typography.
 */
export default function StaticPage({
  eyebrow,
  title,
  lead,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-page max-w-3xl py-12 sm:py-16">
      <header className="border-b border-border-200 pb-8">
        <span className="eyebrow text-accent-600">{eyebrow}</span>
        <h1 className="headline-lg mt-1 text-text-900">{title}</h1>
        {lead && <p className="mt-4 text-lg leading-relaxed text-text-600">{lead}</p>}
        {updated && <p className="mt-3 text-sm text-text-400">Last updated: {updated}</p>}
      </header>
      <div className="article-body mt-8">{children}</div>
    </div>
  );
}
