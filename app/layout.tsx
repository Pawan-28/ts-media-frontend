import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConditionalChrome from "@/components/ConditionalChrome";
import JsonLd from "@/components/JsonLd";
import { SITE_NAME, SITE_URL, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

// Uses the Inter/system-ui font stack defined in tailwind.config.ts
// (font-sans) rather than next/font/google, so the production build does
// not depend on reaching fonts.googleapis.com at build time - some hosting
// CI environments block that fetch. To self-host Inter instead, add the
// font files under public/fonts and swap font-sans's @font-face in here.

const ADSENSE_CLIENT = "ca-pub-1396209168782274";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: `${SITE_NAME} - independent news and reporting.`,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google AdSense. A plain async <script> in the root layout's <head> (not next/script) so the tag is in the
            server-rendered HTML of every page, where Google's site-verification crawler looks for it. The publisher id
            is public (it is visible in the page source of every AdSense site). */}
        <script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT}`}
          crossOrigin="anonymous"
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <JsonLd data={organizationJsonLd()} />
        <JsonLd data={websiteJsonLd()} />
        <ConditionalChrome>
          <Header />
        </ConditionalChrome>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <ConditionalChrome>
          <Footer />
        </ConditionalChrome>
      </body>
    </html>
  );
}
