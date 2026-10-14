import { NextRequest } from "next/server";
import { reporterProxy } from "@/lib/auth/reporterProxy";

/**
 * PATCH  /api/admin/categories/:slug -> Django PATCH /api/categories/:slug/ (ADMIN only).
 * DELETE /api/admin/categories/:slug -> Django DELETE /api/categories/:slug/ - soft-deletes
 *        (sets is_active=False) rather than removing the row, since Subcategories/Articles
 *        still reference it (see CategoryController).
 */
export async function PATCH(request: NextRequest, { params }: { params: { slug: string } }) {
  return reporterProxy(request, `/categories/${params.slug}/`, "PATCH");
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  return reporterProxy(request, `/categories/${params.slug}/`, "DELETE");
}
