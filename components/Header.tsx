import Link from "next/link";
import { listCategories, listIndustries, listSubcategories } from "@/lib/api/client";
import { buildNavTree } from "@/lib/navTree";
import { getCurrentUser } from "@/lib/auth/currentUser";
import SiteMenu from "@/components/SiteMenu";
import LiveDateTime from "@/components/LiveDateTime";
import SocialLinks from "@/components/SocialLinks";
import { adminLandingPath } from "@/lib/auth/permissions";

const outlineBtn =
  "shrink-0 rounded border border-border-200 px-3 py-1.5 text-sm font-semibold text-text-900 hover:bg-surface-50";
const accentLink = "shrink-0 rounded px-3 py-2 text-sm font-semibold text-accent-600 hover:bg-accent-50";

export default async function Header() {
  const [industries, categories, subcategories, user] = await Promise.all([
    listIndustries().catch(() => []),
    listCategories().catch(() => []),
    listSubcategories().catch(() => []),
    getCurrentUser(),
  ]);
  const navTree = buildNavTree(industries, categories, subcategories);

  return (
    <header className="sticky top-0 z-40 border-b border-border-200 bg-surface-0 text-text-900">
      <div className="border-b border-border-200 bg-surface-50">
        <div className="container-page flex h-9 items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-text-600">Follow us</span>
          <SocialLinks />
        </div>
      </div>
      <div className="container-page">
        <div className="relative flex h-14 items-center justify-between gap-3">
          {/* Left: menu, search, date/time */}
          <div className="flex min-w-0 items-center gap-1 sm:gap-3">
            <SiteMenu industries={navTree} user={user} />
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-10 w-10 items-center justify-center rounded text-text-900 hover:text-accent-600"
            >
              <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-5 w-5">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                />
              </svg>
            </Link>
            <div className="hidden items-center gap-2 whitespace-nowrap text-sm text-text-600 lg:flex">
              <LiveDateTime />
            </div>
          </div>

          <Link
            href="/"
            className="absolute left-1/2 shrink-0 -translate-x-1/2 text-xl font-black tracking-tight text-text-900 sm:text-2xl"
          >
            Truth <span className="text-accent-600">And</span> Social
          </Link>

          {/* Right: E-Paper, Subscribe, account */}
          <div className="flex shrink-0 items-center gap-2">
            <Link href="/epaper" className={outlineBtn}>
              E-Paper
            </Link>
            <Link href="/subscribe" className={`${outlineBtn} hidden md:inline-block`}>
              Subscribe
            </Link>
            <div className="hidden items-center gap-1 md:flex">
              {user ? (
                <>
                  {user.role === "REPORTER" && (
                    <Link href="/reporter/dashboard" className={`${accentLink} hidden xl:inline-block`}>
                      Reporter Dashboard
                    </Link>
                  )}
                  {user.role !== "ADMIN" && adminLandingPath(user) && (
                    <Link href={adminLandingPath(user) as string} className={`${accentLink} hidden xl:inline-block`}>
                      Admin Panel
                    </Link>
                  )}
                  {user.role === "ADMIN" && (
                    <Link href="/admin/dashboard" className={`${accentLink} hidden xl:inline-block`}>
                      Admin Dashboard
                    </Link>
                  )}
                  {(user.role === "USER" || user.role === "SUBSCRIBER") && (
                    <Link href="/dashboard" className={`${accentLink} hidden xl:inline-block`}>
                      My Dashboard
                    </Link>
                  )}
                  <Link
                    href="/account"
                    className="shrink-0 rounded px-3 py-2 text-sm font-semibold text-text-900 hover:bg-surface-50"
                  >
                    {user.first_name || "My account"}
                  </Link>
                </>
              ) : (
                <Link
                  href="/login"
                  className="shrink-0 rounded px-3 py-2 text-sm font-semibold text-text-900 hover:bg-surface-50"
                >
                  Log in
                </Link>
              )}
            </div>
          </div>
        </div>

        <nav
          aria-label="Primary"
          className="hidden items-center gap-1 border-t border-border-200 py-1 md:flex"
        >
          <Link
            href="/"
            className="rounded px-3 py-2 text-sm font-semibold text-text-600 transition-colors hover:bg-surface-50 hover:text-text-900"
          >
            Latest News
          </Link>
          {navTree.map((industry, i) => {
            // Menus for the right half of the bar open leftwards so they
            // never run off the edge of the viewport.
            const alignRight = i >= navTree.length / 2;
            return (
              <div key={industry.href} className="group/ind relative">
                <Link
                  href={industry.href}
                  className="block rounded px-3 py-2 text-sm font-semibold text-text-600 transition-colors hover:bg-surface-50 hover:text-text-900 group-hover/ind:text-text-900"
                >
                  {industry.name}
                </Link>
                {industry.categories.length > 0 && (
                  <ul
                    className={`invisible absolute top-full z-50 min-w-56 rounded-md border border-border-200/60 bg-white/60 py-1 opacity-0 shadow-lg backdrop-blur-md transition-opacity group-focus-within/ind:visible group-focus-within/ind:opacity-100 group-hover/ind:visible group-hover/ind:opacity-100 ${
                      alignRight ? "right-0" : "left-0"
                    }`}
                  >
                    {industry.categories.map((category) => (
                      <li key={category.href} className="group/cat relative">
                        <Link
                          href={category.href}
                          className="flex items-center justify-between gap-4 px-4 py-2 text-sm font-medium text-text-900 hover:bg-white/60 hover:text-accent-600"
                        >
                          {category.name}
                          {category.subcategories.length > 0 && (
                            <span aria-hidden className="text-text-600">
                              {alignRight ? "‹" : "›"}
                            </span>
                          )}
                        </Link>
                        {category.subcategories.length > 0 && (
                          <ul
                            className={`invisible absolute top-0 min-w-52 rounded-md border border-border-200/60 bg-white/60 py-1 opacity-0 shadow-lg backdrop-blur-md transition-opacity group-focus-within/cat:visible group-focus-within/cat:opacity-100 group-hover/cat:visible group-hover/cat:opacity-100 ${
                              alignRight ? "right-full" : "left-full"
                            }`}
                          >
                            {category.subcategories.map((sub) => (
                              <li key={sub.href}>
                                <Link
                                  href={sub.href}
                                  className="block px-4 py-2 text-sm font-medium text-text-900 hover:bg-white/60 hover:text-accent-600"
                                >
                                  {sub.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
