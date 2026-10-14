import type { Metadata } from "next";
import Link from "next/link";
import StaticPage from "@/components/StaticPage";
import { SocialLinkCards } from "@/components/SocialLinks";
import { CONTACT_EMAIL } from "@/lib/siteInfo";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${SITE_NAME}: story tips, corrections, feedback, advertising and partnership enquiries.`,
};

export default function ContactPage() {
  return (
    <StaticPage
      eyebrow="Contact"
      title="Contact us"
      lead="We'd like to hear from you. Whether it's a story tip, a correction or a business enquiry, here is how to reach the team."
    >
      {CONTACT_EMAIL && (
        <>
          <h2>Email</h2>
          <p>
            Write to us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. Please mention the topic of
            your message in the subject line so it reaches the right person.
          </p>
        </>
      )}

      <h2>Send us a story tip</h2>
      <p>
        If you know about something our readers should hear about, tell us. To help us verify it quickly,
        include what happened, where and when, who is involved, and any supporting documents, photos or links.
        We respect requests to keep a source confidential.
      </p>

      <h2>Report an error or request a correction</h2>
      <p>
        We take accuracy seriously. If you spot a mistake in one of our articles, send us the link to the article,
        the passage that is wrong and, if you can, a reliable source for the correct information. We review every
        report and correct the story where needed.
      </p>

      <h2>Advertising and partnerships</h2>
      <p>
        For advertising placements, sponsored campaigns and brand partnerships, see our{" "}
        <Link href="/advertise">advertising page</Link> and then contact us on any channel below with your
        requirements.
      </p>

      <h2>Reach us on social media</h2>
      <p>Message us or follow our latest stories on our official channels.</p>
      <SocialLinkCards />

      <h2>Account and subscription help</h2>
      <p>
        If you have trouble signing in, verifying your phone number or with a subscription payment, contact us
        and include the email address or phone number on your account (never your password) so we can help.
      </p>
    </StaticPage>
  );
}
