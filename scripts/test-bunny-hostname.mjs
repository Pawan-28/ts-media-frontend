// Regression tests for the mixed-case Bunny.net hostname fix (next/image
// "Invalid src prop ... hostname is not configured" crash).
//
// Run with: npm test   (== node --test scripts/)
//
// These exercise Next's *actual* remotePatterns matcher
// (node_modules/next/dist/shared/lib/match-remote-pattern.js) and the
// project's *actual* next.config.js / lib/bunnyUrl.js, rather than
// re-implementing the matching logic - so a regression in either file
// fails this test, not just a copy of the logic.

import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const require = createRequire(import.meta.url);
const projectRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

// next.config.js reads NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST from process.env at
// require-time, the same way `next build`/`next dev` do. Load the value out
// of .env.local (if present) so this test reflects the same config the app
// actually runs with, without depending on next itself to load dotenv files.
function loadEnvLocalHost() {
  try {
    const envText = readFileSync(path.join(projectRoot, ".env.local"), "utf-8");
    const match = envText.match(/^NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST=(.*)$/m);
    return match ? match[1].trim() : undefined;
  } catch {
    return undefined;
  }
}

const envHost = loadEnvLocalHost();
if (envHost && !process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST) {
  process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST = envHost;
}

const { matchRemotePattern } = require("next/dist/shared/lib/match-remote-pattern.js");
const nextConfig = require(path.join(projectRoot, "next.config.js"));
const { normalizeBunnyUrl } = require(path.join(projectRoot, "lib", "bunnyUrl.js"));

const remotePatterns = nextConfig.images.remotePatterns;
assert.ok(remotePatterns && remotePatterns.length > 0, "next.config.js must define images.remotePatterns");
const bunnyPattern = remotePatterns[0];

// The one configured host (NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST).
const CANONICAL_HOSTNAME = bunnyPattern.hostname;
const MIXED_CASE_HOST = [...CANONICAL_HOSTNAME].map((c, i) => (i % 2 ? c.toUpperCase() : c)).join("");
const MIXED_CASE_URL = `https://${MIXED_CASE_HOST}/articles/2026/09/abc123-cover.jpg`;
const LOWERCASE_URL = `https://${CANONICAL_HOSTNAME}/articles/2026/09/abc123-cover.jpg`;

test("next.config.js remotePatterns hostname is the canonical lowercase Bunny host", () => {
  const configured = (process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST || "placeholder-zone.b-cdn.net").trim().toLowerCase();
  assert.equal(bunnyPattern.hostname, configured);
  assert.equal(bunnyPattern.hostname, bunnyPattern.hostname.toLowerCase(), "configured hostname must be lowercase");
});

test("mixed-case Bunny URL matches remotePatterns (renders successfully)", () => {
  const url = new URL(MIXED_CASE_URL);
  assert.equal(
    matchRemotePattern(bunnyPattern, url),
    true,
    "a mixed-case Bunny URL (e.g. an existing ArticleImage.bunny_url from before this fix) must still match"
  );
});

test("lowercase Bunny URL matches remotePatterns (renders successfully)", () => {
  const url = new URL(LOWERCASE_URL);
  assert.equal(matchRemotePattern(bunnyPattern, url), true);
});

test("existing ArticleImage with mixed-case bunny_url does not crash next/image config matching", () => {
  // Simulates exactly the reported crash: an ArticleImage row's stored
  // bunny_url still has the old mixed-case host. new URL(...) + the
  // matcher must not throw and must accept it.
  assert.doesNotThrow(() => {
    const url = new URL(MIXED_CASE_URL);
    const matched = matchRemotePattern(bunnyPattern, url);
    assert.equal(matched, true);
  });
});

test("normalizeBunnyUrl canonicalizes the hostname consistently, path untouched", () => {
  const fromMixed = normalizeBunnyUrl(MIXED_CASE_URL);
  const fromLower = normalizeBunnyUrl(LOWERCASE_URL);
  assert.equal(fromMixed, LOWERCASE_URL, "mixed-case input normalizes to the canonical lowercase URL");
  assert.equal(fromLower, LOWERCASE_URL, "already-lowercase input is unchanged");
  assert.equal(fromMixed, fromLower, "both inputs normalize to the exact same URL");
  assert.ok(fromMixed.endsWith("/articles/2026/09/abc123-cover.jpg"), "path is preserved exactly");
});

test("untrusted external image hosts are still rejected", () => {
  const url = new URL("https://evil.example.com/articles/2026/09/abc123-cover.jpg");
  assert.equal(matchRemotePattern(bunnyPattern, url), false);
});

// ---------------------------------------------------------------------------
// Legacy pull-zone hosts: rows saved while an older Bunny pull zone was active
// keep that zone's host in their stored URL. normalizeBunnyUrl must rewrite the
// HOSTNAME to the canonical configured host (so /_next/image accepts it) while
// preserving the path, filename and query - and must never touch other hosts.
// ---------------------------------------------------------------------------

const NEW_HOST = "truth-social-media.b-cdn.net";
const OLD_HOST = "truth-social-images-cdn.b-cdn.net";

/** Runs fn with NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST temporarily set (undefined = unset), then restores it. */
function withBunnyEnv(value, fn) {
  const previous = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST;
  if (value === undefined) delete process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST;
  else process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST = value;
  try {
    return fn();
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST;
    else process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE_HOST = previous;
  }
}

test("old-host Bunny URL is rewritten to the canonical host; path and filename are preserved", () => {
  const old = `https://${OLD_HOST}/articles/haaland-workload-raises-concerns/3b70928b94d44ed09fb4d0fbc3bf9434.jpg`;
  withBunnyEnv(NEW_HOST, () => {
    assert.equal(
      normalizeBunnyUrl(old),
      `https://${NEW_HOST}/articles/haaland-workload-raises-concerns/3b70928b94d44ed09fb4d0fbc3bf9434.jpg`
    );
  });
});

test("mixed-case old host is rewritten too, and the query string is kept", () => {
  withBunnyEnv(NEW_HOST, () => {
    assert.equal(
      normalizeBunnyUrl("https://Truth-Social-Images-CDN.b-cdn.net/articles/a/b.jpg?v=2#x"),
      `https://${NEW_HOST}/articles/a/b.jpg?v=2#x`
    );
  });
});

test("a URL already on the new host is left unchanged", () => {
  const url = `https://${NEW_HOST}/articles/ai/47685be7391e41508d3fe1cb85477453.jpg`;
  withBunnyEnv(NEW_HOST, () => assert.equal(normalizeBunnyUrl(url), url));
});

test("a rewritten old-host URL is accepted by next/image remotePatterns (no HTTP 400 from /_next/image)", () => {
  const pattern = { protocol: "https", hostname: NEW_HOST };
  const old = `https://${OLD_HOST}/articles/x/y.jpg`;
  assert.equal(matchRemotePattern(pattern, new URL(old)), false, "the raw old-host URL is what the optimizer rejects");
  withBunnyEnv(NEW_HOST, () => {
    assert.equal(matchRemotePattern(pattern, new URL(normalizeBunnyUrl(old))), true);
  });
});

test("non-Bunny hosts are never rewritten", () => {
  withBunnyEnv(NEW_HOST, () => {
    assert.equal(normalizeBunnyUrl("https://evil.example.com/a.jpg"), "https://evil.example.com/a.jpg");
    assert.equal(normalizeBunnyUrl("https://b-cdn.net.evil.com/a.jpg"), "https://b-cdn.net.evil.com/a.jpg");
  });
});

test("nothing is rewritten when no Bunny host is configured (only the hostname case is normalized)", () => {
  withBunnyEnv(undefined, () => {
    assert.equal(normalizeBunnyUrl(`https://${OLD_HOST}/a.jpg`), `https://${OLD_HOST}/a.jpg`);
  });
});
