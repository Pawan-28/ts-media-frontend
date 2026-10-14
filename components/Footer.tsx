import Link from "next/link";
import SocialLinks from "@/components/SocialLinks";
import { SITE_NAME } from "@/lib/seo";

const FOOTER_LINKS = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/advertise", label: "Advertise" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border-200 bg-surface-0 text-text-600 print:hidden">
      <div className="container-page py-10">
        <div className="flex flex-col items-center gap-6 text-center">
          <div>
            <p className="text-xl font-black tracking-tight text-text-900">
              Truth <span className="text-accent-600">And</span> Social
            </p>
            {/* <p className="mx-auto mt-2 max-w-md text-sm text-text-600">
              Independent reporting on business, technology, sports and entertainment.
            </p> */}
          </div>

          <SocialLinks className="justify-center" />

          <nav aria-label="Footer" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {FOOTER_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-text-900 hover:text-accent-600">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <p className="mt-8 border-t border-border-200 pt-5 text-center text-xs text-text-400">
          &copy; {new Date().getFullYear()} {SITE_NAME}, a TS Publication website. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
