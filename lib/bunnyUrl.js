/**
 * Canonicalizes the hostname portion of a Bunny.net CDN URL to lowercase,
 * leaving the scheme, port, path, query string and fragment exactly as
 * they were.
 *
 * Why this exists: next/image's `remotePatterns` matches a *configured*
 * hostname against `new URL(src).hostname` - and the WHATWG URL parser
 * that Next uses internally always lowercases a URL's hostname, but the
 * pattern side of that comparison is matched case-sensitively (see
 * node_modules/next/dist/shared/lib/match-remote-pattern.js:
 * `picomatch.makeRe(pattern.hostname).test(url.hostname)`, no
 * `.toLowerCase()` on the pattern). A mixed-case
 * NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST could therefore reject every real
 * image even though the URL's own hostname would already match once
 * lowercased - that mismatch is exactly what caused the
 * "Invalid src prop ... hostname is not configured" crash.
 *
 * The actual fix for that crash is configuring next.config.js with a
 * lowercase hostname (see next.config.js) - once that's true, the
 * matcher above already accepts old mixed-case URLs fine, because
 * `url.hostname` is always lowercased regardless of the source string's
 * casing. This helper is the belt-and-suspenders companion: applying it
 * wherever a Bunny URL is rendered or embedded (an <Image src>, an
 * og:image meta tag, JSON-LD, etc.) keeps the *displayed* URL string
 * itself canonical too, so old ArticleImage/Category/Advertisement rows
 * created before this fix (which may have a mixed-case bunny_url/
 * image_url) render with the same canonical hostname as brand-new
 * uploads, with no database migration or re-upload required.
 *
 * Legacy pull-zone hosts: ArticleImage/Category/Advertisement rows store the
 * FULL public URL that was current when the file was uploaded, so after the
 * Bunny pull zone changed, old rows still carry the previous
 * "<old-zone>.b-cdn.net" host. next/image only optimizes hosts listed in
 * next.config.js (built from NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST), so such a URL
 * makes /_next/image answer HTTP 400 ("url parameter is not allowed"). Any
 * *.b-cdn.net host other than the configured one is therefore rewritten to
 * the canonical host (NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST), keeping the path,
 * filename and query. This only fixes the HOSTNAME - it cannot restore a file
 * that does not exist in the current storage zone (that image will 404).
 * Nothing is rewritten when NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST is not set, and
 * hosts outside *.b-cdn.net are never touched.
 *
 * @param {string} url
 * @returns {string}
 */
function normalizeBunnyUrl(url) {
  const match = /^(https?:\/\/)([^/?#]+)([\s\S]*)$/i.exec(url);
  if (!match) return url;
  const [, scheme, authority, rest] = match;
  let host = authority.toLowerCase();
  const canonical = (process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST || "").trim().toLowerCase();
  if (canonical && host !== canonical && BUNNY_CDN_HOST.test(host)) {
    host = canonical;
  }
  return scheme + host + rest;
}

const BUNNY_CDN_HOST = /^[a-z0-9-]+\.b-cdn\.net$/;

module.exports = { normalizeBunnyUrl };
