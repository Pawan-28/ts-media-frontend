import { NextRequest } from "next/server";
import { reporterProxy } from "@/lib/auth/reporterProxy";

/** DELETE /api/comments/[id] - the comment's author or an admin (enforced by the backend). */
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  if (!/^\d+$/.test(params.id)) {
    return new Response(null, { status: 404 });
  }
  return reporterProxy(request, `/comments/${params.id}/`, "DELETE");
}
