import Link from "next/link";
import type { Article } from "@/lib/types";

/**
 * Breaking News ticker (approved Phase 7 decision #4): the most recently
 * published articles, no is_breaking database field. The "BREAKING" label
 * is a visual convention for "newest published stories". Headlines scroll
 * continuously right-to-left and pause on hover/focus; with
 * prefers-reduced-motion the ticker stays still and scrolls by hand.
 */
export default function BreakingNewsBanner({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  // Rendered twice back-to-back so the loop (translateX 0 -> -50%) is seamless.
  const loop = [...articles, ...articles];
  const duration = Math.max(20, articles.length * 9);

  return (
    <div className="border-b border-border-200 bg-accent-50 print:hidden">
      <div className="container-page flex items-center gap-3 py-2.5 sm:gap-4">
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded bg-accent-600 px-2 py-1 text-xs font-black uppercase tracking-wide text-white">
          <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
          Breaking
        </span>
        <div className="marquee min-w-0 flex-1 overflow-hidden motion-reduce:overflow-x-auto">
          <div className="marquee-track" style={{ animationDuration: `${duration}s` }}>
            {loop.map((article, i) => (
              <Link
                key={`${article.id}-${i}`}
                href={`/articles/${article.slug}`}
                aria-hidden={i >= articles.length ? true : undefined}
                tabIndex={i >= articles.length ? -1 : undefined}
                className="flex shrink-0 items-center whitespace-nowrap text-sm font-semibold text-text-900 hover:text-accent-600 sm:text-base"
              >
                {article.title}
                <span aria-hidden="true" className="mx-6 text-accent-600">
                  &#9679;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
