import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { listArticlesForDate } from "@/lib/api/client";
import type { Article } from "@/lib/types";
import PrintButton from "@/components/PrintButton";
import { normalizeBunnyUrl } from "@/lib/bunnyUrl";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "E-Paper",
  description: "Read the day's edition of Truth And Social in newspaper layout.",
};

interface Props {
  searchParams: { date?: string };
}

const IST = "Asia/Kolkata";

/** Today's calendar date in IST as YYYY-MM-DD. */
function todayIST(): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: IST });
}

function isValidDate(value: string | undefined): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function shiftDay(date: string, days: number): string {
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function longDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function groupByCategory(articles: Article[]): { name: string; slug: string | null; articles: Article[] }[] {
  const groups = new Map<string, { name: string; slug: string | null; articles: Article[] }>();
  for (const article of articles) {
    const key = article.category?.slug ?? "_other";
    const group = groups.get(key) ?? {
      name: article.category?.name ?? "More News",
      slug: article.category?.slug ?? null,
      articles: [],
    };
    group.articles.push(article);
    groups.set(key, group);
  }
  return Array.from(groups.values());
}

export default async function EPaperPage({ searchParams }: Props) {
  const today = todayIST();
  const requested = isValidDate(searchParams.date) ? searchParams.date : today;
  const date = requested > today ? today : requested;

  const articles = await listArticlesForDate(date).catch(() => [] as Article[]);
  const [lead, ...rest] = articles;
  const sections = groupByCategory(rest);
  const prevDate = shiftDay(date, -1);
  const nextDate = shiftDay(date, 1);
  const hasNext = nextDate <= today;

  return (
    <div className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
      {/* Masthead */}
      <header className="border-b-4 border-double border-text-900 pb-4 text-center">
        <p className="eyebrow text-text-400">E-Paper</p>
        <h1 className="mt-1 font-serif text-4xl font-black tracking-tight text-text-900 sm:text-6xl">
          Truth <span className="text-accent-600">And</span> Social
        </h1>
        <p className="mt-2 text-sm font-semibold text-text-600">{longDate(date)}</p>
      </header>

      {/* Edition controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-200 py-3 text-sm print:hidden">
        <div className="flex items-center gap-2">
          <Link href={`/epaper?date=${prevDate}`} className="btn-ghost !px-3 !py-1.5 text-xs">
            &larr; Previous day
          </Link>
          {hasNext ? (
            <Link href={`/epaper?date=${nextDate}`} className="btn-ghost !px-3 !py-1.5 text-xs">
              Next day &rarr;
            </Link>
          ) : (
            <span className="px-3 py-1.5 text-xs text-text-400">Latest edition</span>
          )}
        </div>
        <form action="/epaper" method="get" className="flex items-center gap-2">
          <label htmlFor="epaper-date" className="text-xs text-text-600">
            Jump to date
          </label>
          <input
            id="epaper-date"
            type="date"
            name="date"
            defaultValue={date}
            max={today}
            className="rounded border border-border-200 px-2 py-1 text-xs"
          />
          <button type="submit" className="btn-ghost !px-3 !py-1.5 text-xs">
            Go
          </button>
        </form>
        <PrintButton />
      </div>

      {articles.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-semibold text-text-900">No edition published for {longDate(date)}.</p>
          <p className="mt-2 text-sm text-text-600">Try another date, or read the latest news on the home page.</p>
          <Link href="/" className="btn-primary mt-5 inline-flex">
            Latest News
          </Link>
        </div>
      ) : (
        <>
          {/* Front page lead story */}
          {lead && (
            <section className="grid gap-6 border-b border-border-200 py-6 md:grid-cols-5" aria-label="Lead story">
              <div className="md:col-span-3">
                {lead.category && <p className="eyebrow text-accent-600">{lead.category.name}</p>}
                <h2 className="mt-1 font-serif text-3xl font-black leading-tight text-text-900 sm:text-4xl">
                  <Link href={`/articles/${lead.slug}`} className="hover:text-accent-600">
                    {lead.title}
                  </Link>
                </h2>
                {lead.excerpt && <p className="mt-3 text-base leading-relaxed text-text-600">{lead.excerpt}</p>}
                <p className="mt-3 text-xs text-text-400">By {lead.author.full_name || lead.author.email}</p>
                <Link href={`/articles/${lead.slug}`} className="mt-3 inline-block text-sm font-semibold text-accent-600">
                  Read full story &rarr;
                </Link>
              </div>
              {lead.featured_image_url && (
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-50 md:col-span-2">
                  <Image
                    src={normalizeBunnyUrl(lead.featured_image_url)}
                    alt={lead.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 480px"
                    priority
                  />
                </div>
              )}
            </section>
          )}

          {/* Remaining stories, one block per category, laid out in newspaper columns */}
          {sections.map((section) => (
            <section key={section.slug ?? "other"} className="border-b border-border-200 py-6">
              <h2 className="mb-4 border-b-2 border-text-900 pb-1 text-sm font-black uppercase tracking-widest text-text-900">
                {section.slug ? (
                  <Link href={`/category/${section.slug}`} className="hover:text-accent-600">
                    {section.name}
                  </Link>
                ) : (
                  section.name
                )}
              </h2>
              <div className="gap-8 sm:columns-2 lg:columns-3 [column-rule:1px_solid_#E2E8F0]">
                {section.articles.map((article) => (
                  <article key={article.id} className="mb-6 break-inside-avoid">
                    {article.featured_image_url && (
                      <div className="relative mb-2 aspect-[16/10] w-full overflow-hidden bg-surface-50">
                        <Image
                          src={normalizeBunnyUrl(article.featured_image_url)}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, 380px"
                        />
                      </div>
                    )}
                    <h3 className="font-serif text-lg font-bold leading-snug text-text-900">
                      <Link href={`/articles/${article.slug}`} className="hover:text-accent-600">
                        {article.title}
                      </Link>
                    </h3>
                    {article.excerpt && (
                      <p className="mt-1 text-sm leading-relaxed text-text-600">{article.excerpt}</p>
                    )}
                    <p className="mt-1 text-xs text-text-400">By {article.author.full_name || article.author.email}</p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
