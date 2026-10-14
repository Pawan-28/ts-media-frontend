import type { Metadata } from "next";
import Link from "next/link";
import StaticPage from "@/components/StaticPage";
import { SocialLinkCards } from "@/components/SocialLinks";
import { CONTACT_EMAIL } from "@/lib/siteInfo";
import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Advertise With Us",
  description: `Reach engaged readers of business, technology, sports and entertainment news with advertising on ${SITE_NAME}.`,
};

const PLACEMENTS = [
  { name: "Home - Sidebar", where: "Beside the main stories on the home page (stays in view on desktop)", size: "280 × 600 px" },
  { name: "Home - Middle", where: "Between the top stories and the latest news on the home page", size: "900 × 180 px" },
  { name: "Home - Bottom", where: "At the end of the home page", size: "900 × 180 px" },
  { name: "Article - Top", where: "Above the headline on every article page", size: "900 × 180 px" },
  { name: "Article - Middle", where: "After the article text, before the end of the article", size: "900 × 180 px" },
  { name: "Article - Bottom", where: "At the foot of every article page", size: "900 × 180 px" },
];

export default function AdvertisePage() {
  return (
    <StaticPage
      eyebrow="Advertise"
      title="Advertise with us"
      lead={`Put your brand in front of readers who come to ${SITE_NAME} every day for news on business, technology, sports and entertainment.`}
    >
      <h2>Why advertise with us</h2>
      <ul>
        <li>
          <strong>Relevant, engaged readers.</strong> Our audience reads about markets and startups, new
          technology, cricket and football, and the latest in cinema and streaming.
        </li>
        <li>
          <strong>Premium placements.</strong> Your campaign appears alongside our stories, on the home page and
          on every article page.
        </li>
        <li>
          <strong>Flexible scheduling.</strong> Every campaign has its own start and end date and time, so you can
          align it with a launch, a sale or a season.
        </li>
        <li>
          <strong>Clearly separate from editorial.</strong> Advertising never influences our reporting.
        </li>
      </ul>

      <h2>Available placements</h2>
      <div className="not-prose overflow-x-auto rounded-md border border-border-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-50 text-xs uppercase tracking-wide text-text-400">
            <tr>
              <th className="px-4 py-3">Placement</th>
              <th className="px-4 py-3">Where it appears</th>
              <th className="px-4 py-3 whitespace-nowrap">Recommended size</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-200 text-text-600">
            {PLACEMENTS.map((p) => (
              <tr key={p.name}>
                <td className="px-4 py-3 font-semibold text-text-900">{p.name}</td>
                <td className="px-4 py-3">{p.where}</td>
                <td className="px-4 py-3 whitespace-nowrap">{p.size}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Featured video</h3>
      <p>
        Have a video campaign? We can feature a YouTube, Instagram or Facebook video as a small floating player
        over the lead story on our home page.
      </p>

      <h2>Creative requirements</h2>
      <ul>
        <li>Image formats: JPG, PNG or WebP, up to 5 MB, at the recommended size above.</li>
        <li>A destination link (https) that opens when a reader clicks your advertisement.</li>
        <li>The campaign name, the placement you want and your preferred start and end date and time.</li>
        <li>
          Advertisements must be lawful, truthful and not misleading. We may decline or remove any advertisement
          that does not meet these standards.
        </li>
      </ul>

      <h2>How to book</h2>
      <ol>
        <li>Contact us with your brand, goals and the placements you are interested in.</li>
        <li>We confirm availability, scheduling and pricing for your campaign.</li>
        <li>You send your creative and destination link.</li>
        <li>We schedule your campaign and it goes live on the agreed date.</li>
      </ol>

      <h2>Get in touch</h2>
      <p>
        {CONTACT_EMAIL ? (
          <>
            Email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> or message us on any of our
            channels below.
          </>
        ) : (
          <>Message us on any of our official channels below, or visit our <Link href="/contact">contact page</Link>.</>
        )}{" "}
        Rates are shared on request, based on the placement and the length of the campaign.
      </p>
      <SocialLinkCards />
    </StaticPage>
  );
}
