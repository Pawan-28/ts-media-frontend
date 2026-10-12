import { NextRequest } from "next/server";
import { reporterProxy } from "@/lib/auth/reporterProxy";

/**
 * GET  /api/admin/videos -> backend GET /api/videos/ (perm ads.manage, every video)
 * POST /api/admin/videos -> backend POST /api/videos/ (create {title, url, is_active}).
 */
export async function GET(request: NextRequest) {
  return reporterProxy(request, "/videos/", "GET");
}

export async function POST(request: NextRequest) {
  return reporterProxy(request, "/videos/", "POST");
}
