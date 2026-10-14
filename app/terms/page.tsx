import type { Metadata } from "next";
import Link from "next/link";
import StaticPage from "@/components/StaticPage";
import { CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/siteInfo";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms that apply when you use ${SITE_NAME}.`,
};

export default function TermsPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Terms of Use"
      lead={`Please read these terms carefully. By using ${SITE_NAME} you agree to them.`}
      updated={LEGAL_UPDATED}
    >
      <h2>1. Acceptance of these terms</h2>
      <p>
        These Terms of Use apply to your use of this website and its services, operated by TS Publication
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By accessing or using the site you agree to
        these terms and to our <Link href="/privacy">Privacy Policy</Link>. If you do not agree, please do not
        use the site.
      </p>

      <h2>2. Our content</h2>
      <p>
        The articles, images, graphics, logos and other material on the site are owned by us or used with
        permission and are protected by copyright and other laws. You may read and share links to our content and
        quote short extracts with clear credit and a link back to the original article. You may not copy,
        republish, sell or systematically scrape our content, or use it to train automated systems, without our
        written permission.
      </p>

      <h2>3. Accounts</h2>
      <p>
        To use some features you need an account. You must give accurate information, keep your password
        confidential and tell us promptly if you think your account has been misused. You are responsible for
        activity under your account.
      </p>

      <h2>4. Subscriptions and payments</h2>
      <p>
        Some content is available to subscribers only. Plans, prices, the access period and any refund terms are
        shown when you subscribe. Payments are processed securely by our payment provider, and your access begins
        once payment is confirmed. Access to subscriber content is personal to you and may not be shared.
      </p>

      <h2>5. Comments and user content</h2>
      <p>
        You are responsible for what you post. By posting a comment you grant us a non-exclusive, worldwide,
        royalty-free right to display it on the site. Comments must not be unlawful, defamatory, abusive,
        discriminatory, misleading or spam, and must not infringe anyone else&rsquo;s rights. We may remove any
        comment, and suspend any account, that breaches these terms.
      </p>

      <h2>6. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the site unlawfully or to harm others;</li>
        <li>attempt to gain unauthorised access to the site, accounts or systems, or interfere with their operation;</li>
        <li>use bots, scrapers or other automated means to collect content or data without permission;</li>
        <li>upload malicious code or overload the site.</li>
      </ul>

      <h2>7. Third-party links, embeds and advertising</h2>
      <p>
        The site may contain links to, embedded content from and advertisements by third parties. We do not
        control or endorse them and are not responsible for their content, products or practices. Dealings with
        advertisers or other third parties are solely between you and them.
      </p>

      <h2>8. Accuracy and corrections</h2>
      <p>
        We work hard to publish accurate and timely news, but news develops quickly and we cannot guarantee that
        every item is complete or error-free at all times. If you find an error, please{" "}
        <Link href="/contact">tell us</Link> and we will review and correct it where needed.
      </p>

      <h2>9. No professional advice</h2>
      <p>
        Content on the site, including business, stock market and finance coverage, is provided for general
        information only. It is not financial, investment, legal or other professional advice, and you should
        seek independent advice before making decisions based on it.
      </p>

      <h2>10. Disclaimer and limitation of liability</h2>
      <p>
        The site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the fullest
        extent permitted by law, we do not give any warranty of uninterrupted or error-free service and are not
        liable for any indirect or consequential loss, or for any loss arising from your reliance on content or
        from the unavailability of the site. Nothing in these terms limits any liability that cannot be limited
        by law.
      </p>

      <h2>11. Suspension and termination</h2>
      <p>
        We may suspend or end your access to the site or your account if you breach these terms or misuse the
        site. You may stop using the site, or ask us to delete your account, at any time.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These terms are governed by the laws of India. Any dispute relating to them will be subject to the
        jurisdiction of the competent courts in India.
      </p>

      <h2>13. Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The &ldquo;Last updated&rdquo; date above shows the latest
        version, and by continuing to use the site after a change you accept the updated terms.
      </p>

      <h2>14. Contact us</h2>
      <p>
        Questions about these terms? Visit our <Link href="/contact">contact page</Link>
        {CONTACT_EMAIL ? (
          <>
            {" "}
            or email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </>
        ) : null}
        .
      </p>
    </StaticPage>
  );
}
