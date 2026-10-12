"use client";

import Link from "next/link";
import { useState } from "react";
import type { ArticleComment, PaginatedResponse } from "@/lib/types";

const MAX_LENGTH = 1000;

function formatWhen(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleString("en-US", {
    timeZone: "Asia/Kolkata",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Reader comments. Anyone can read; posting needs a signed-in account.
 * Initial page comes from the server-rendered article page; new comments
 * are added to the top locally and everything else goes through this app's
 * own /api/* routes (the browser never sees the raw API token).
 */
export default function CommentsSection({
  slug,
  initial,
  viewer,
}: {
  slug: string;
  initial: PaginatedResponse<ArticleComment>;
  viewer: { id: number; role: string } | null;
}) {
  const [comments, setComments] = useState<ArticleComment[]>(initial.results);
  const [count, setCount] = useState(initial.count);
  const [nextPage, setNextPage] = useState<number | null>(initial.next ? 2 : null);
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const text = body.trim();
    if (text.length < 2) {
      setError("Please write a little more.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/articles/${encodeURIComponent(slug)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(
          res.status === 401
            ? "Please log in to comment."
            : res.status === 429
              ? "You are commenting too fast. Please wait a minute."
              : data?.body?.[0] ?? data?.detail ?? "Could not post your comment."
        );
        return;
      }
      setComments((prev) => [data as ArticleComment, ...prev]);
      setCount((c) => c + 1);
      setBody("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this comment?")) return;
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" }).catch(() => null);
    if (res && (res.ok || res.status === 204)) {
      setComments((prev) => prev.filter((c) => c.id !== id));
      setCount((c) => Math.max(0, c - 1));
    } else {
      setError("Could not delete that comment.");
    }
  }

  async function loadMore() {
    if (!nextPage) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/articles/${encodeURIComponent(slug)}/comments?page=${nextPage}`);
      if (!res.ok) throw new Error();
      const data = (await res.json()) as PaginatedResponse<ArticleComment>;
      setComments((prev) => [...prev, ...data.results.filter((c) => !prev.some((p) => p.id === c.id))]);
      setNextPage(data.next ? nextPage + 1 : null);
    } catch {
      setError("Could not load more comments.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section id="comments" aria-labelledby="comments-heading" className="mt-10 max-w-[850px] print:hidden">
      <h2 id="comments-heading" className="section-heading mb-4">
        Comments <span className="font-normal text-text-400">({count})</span>
      </h2>

      {viewer ? (
        <form onSubmit={submit} className="mb-6 flex flex-col gap-2">
          <label htmlFor="comment-body" className="sr-only">
            Your comment
          </label>
          <textarea
            id="comment-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={MAX_LENGTH}
            rows={3}
            placeholder="Share your thoughts..."
            className="field-input resize-y"
          />
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs text-text-400">
              {body.length}/{MAX_LENGTH}
            </span>
            <button type="submit" disabled={busy} className="btn-primary disabled:opacity-60">
              {busy ? "Posting..." : "Post comment"}
            </button>
          </div>
          {error && (
            <p role="alert" className="text-sm text-error-600">
              {error}
            </p>
          )}
        </form>
      ) : (
        <p className="mb-6 rounded-md border border-border-200 bg-surface-50 px-4 py-3 text-sm text-text-600">
          <Link href="/login" className="font-semibold text-accent-600 hover:underline">
            Log in
          </Link>{" "}
          or{" "}
          <Link href="/register" className="font-semibold text-accent-600 hover:underline">
            create an account
          </Link>{" "}
          to join the conversation.
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-sm text-text-400">No comments yet. Be the first to share your thoughts.</p>
      ) : (
        <ul className="divide-y divide-border-200">
          {comments.map((c) => (
            <li key={c.id} className="py-4 first:pt-0">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold text-text-900">
                  {c.author_name} <span className="ml-1 text-xs font-normal text-text-400">{formatWhen(c.created_at)}</span>
                </p>
                {viewer && (viewer.id === c.user_id || viewer.role === "ADMIN") && (
                  <button type="button" onClick={() => remove(c.id)} className="text-xs text-text-400 hover:text-error-600">
                    Delete
                  </button>
                )}
              </div>
              <p className="mt-1 whitespace-pre-line break-words text-sm leading-relaxed text-text-600">{c.body}</p>
            </li>
          ))}
        </ul>
      )}

      {nextPage && (
        <button type="button" onClick={loadMore} disabled={busy} className="btn-ghost mt-4 disabled:opacity-60">
          Load more comments
        </button>
      )}
      {viewer && error && comments.length > 0 && !body && (
        <p role="alert" className="mt-3 text-sm text-error-600">
          {error}
        </p>
      )}
    </section>
  );
}
