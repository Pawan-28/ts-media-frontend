import Image from "next/image";
import Link from "next/link";
import { listArticles } from "@/lib/api/client";
import { formatDate } from "@/lib/format";
import { normalizeBunnyUrl } from "@/lib/bunnyUrl";

/**
 * "Top News" rail shown beside an article: the most recently published
 * stories, excluding the one being read. Renders nothing if the API call
 * fails or there is nothing else to show.
 */
export default async function TopNewsSidebar({ excludeSlug, limit = 6 }: { excludeSlug: string; limit?: number }) {
  const page = await listArticles({ ordering: "-published_at", pageSize: limit + 1 }).catch(() => null);
  const articles = (page?.results ?? []).filter((a) => a.slug !== excludeSlug).slice(0, limit);
  if (articles.length === 0) return null;

  return (
    <aside aria-labelledby="top-news-heading" className="print:hidden">
      <div className="sticky top-24 rounded-md border border-border-200 bg-surface-0 p-4">
        <h2 id="top-news-heading" className="mb-4 flex items-center gap-3 text-sm font-black uppercase tracking-widest text-brand-900">
          <span aria-hidden className="h-px flex-1 bg-border-200" />
          Top News
          <span aria-hidden className="h-px flex-1 bg-border-200" />
        </h2>
        <ul className="divide-y divide-border-200">
          {articles.map((article, index) => (
            <li key={article.id} className="py-3 first:pt-0 last:pb-0">
              <Link href={`/articles/${article.slug}`} className="group flex gap-3">
                <div className="min-w-0 flex-1">
                  <h3
                    className={`font-bold leading-snug text-text-900 group-hover:text-accent-600 ${
                      index === 0 ? "text-base" : "text-sm"
                    }`}
                  >
                    {article.title}
                  </h3>
                  <p className="mt-1 text-xs text-text-400">{formatDate(article.published_at)}</p>
                </div>
                {article.featured_image_url && (
                  <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded bg-surface-50">
                    <Image
                      src={normalizeBunnyUrl(article.featured_image_url)}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
