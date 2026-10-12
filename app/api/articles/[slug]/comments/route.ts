import { NextRequest, NextResponse } from "next/server";
import { reporterProxy } from "@/lib/auth/reporterProxy";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

/** GET /api/articles/[slug]/comments?page= - public list (no login needed), relayed from the backend. */
export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const res = await fetch(
    `${API_BASE_URL}/articles/${encodeURIComponent(params.slug)}/comments/${request.nextUrl.search}`,
    { cache: "no-store" }
  );
  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

/** POST /api/articles/[slug]/comments {body} - needs a signed-in user (cookie token forwarded by reporterProxy). */
export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  return reporterProxy(request, `/articles/${encodeURIComponent(params.slug)}/comments/`, "POST");
}
