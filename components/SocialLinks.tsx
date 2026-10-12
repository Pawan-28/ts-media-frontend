/**
 * The site's social profiles, shown as round icon buttons in the header
 * strip. Each URL can be overridden per deployment with a NEXT_PUBLIC_SOCIAL_*
 * env var. A network with an empty URL (X, Telegram for now) is hidden until a
 * real link is set here or in the env.
 */
const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK || "https://www.facebook.com/p/TS-Publication-61566187917098/",
    icon: (
      <path
        fill="currentColor"
        d="M13.6 21v-7.6h2.6l.4-3h-3V8.5c0-.9.3-1.5 1.5-1.5h1.6V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H8v3h2.6V21h3Z"
      />
    ),
  },
  {
    label: "X",
    href: process.env.NEXT_PUBLIC_SOCIAL_X || "",
    icon: <path stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" d="M5 5l14 14M19 5 5 19" fill="none" />,
  },
  {
    label: "Instagram",
    href: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM || "https://www.instagram.com/truthandsocialmedia/",
    icon: (
      <>
        <rect x="4.5" y="4.5" width="15" height="15" rx="4.5" fill="none" stroke="currentColor" strokeWidth={2} />
        <circle cx="12" cy="12" r="3.4" fill="none" stroke="currentColor" strokeWidth={2} />
        <circle cx="16.6" cy="7.4" r="1.1" fill="currentColor" />
      </>
    ),
  },
  {
    label: "YouTube",
    href: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE || "https://www.youtube.com/@tspublication",
    icon: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="3.5" fill="none" stroke="currentColor" strokeWidth={2} />
        <path fill="currentColor" d="m10.3 9.3 4.6 2.7-4.6 2.7V9.3Z" />
      </>
    ),
  },
  {
    label: "LinkedIn",
    href: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN || "https://in.linkedin.com/company/ts-publication",
    icon: (
      <>
        <circle cx="6.8" cy="7.2" r="1.4" fill="currentColor" />
        <rect x="5.6" y="10" width="2.4" height="8" fill="currentColor" />
        <path
          fill="currentColor"
          d="M10.2 10h2.3v1.1c.5-.8 1.4-1.3 2.6-1.3 2.2 0 3.1 1.3 3.1 3.6V18h-2.4v-4.1c0-1.1-.4-1.8-1.4-1.8s-1.5.7-1.5 1.8V18h-2.4v-8Z"
        />
      </>
    ),
  },
  {
    label: "Telegram",
    href: process.env.NEXT_PUBLIC_SOCIAL_TELEGRAM || "",
    icon: (
      <path
        fill="currentColor"
        d="M20.4 4.6 3.7 11c-.8.3-.8.9-.1 1.1l4.1 1.3 1.6 4.8c.2.5.4.6.8.2l2.2-2.1 4.2 3.1c.8.4 1.3.2 1.5-.7l2.6-12.7c.3-1.1-.4-1.6-1.2-1.4Z"
      />
    ),
  },
];

export default function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex items-center gap-2 ${className}`} aria-label="Follow us on social media">
      {SOCIAL_LINKS.filter((s) => s.href).map((s) => (
        <li key={s.label}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Follow us on ${s.label}`}
            title={s.label}
            className="flex h-7 w-7 items-center justify-center rounded-full border border-border-200 text-text-600 transition-colors hover:border-accent-600 hover:text-accent-600"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              {s.icon}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}
