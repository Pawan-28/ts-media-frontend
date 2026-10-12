import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/requireAdmin";
import { getVideosAdmin } from "@/lib/api/adminClient";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import VideosManager from "@/components/dashboard/VideosManager";

export const metadata: Metadata = { title: "Admin: Videos" };

/**
 * Admin management of the promoted home-page video: paste a YouTube,
 * Instagram or Facebook link (or a direct .mp4) and it floats, embedded,
 * over the home hero image. Only the newest enabled video is shown.
 */
export default async function AdminVideosPage() {
  await requireAdmin("/admin/videos");
  const videos = await getVideosAdmin();

  return (
    <div className="section-stack">
      <DashboardHeader eyebrow="Admin" title="Videos" />
      <p className="text-sm text-text-600">
        Add a video link and it appears as a small floating player on the home page hero image. Only the newest
        enabled video is shown - switch the old one off (or delete it) when you add a new one.
      </p>
      <VideosManager initialVideos={videos} />
    </div>
  );
}
