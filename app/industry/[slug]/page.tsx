import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getIndustryBySlug, listArticles, listCategoriesByIndustry } from "@/lib/api/client";
import { absoluteUrl, categoryPath, industryPath, subcategoryPath, industryBreadcrumb, taxonomyBreadcrumbItems } from "@/lib/seo";
import ArticleCard from "@/components/ArticleCard";
import CompactStoryCard from "@/components/CompactStoryCard";
import JsonLd from "@/components/JsonLd";
import Breadcrumbs from "@/components/Breadcrumbs";

export const revalidate = 60;

// The API pages at its own fixed size; boxes just show the newest few.
const BOX_SIZE = 6;

interface Props {
  params: { slug: string };
  searchParams: { page?: string; all?: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const industry = await getIndustryBySlug(params.slug);
  // Call notFound() here too, not just in the page component below: Next
  // determines the response status during metadata generation, so if only
  // the page body calls notFound() the response can still ship as a 200.
  if (!industry || !industry.is_active) notFound();

  const title = industry.name;
  const description = industry.description || `Latest ${industry.name} news and articles.`;
  const url = absoluteUrl(industryPath(industry.slug));

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { title, description },
  };
}

export default async function IndustryPage({ params, searchParams }: Props) {
  const industry = await getIndustryBySlug(params.slug);
  if (!industry || !industry.is_active) notFound();

  const showAll = searchParams.all === "1" || Boolean(searchParams.page);
  const currentPage = Number(searchParams.page) || 1;
  const [page, categories] = await Promise.all([
    listArticles({
      industrySlug: industry.slug,
      ordering: "-published_at",
      page: currentPage,
    }),
    listCategoriesByIndustry(industry.slug),
  ]);
  const activeCategories = categories.filter((c) => c.is_active);

  // One box per category (newest articles across its subcategories). Only
  // needed for the overview, not the full paginated list.
  const categoryBoxes = showAll
    ? []
    : (
        await Promise.all(
          activeCategories.map(async (category) => {
            const res = await listArticles({ categorySlug: category.slug, ordering: "-published_at" }).catch(
              () => null
            );
            return { category, articles: (res?.results ?? []).slice(0, BOX_SIZE) };
          })
        )
      ).filter((box) => box.articles.length > 0);

  const allHref = `${industryPath(industry.slug)}?all=1`;

  return (
    <div className="container-page section-stack py-8 sm:py-10">
      <JsonLd data={industryBreadcrumb(industry)} />
      <Breadcrumbs items={taxonomyBreadcrumbItems({ industry })} />
      <header className="border-b border-border-200 pb-6">
        <span className="eyebrow text-accent-600">Industry</span>
        <h1 className="headline-lg mt-1 text-text-900">{industry.name}</h1>
        {industry.description && (
          <p className="mt-2 max-w-prose text-text-600">{industry.description}</p>
        )}
        {activeCategories.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {activeCategories.map((category) => (
              <Link
                key={category.slug}
                href={categoryPath(category.slug)}
                className="badge bg-surface-50 text-text-600 hover:text-accent-600"
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </header>

      {page.results.length === 0 ? (
        <p className="empty-state">No published articles in this industry yet.</p>
      ) : showAll ? (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {page.results.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>

          {(page.next || page.previous) && (
            <nav aria-label="Pagination" className="flex items-center justify-center gap-4 pt-4">
              {page.previous ? (
                <a href={`${industryPath(industry.slug)}?page=${currentPage - 1}`} className="btn-secondary">
                  Previous
                </a>
              ) : (
                <span />
              )}
              <span className="text-sm text-text-400">Page {currentPage}</span>
              {page.next && (
                <a href={`${industryPath(industry.slug)}?page=${currentPage + 1}`} className="btn-secondary">
                  Next
                </a>
              )}
            </nav>
          )}
        </>
      ) : (
        <>
          {/* Box 1: the industry as a whole (every category and subcategory) */}
          <section aria-labelledby="industry-news-heading" className="rounded-md border border-border-200 bg-surface-50/60 p-4 sm:p-6">
            <h2 id="industry-news-heading" className="mb-4 text-2xl font-black text-text-900">
              {industry.name} News
            </h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {page.results.slice(0, BOX_SIZE).map((article) => (
                <CompactStoryCard
                  key={article.id}
                  article={article}
                  tag={article.category ? { name: article.category.name, href: categoryPath(article.category.slug) } : null}
                />
              ))}
            </div>
            {(page.next || page.results.length > BOX_SIZE) && (
              <div className="mt-5 text-center">
                <Link href={allHref} className="btn-primary px-8">
                  View All
                </Link>
              </div>
            )}
          </section>

          {/* Then one box per category, showing its subcategories' articles */}
          {categoryBoxes.map(({ category, articles }) => (
            <section
              key={category.slug}
              aria-labelledby={`cat-${category.slug}-heading`}
              className="rounded-md border border-border-200 bg-surface-50/60 p-4 sm:p-6"
            >
              <h2
                id={`cat-${category.slug}-heading`}
                className="mb-4 flex items-center gap-3 text-sm font-black uppercase tracking-widest text-brand-900"
              >
                <span aria-hidden className="h-px flex-1 bg-border-200" />
                <Link href={categoryPath(category.slug)} className="hover:text-accent-600">
                  {category.name}
                </Link>
                <span aria-hidden className="h-px flex-1 bg-border-200" />
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {articles.map((article) => (
                  <CompactStoryCard
                    key={article.id}
                    article={article}
                    tag={
                      article.subcategory
                        ? {
                            name: article.subcategory.name,
                            href: subcategoryPath(category.slug, article.subcategory.slug),
                          }
                        : null
                    }
                  />
                ))}
              </div>
              <div className="mt-5 text-center">
                <Link href={categoryPath(category.slug)} className="btn-primary px-8">
                  View All
                </Link>
              </div>
            </section>
          ))}
        </>
      )}
    </div>
  );
}
