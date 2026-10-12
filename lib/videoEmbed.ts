export type VideoPlatform = "youtube" | "instagram" | "facebook" | "file" | "unknown";

export interface VideoEmbed {
  platform: VideoPlatform;
  /** iframe / video src; null when the link can't be embedded (shown as a plain "Watch" link instead). */
  src: string | null;
  /** Portrait content (Instagram reels, YouTube Shorts) gets a tall player. */
  portrait: boolean;
}

/** Turns a pasted YouTube / Instagram / Facebook / direct-video link into something embeddable. */
export function getVideoEmbed(rawUrl: string): VideoEmbed {
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return { platform: "unknown", src: null, portrait: false };
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  const parts = url.pathname.split("/").filter(Boolean);

  // YouTube: watch?v=ID, youtu.be/ID, /shorts/ID, /embed/ID, /live/ID
  if (host === "youtube.com" || host === "youtube-nocookie.com" || host === "youtu.be") {
    let id: string | null = null;
    let portrait = false;
    if (host === "youtu.be") id = parts[0] ?? null;
    else if (parts[0] === "watch") id = url.searchParams.get("v");
    else if (parts[0] === "shorts") {
      id = parts[1] ?? null;
      portrait = true;
    } else if (parts[0] === "embed" || parts[0] === "live") id = parts[1] ?? null;
    if (id && /^[\w-]{6,}$/.test(id)) {
      return { platform: "youtube", src: `https://www.youtube.com/embed/${id}?rel=0&playsinline=1`, portrait };
    }
    return { platform: "youtube", src: null, portrait: false };
  }

  // Instagram: /reel/CODE/, /p/CODE/, /tv/CODE/
  if (host === "instagram.com") {
    const i = parts.findIndex((p) => p === "reel" || p === "reels" || p === "p" || p === "tv");
    const code = i >= 0 ? parts[i + 1] : null;
    if (code && /^[\w-]+$/.test(code)) {
      return { platform: "instagram", src: `https://www.instagram.com/${parts[i] === "reels" ? "reel" : parts[i]}/${code}/embed`, portrait: true };
    }
    return { platform: "instagram", src: null, portrait: true };
  }

  // Facebook: any public video / reel / watch URL goes through the video plugin.
  if (host === "facebook.com" || host === "fb.watch" || host === "fb.com") {
    const href = encodeURIComponent(url.toString());
    return {
      platform: "facebook",
      src: `https://www.facebook.com/plugins/video.php?href=${href}&show_text=false&width=560`,
      portrait: parts[0] === "reel",
    };
  }

  // Direct video file
  if (/\.(mp4|webm|ogg)$/i.test(url.pathname)) {
    return { platform: "file", src: url.toString(), portrait: false };
  }

  return { platform: "unknown", src: null, portrait: false };
}

export const PLATFORM_LABEL: Record<VideoPlatform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  facebook: "Facebook",
  file: "Video file",
  unknown: "Link",
};
