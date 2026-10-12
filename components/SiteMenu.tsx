"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { CurrentUser } from "@/lib/types";
import type { NavIndustry } from "@/lib/navTree";
import SearchBox from "@/components/SearchBox";
import { adminLandingPath } from "@/lib/auth/permissions";

const topLink = "rounded px-2 py-2.5 text-sm font-semibold text-text-600 hover:bg-surface-50 hover:text-text-900";
const accentLink = "rounded px-2 py-2.5 text-sm font-semibold text-accent-600 hover:bg-accent-50";

/**
 * Hamburger button (shown at every screen size) that opens a left-hand
 * drawer with the whole site: search, every Industry > Category >
 * Subcategory, E-Paper, the signed-in user's dashboards and static pages.
 * A client component so Header itself can stay a server component.
 */
export default function SiteMenu({
  industries,
  user,
}: {
  industries: NavIndustry[];
  user: CurrentUser | null;
}) {
  const [open, setOpen] = useState(false);
  // hrefs of the industries / categories whose children are expanded
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (href: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(href)) next.delete(href);
      else next.add(href);
      return next;
    });
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="site-menu-panel"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded text-text-900 hover:text-accent-600"
      >
        <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={close} aria-hidden />
          <div
            id="site-menu-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="absolute left-0 top-0 flex h-full w-[340px] max-w-[88vw] flex-col overflow-y-auto bg-surface-0 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border-200 px-4 py-3">
              <span className="text-lg font-black tracking-tight text-text-900">
                Truth <span className="text-accent-600">And</span> Social
              </span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={close}
                className="flex h-9 w-9 items-center justify-center rounded text-text-900 hover:text-accent-600"
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={2} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 pt-4">
              <SearchBox compact onNavigate={close} />
            </div>

            <nav aria-label="Primary" className="mt-2 flex flex-col px-2">
              <Link href="/" onClick={close} className={topLink}>
                Latest News
              </Link>
              <Link href="/epaper" onClick={close} className={topLink}>
                E-Paper
              </Link>

              {industries.map((industry) => (
                <div key={industry.href}>
                  <div className="flex items-center">
                    <Link href={industry.href} onClick={close} className={`flex-1 ${topLink}`}>
                      {industry.name}
                    </Link>
                    {industry.categories.length > 0 && (
                      <ExpandButton
                        label={industry.name}
                        expanded={expanded.has(industry.href)}
                        onClick={() => toggle(industry.href)}
                      />
                    )}
                  </div>
                  {expanded.has(industry.href) && (
                    <div className="ml-3 border-l border-border-200 pl-2">
                      {industry.categories.map((category) => (
                        <div key={category.href}>
                          <div className="flex items-center">
                            <Link
                              href={category.href}
                              onClick={close}
                              className="flex-1 rounded px-2 py-2 text-sm font-medium text-text-600 hover:bg-surface-50 hover:text-text-900"
                            >
                              {category.name}
                            </Link>
                            {category.subcategories.length > 0 && (
                              <ExpandButton
                                label={category.name}
                                expanded={expanded.has(category.href)}
                                onClick={() => toggle(category.href)}
                              />
                            )}
                          </div>
                          {expanded.has(category.href) && (
                            <div className="ml-3 border-l border-border-200 pl-2">
                              {category.subcategories.map((sub) => (
                                <Link
                                  key={sub.href}
                                  href={sub.href}
                                  onClick={close}
                                  className="block rounded px-2 py-2 text-sm text-text-600 hover:bg-surface-50 hover:text-text-900"
                                >
                                  {sub.name}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>

            <div className="mt-2 flex flex-col gap-1 border-t border-border-200 px-2 pt-3">
              {user ? (
                <>
                  {user.role === "REPORTER" && (
                    <Link href="/reporter/dashboard" onClick={close} className={accentLink}>
                      Reporter Dashboard
                    </Link>
                  )}
                  {user.role !== "ADMIN" && adminLandingPath(user) && (
                    <Link href={adminLandingPath(user) as string} onClick={close} className={accentLink}>
                      Admin Panel
                    </Link>
                  )}
                  {user.role === "ADMIN" && (
                    <Link href="/admin/dashboard" onClick={close} className={accentLink}>
                      Admin Dashboard
                    </Link>
                  )}
                  {(user.role === "USER" || user.role === "SUBSCRIBER") && (
                    <Link href="/dashboard" onClick={close} className={accentLink}>
                      My Dashboard
                    </Link>
                  )}
                  <Link href="/account" onClick={close} className={topLink}>
                    My account
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={close} className={topLink}>
                    Log in
                  </Link>
                  <Link href="/register" onClick={close} className={topLink}>
                    Create account
                  </Link>
                </>
              )}
              <Link
                href="/subscribe"
                onClick={close}
                className="mt-1 rounded bg-accent-600 px-2 py-2.5 text-center text-sm font-semibold text-white hover:bg-accent-700"
              >
                Subscribe
              </Link>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 border-t border-border-200 px-4 py-4 text-xs text-text-600">
              <Link href="/about" onClick={close} className="hover:text-text-900">About</Link>
              <Link href="/contact" onClick={close} className="hover:text-text-900">Contact</Link>
              <Link href="/advertise" onClick={close} className="hover:text-text-900">Advertise</Link>
              <Link href="/privacy" onClick={close} className="hover:text-text-900">Privacy</Link>
              <Link href="/terms" onClick={close} className="hover:text-text-900">Terms</Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function ExpandButton({
  label,
  expanded,
  onClick,
}: {
  label: string;
  expanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-expanded={expanded}
      aria-label={`${expanded ? "Collapse" : "Expand"} ${label}`}
      onClick={onClick}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded text-text-600 hover:bg-surface-50"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth={2}
        stroke="currentColor"
        className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
      </svg>
    </button>
  );
}
