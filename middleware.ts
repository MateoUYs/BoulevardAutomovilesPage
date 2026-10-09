import { NextResponse, type NextRequest } from "next/server";
import { adminSessionCookie, verifyAdminToken } from "@/lib/auth-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const protectedAdminApi = pathname.startsWith("/api/admin/cars") || pathname.startsWith("/api/admin/uploads") || pathname.startsWith("/api/admin/specs") || pathname.startsWith("/api/admin/settings") || pathname.startsWith("/api/admin/fuel-prices") || pathname.startsWith("/api/admin/consumption-references");
  const protectedAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";

  if (!protectedAdminApi && !protectedAdminPage) {
    return NextResponse.next();
  }

  const isValid = await verifyAdminToken(request.cookies.get(adminSessionCookie)?.value);
  if (isValid) return NextResponse.next();

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/cars/:path*", "/api/admin/uploads/:path*", "/api/admin/specs/:path*", "/api/admin/settings/:path*", "/api/admin/fuel-prices/:path*", "/api/admin/consumption-references/:path*"],
};
