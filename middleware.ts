import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/login") {
    return NextResponse.next();
  }

  const isDashboardRoute =
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/seller-dashboard");

  if (isDashboardRoute) {
    try {
      const response = await fetch(`${req.nextUrl.origin}/api/auth/get-session`, {
        headers: {
          cookie: req.headers.get("cookie") || "",
        },
      });

      const session = await response.json();

      if (!session?.user) {
        return NextResponse.next();
      }

      const userRole = session.user?.role;

      if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (pathname.startsWith("/seller-dashboard") && userRole !== "SELLER") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error("Middleware auth error:", error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/admin-dashboard/:path*",
    "/seller-dashboard/:path*",
  ],
};