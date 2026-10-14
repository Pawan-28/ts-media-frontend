import type { Metadata } from "next";
import Link from "next/link";
import StaticPage from "@/components/StaticPage";
import { SocialLinkCards } from "@/components/SocialLinks";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Truth & Social is an independent digital news publication covering business, technology, sports and entertainment, built on accuracy, clarity and accountability.",
};

export default function AboutPage() {
  return (
    <StaticPage
      eyebrow="About us"
      title={`About ${SITE_NAME}`}
      lead="An independent digital news publication delivering clear, accurate and timely reporting on the stories that matter to our readers."
    >
      <h2>Who we are</h2>
      <p>
        {SITE_NAME}, published by TS Publication, is an independent news platform covering business
        &amp; economy, technology, sports and entertainment. We publish original reporting every day and
        aim to give readers the facts, the context behind them and a clear view of why they matter.
      </p>

      <h2>Our mission</h2>
      <p>
        To make trustworthy news easy to find and easy to understand. We believe good journalism starts
        with verified facts, is written in plain language and is open about its mistakes.
      </p>

      <h2>What we cover</h2>
      <ul>
        <li>
          <strong>Business &amp; Economy</strong> &mdash; startups and entrepreneurship, the stock market and
          finance, and corporate and industry news.
        </li>
        <li>
          <strong>Technology</strong> &mdash; artificial intelligence, gadgets and smartphones, software and
          cybersecurity.
        </li>
        <li>
          <strong>Sports</strong> &mdash; cricket, football and other sports, from international fixtures to
          domestic leagues.
        </li>
        <li>
          <strong>Entertainment</strong> &mdash; Bollywood and movies, OTT and web series, celebrity news and
          music.
        </li>
      </ul>

      <h2>Our editorial standards</h2>
      <ul>
        <li>
          <strong>Accuracy first.</strong> We check facts and sources before we publish, and we update a story
          when new, verified information becomes available.
        </li>
        <li>
          <strong>Editorial review.</strong> Stories are reviewed by our editorial team before they go live.
        </li>
        <li>
          <strong>Independence.</strong> Advertising and sponsorship never decide what we report or how we
          report it.
        </li>
        <li>
          <strong>Clear labelling.</strong> Advertisements are kept separate from editorial content and are
          identifiable as advertisements.
        </li>
        <li>
          <strong>Corrections.</strong> If we get something wrong, we fix it promptly. To report an error,
          please <Link href="/contact">contact us</Link> with a link to the article.
        </li>
        <li>
          <strong>Respect for people.</strong> We aim to report fairly and to treat the people in our stories
          and our readers with respect.
        </li>
      </ul>

      <h2>Work with us</h2>
      <p>
        Have a story tip, feedback or a partnership idea? Visit our <Link href="/contact">contact page</Link>.
        To reach our audience with your brand, see <Link href="/advertise">advertise with us</Link>.
      </p>

      <h2>Follow us</h2>
      <p>Stay up to date with the latest stories on our official channels.</p>
      <SocialLinkCards />
    </StaticPage>
  );
}
