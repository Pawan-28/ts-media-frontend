"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { extractApiError } from "@/lib/api/apiError";
import type { CurrentUser } from "@/lib/types";

const BIO_MAX = 1000;

/**
 * "Profile" card on the account page. Every signed-in user can view and edit their own name; reporters and
 * admins can also write the short author bio that appears under their articles ("About the Author").
 * Email and role are shown but not editable here (login identity / privileges are admin-managed); the phone
 * number is verified in the WhatsApp section below.
 */
export default function ProfileForm({ user }: { user: CurrentUser }) {
  const router = useRouter();
  const canEditBio = user.role === "REPORTER" || user.role === "ADMIN";

  const [firstName, setFirstName] = useState(user.first_name ?? "");
  const [lastName, setLastName] = useState(user.last_name ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dirty =
    firstName !== (user.first_name ?? "") || lastName !== (user.last_name ?? "") || (canEditBio && bio !== (user.bio ?? ""));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          ...(canEditBio ? { bio: bio.trim() } : {}),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(extractApiError(data, "Could not save your profile. Please try again."));
        return;
      }
      setFirstName(data.first_name ?? "");
      setLastName(data.last_name ?? "");
      setBio(data.bio ?? "");
      setMessage("Profile saved.");
      router.refresh(); // header greeting and this page's data pick up the new values
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5">
          <span className="field-label">First name</span>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            maxLength={150}
            autoComplete="given-name"
            className="field-input"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="field-label">Last name</span>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            maxLength={150}
            autoComplete="family-name"
            className="field-input"
          />
        </label>
      </div>

      <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-text-400">Email</dt>
        <dd className="break-all text-text-900">{user.email}</dd>
        <dt className="text-text-400">Role</dt>
        <dd className="text-text-900">{user.role}</dd>
      </dl>

      {canEditBio && (
        <label className="flex flex-col gap-1.5">
          <span className="field-label">
            Author bio <span className="font-normal text-text-400">(shown under your articles in &ldquo;About the Author&rdquo;)</span>
          </span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={BIO_MAX}
            rows={4}
            placeholder="A few lines about you: what you cover, your experience, where you're based."
            className="field-input resize-y"
          />
          <span className="text-xs text-text-400">
            {bio.length}/{BIO_MAX}
          </span>
        </label>
      )}

      {error && (
        <p role="alert" className="text-sm text-error-600">
          {error}
        </p>
      )}
      {message && !error && (
        <p role="status" className="text-sm text-success-600">
          {message}
          {canEditBio && " Your bio now appears under your articles (it can take up to a minute to update)."}
        </p>
      )}

      <button type="submit" disabled={saving || !dirty} className="btn-primary self-start disabled:opacity-60">
        {saving ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
