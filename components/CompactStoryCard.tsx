import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/lib/types";
import { normalizeBunnyUrl } from "@/lib/bunnyUrl";

/**
 * Small headline card for the boxed taxonomy sections: bold title and a
 * tag link on the left, thumbnail on the right.
 */
export default function CompactStoryCard({
  article,
  tag,
}: {
  article: Article;
  tag?: { name: string; href: string } | null;
}) {
  return (
    <article className="flex gap-4 rounded-md border border-border-200 bg-surface-0 p-4 transition-shadow hover:shadow-sm">
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-4 text-base font-bold leading-snug sm:text-lg text-text-900">
          <Link href={`/articles/${article.slug}`} className="hover:text-accent-600">
            {article.title}
          </Link>
        </h3>
        {tag && (
          <Link href={tag.href} className="mt-2 inline-block text-sm font-semibold text-info-600 hover:underline">
            {tag.name}
          </Link>
        )}
      </div>
      {article.featured_image_url && (
        <Link
          href={`/articles/${article.slug}`}
          tabIndex={-1}
          aria-hidden="true"
          className="relative h-28 w-36 shrink-0 sm:h-32 sm:w-44 overflow-hidden rounded bg-surface-50"
        >
          <Image
            src={normalizeBunnyUrl(article.featured_image_url)}
            alt=""
            fill
            className="object-cover"
            sizes="176px"
          />
        </Link>
      )}
    </article>
  );
}
