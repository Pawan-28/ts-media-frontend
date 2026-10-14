/**
 * Publisher details shown on the static pages (About, Contact, Advertise, Privacy, Terms).
 *
 * Nothing here is invented: the contact e-mail is shown only when NEXT_PUBLIC_CONTACT_EMAIL is set,
 * so no page ever displays an address that nobody reads. Social profiles live in components/SocialLinks.tsx.
 */
export const CONTACT_EMAIL = (process.env.NEXT_PUBLIC_CONTACT_EMAIL || "").trim();

/** Shown as "Last updated" on the legal pages - bump it whenever their text changes. */
export const LEGAL_UPDATED = "14 October 2026";
