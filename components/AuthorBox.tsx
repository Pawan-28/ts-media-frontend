import type { ArticleAuthor } from "@/lib/types";

/** "About the Author" card under an article. Shows the bio only when the author has written one. */
export default function AuthorBox({ author }: { author: ArticleAuthor }) {
  const name = author.full_name || author.email;
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <section
      aria-labelledby="about-author-heading"
      className="mt-10 max-w-[850px] rounded-md border border-border-200 bg-surface-50 p-5"
    >
      <div className="flex gap-4">
        <div
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-900 text-sm font-bold text-white"
        >
          {initials || "?"}
        </div>
        <div className="min-w-0">
          <p id="about-author-heading" className="eyebrow text-text-400">
            About the Author
          </p>
          <p className="mt-0.5 text-base font-bold text-text-900">{name}</p>
          {author.bio ? (
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-text-600">{author.bio}</p>
          ) : (
            <p className="mt-2 text-sm text-text-400">Contributor at Truth And Social.</p>
          )}
        </div>
      </div>
    </section>
  );
}
