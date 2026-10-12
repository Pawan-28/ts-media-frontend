"use client";

/**
 * Opens the browser's print dialog for the current article page. The
 * site chrome, ads, share buttons and sidebar are hidden for print via the
 * `@media print` rules in app/globals.css.
 */
export default function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-ghost !px-3 !py-1.5 text-xs"
      aria-label="Print this article"
    >
      Print
    </button>
  );
}
