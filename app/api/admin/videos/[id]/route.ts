import { NextRequest } from "next/server";
import { reporterProxy } from "@/lib/auth/reporterProxy";

/**
 * PATCH  /api/admin/videos/:id -> backend PATCH /api/videos/:id/ (edit title/url or toggle is_active)
 * DELETE /api/admin/videos/:id -> backend DELETE /api/videos/:id/
 */
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  if (!/^\d+$/.test(params.id)) return new Response(null, { status: 404 });
  return reporterProxy(request, `/videos/${params.id}/`, "PATCH");
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!/^\d+$/.test(params.id)) return new Response(null, { status: 404 });
  return reporterProxy(request, `/videos/${params.id}/`, "DELETE");
}
