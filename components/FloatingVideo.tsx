"use client";

import { useState } from "react";
import { getVideoEmbed } from "@/lib/videoEmbed";

/**
 * Small embedded video floated over a corner of the home hero image.
 * Works with YouTube, Instagram, Facebook and direct video links (see
 * lib/videoEmbed.ts). Can be enlarged or dismissed by the reader.
 */
export default function FloatingVideo({ url, title }: { url: string; title?: string }) {
  const [closed, setClosed] = useState(false);
  const [large, setLarge] = useState(false);
  const embed = getVideoEmbed(url);

  if (closed) return null;

  const size = embed.portrait
    ? large
      ? "w-[260px] h-[440px] sm:w-[300px] sm:h-[500px]"
      : "w-[130px] h-[230px] sm:w-[170px] sm:h-[300px]"
    : large
      ? "w-[300px] sm:w-[460px] aspect-video"
      : "w-[170px] sm:w-[240px] aspect-video";

  return (
    // The track covers the whole hero image but ignores the pointer, so the
    // image link underneath stays clickable; only the player itself is
    // interactive. The player drifts slowly from the top-right corner down to
    // the bottom-left and back (see .video-drift in globals.css), pausing
    // while hovered/focused so it can be played.
    <div className="pointer-events-none absolute inset-3 z-10 print:hidden">
      <div
        className="video-drift pointer-events-auto absolute overflow-hidden rounded-lg border-2 border-white bg-black shadow-xl"
        role="region"
        aria-label={title || "Featured video"}
      >
      <div className="absolute right-1 top-1 z-10 flex gap-1">
        <button
          type="button"
          onClick={() => setLarge((v) => !v)}
          aria-label={large ? "Make video smaller" : "Make video bigger"}
          className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
        >
          {large ? "↙" : "↗"}
        </button>
        <button
          type="button"
          onClick={() => setClosed(true)}
          aria-label="Close video"
          className="flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-xs text-white hover:bg-black/80"
        >
          &#10005;
        </button>
      </div>

      <div className={`${size} transition-all`}>
        {embed.src && embed.platform === "file" ? (
          <video src={embed.src} controls playsInline preload="metadata" className="h-full w-full object-cover" />
        ) : embed.src ? (
          <iframe
            src={embed.src}
            title={title || "Featured video"}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-full w-full items-center justify-center p-3 text-center text-sm font-semibold text-white hover:underline"
          >
            &#9654; Watch video
          </a>
        )}
      </div>
      </div>
    </div>
  );
}
