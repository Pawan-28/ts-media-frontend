"use client";

import { useState } from "react";
import type { Video } from "@/lib/types";
import { formatDateTime } from "@/lib/format";
import { getVideoEmbed, PLATFORM_LABEL } from "@/lib/videoEmbed";

/**
 * Add / enable-disable / delete promoted videos via this app's own
 * /api/admin/videos(/:id) proxy. The newest enabled video is the one the
 * home page floats over the hero image ("Live on home" badge).
 */
export default function VideosManager({ initialVideos }: { initialVideos: Video[] }) {
  const [videos, setVideos] = useState(initialVideos);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Mirrors the backend: newest enabled video wins (list is newest-first).
  const liveId = videos.find((v) => v.is_active)?.id ?? null;
  const preview = url.trim() ? getVideoEmbed(url) : null;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!url.trim()) {
      setError("Paste a video link first.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), url: url.trim(), is_active: true }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.url?.[0] ?? data?.detail ?? "Could not add the video - check the link and try again.");
        return;
      }
      setVideos((prev) => [data as Video, ...prev]);
      setTitle("");
      setUrl("");
    } catch {
      setError("Network error - please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function toggle(video: Video) {
    setPendingId(video.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/videos/${video.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !video.is_active }),
      });
      if (!res.ok) throw new Error();
      const updated = (await res.json()) as Video;
      setVideos((prev) => prev.map((v) => (v.id === video.id ? updated : v)));
    } catch {
      setError("Could not update that video - please try again.");
    } finally {
      setPendingId(null);
    }
  }

  async function remove(video: Video) {
    if (!confirm(`Delete this video${video.title ? ` ("${video.title}")` : ""}? This cannot be undone.`)) return;
    setPendingId(video.id);
    setError(null);
    try {
      const res = await fetch(`/api/admin/videos/${video.id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error();
      setVideos((prev) => prev.filter((v) => v.id !== video.id));
    } catch {
      setError("Could not delete that video - please try again.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={add} className="card space-y-4 p-4 sm:p-6">
        <h2 className="text-base font-bold text-text-900">Add a video</h2>
        <label className="flex flex-col gap-1">
          <span className="field-label">Video link</span>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="field-input"
            placeholder="https://www.youtube.com/watch?v=...  or  instagram.com/reel/...  or  facebook.com/.../videos/..."
            maxLength={500}
          />
          {preview && (
            <span className={`text-xs ${preview.src ? "text-success-600" : "text-warning-600"}`}>
              {preview.src
                ? `Detected: ${PLATFORM_LABEL[preview.platform]} - will play embedded.`
                : "Can't embed this link - visitors will see a \"Watch video\" link instead."}
            </span>
          )}
        </label>
        <label className="flex flex-col gap-1">
          <span className="field-label">
            Title <span className="font-normal text-text-400">(optional, for your reference)</span>
          </span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="field-input" maxLength={200} />
        </label>
        {error && (
          <p role="alert" className="text-sm text-error-600">
            {error}
          </p>
        )}
        <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
          {saving ? "Adding..." : "Add video"}
        </button>
      </form>

      <div className="card overflow-x-auto">
        {videos.length === 0 ? (
          <p className="p-6 text-sm text-text-400">No videos yet.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border-200 text-xs uppercase tracking-wide text-text-400">
              <tr>
                <th className="px-4 py-3">Video</th>
                <th className="px-4 py-3">Platform</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Added</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-200">
              {videos.map((v) => {
                const embed = getVideoEmbed(v.url);
                return (
                  <tr key={v.id}>
                    <td className="max-w-xs px-4 py-3">
                      <p className="font-semibold text-text-900">{v.title || "Untitled"}</p>
                      <a
                        href={v.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block truncate text-xs text-info-600 hover:underline"
                      >
                        {v.url}
                      </a>
                    </td>
                    <td className="px-4 py-3">{PLATFORM_LABEL[embed.platform]}</td>
                    <td className="px-4 py-3">
                      {v.id === liveId ? (
                        <span className="badge bg-success-600/10 text-success-600">Live on home</span>
                      ) : v.is_active ? (
                        <span className="badge bg-surface-50 text-text-600">Enabled (older)</span>
                      ) : (
                        <span className="badge bg-surface-50 text-text-400">Disabled</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-text-600">{formatDateTime(v.created_at)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      <button
                        type="button"
                        disabled={pendingId === v.id}
                        onClick={() => toggle(v)}
                        className="btn-ghost !px-3 !py-1.5 text-xs disabled:opacity-60"
                      >
                        {v.is_active ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        disabled={pendingId === v.id}
                        onClick={() => remove(v)}
                        className="btn-ghost !px-3 !py-1.5 text-xs text-error-600 disabled:opacity-60"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
