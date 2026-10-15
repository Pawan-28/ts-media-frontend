import { NextRequest, NextResponse } from "next/server";
import {
  ACCESS_COOKIE,
  ACCESS_COOKIE_MAX_AGE,
  AUTH_COOKIE_OPTIONS,
  REFRESH_COOKIE,
  fetchWithAuthRefresh,
} from "@/lib/auth/session";
import { reporterProxy } from "@/lib/auth/reporterProxy";

/**
 * GET /api/auth/me - proxies Django's existing GET /api/auth/me/ using the
 * access-token cookie. Returns {user: null} (200) rather than 401 when
 * there's no session, since this is polled by server components/layout
 * to decide whether to show "Log in" or "My account" - a logged-out
 * visitor hitting this is the normal case, not an error.
 */
export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ user: null });
  }

  const { response: djangoResponse, refreshedAccessToken } = await fetchWithAuthRefresh(
    "/auth/me/",
    { method: "GET" },
    accessToken,
    refreshToken
  );

  if (!djangoResponse.ok) {
    const response = NextResponse.json({ user: null });
    response.cookies.delete(ACCESS_COOKIE);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  const user = await djangoResponse.json();
  const response = NextResponse.json({ user });
  if (refreshedAccessToken) {
    response.cookies.set(ACCESS_COOKIE, refreshedAccessToken, {
      ...AUTH_COOKIE_OPTIONS,
      maxAge: ACCESS_COOKIE_MAX_AGE,
    });
  }
  return response;
}

/**
 * PATCH /api/auth/me - the signed-in user edits their own profile (first/last name for everyone, author bio for
 * reporters and admins). Proxies PATCH /api/auth/me/ on the backend with the cookie token (refreshed if expired);
 * the backend decides what each role may change.
 */
export async function PATCH(request: NextRequest) {
  return reporterProxy(request, "/auth/me/", "PATCH");
}
