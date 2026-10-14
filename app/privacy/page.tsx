import type { Metadata } from "next";
import Link from "next/link";
import StaticPage from "@/components/StaticPage";
import { CONTACT_EMAIL, LEGAL_UPDATED } from "@/lib/siteInfo";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses and protects your personal information.`,
};

export default function PrivacyPage() {
  return (
    <StaticPage
      eyebrow="Legal"
      title="Privacy Policy"
      lead={`Your privacy matters to us. This policy explains what personal information ${SITE_NAME} collects, why we collect it and the choices you have.`}
      updated={LEGAL_UPDATED}
    >
      <h2>1. Who we are</h2>
      <p>
        {SITE_NAME} is a digital news publication published by TS Publication (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, &ldquo;our&rdquo;). This policy applies to this website and to the accounts,
        subscriptions and features we offer through it.
      </p>

      <h2>2. Information we collect</h2>
      <h3>Information you give us</h3>
      <ul>
        <li>
          <strong>Account details</strong> &mdash; your name, email address, phone number and password (stored
          only in encrypted, hashed form) when you register.
        </li>
        <li>
          <strong>Subscription and payment details</strong> &mdash; the plan you choose and the status of your
          payment. Payments are processed by our payment provider; we receive a confirmation and a reference but
          do <em>not</em> receive or store your card, UPI or bank credentials.
        </li>
        <li>
          <strong>Comments and messages</strong> &mdash; comments you post on articles (shown publicly with your
          name) and anything you send us when you contact us.
        </li>
      </ul>
      <h3>Information collected automatically</h3>
      <ul>
        <li>
          <strong>Usage data</strong> &mdash; which articles are read, counted per day. To avoid counting the same
          visit twice we use a short-lived, non-identifying code derived from technical data; we do not use it to
          build a profile of you.
        </li>
        <li>
          <strong>Technical data</strong> &mdash; your IP address, browser type and device information, used for
          security, fraud prevention, limiting abusive traffic and keeping the site running.
        </li>
      </ul>

      <h2>3. Cookies and similar technologies</h2>
      <p>
        When you sign in we set secure, essential cookies to keep you logged in and to protect your account. We
        do not use these cookies for advertising. Some pages show embedded content from third parties (for
        example YouTube, Instagram or Facebook videos, and advertisements); those services may set their own
        cookies when you view or interact with that content, under their own privacy policies.
      </p>

      <h2>4. How we use your information</h2>
      <ul>
        <li>To create and manage your account and verify your phone number.</li>
        <li>To provide subscriber content, process payments and send service messages such as confirmations and renewal reminders.</li>
        <li>To publish your comments and moderate the site.</li>
        <li>To understand which stories readers value and to improve the site.</li>
        <li>To keep the site secure and to comply with legal obligations.</li>
      </ul>

      <h2>5. Phone verification and messages</h2>
      <p>
        We may send a one-time verification code to your phone number, including through a messaging service such
        as WhatsApp, to confirm that the number is yours. We may also send you service notifications about your
        subscription. We do not use your phone number for unrelated marketing without your consent.
      </p>

      <h2>6. Who we share information with</h2>
      <p>We do not sell your personal information. We share it only with service providers that help us run the site, and only as needed, such as:</p>
      <ul>
        <li>web hosting and content-delivery providers (for example for hosting the site and delivering images);</li>
        <li>our payment provider, to process subscription payments;</li>
        <li>messaging and email providers, to deliver verification codes and notifications;</li>
        <li>authorities or other parties where we are required to do so by law or to protect our rights and users.</li>
      </ul>

      <h2>7. Third-party links and content</h2>
      <p>
        Our pages may link to or embed content from other websites and social networks. We are not responsible
        for their content or privacy practices, so please review their policies.
      </p>

      <h2>8. How long we keep information</h2>
      <p>
        We keep account information for as long as your account is active and for a reasonable period afterwards
        where needed for legal, accounting or security reasons. Comments remain on the article until they are
        removed. You can ask us to delete your account at any time.
      </p>

      <h2>9. Security</h2>
      <p>
        We use reasonable technical and organisational measures to protect your information, including encrypted
        connections (HTTPS), hashed passwords and access controls. No online service can be completely secure, so
        please use a strong, unique password and keep it private.
      </p>

      <h2>10. Your choices and rights</h2>
      <p>
        You may ask us to access, correct or delete the personal information we hold about you, or to withdraw
        your consent where we rely on it. To make a request, <Link href="/contact">contact us</Link> from the
        email address or phone number on your account and we will respond within a reasonable time and in line
        with applicable law.
      </p>

      <h2>11. Children</h2>
      <p>
        This site is not directed at children under 18. We do not knowingly collect personal information from
        them. If you believe a child has given us personal information, please contact us and we will delete it.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;Last updated&rdquo; date above shows when it
        last changed, and significant changes will be highlighted on the site.
      </p>

      <h2>13. Contact us</h2>
      <p>
        Questions about this policy or your information? Visit our <Link href="/contact">contact page</Link>
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
