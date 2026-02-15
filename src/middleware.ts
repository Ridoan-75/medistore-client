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
      const sessionCookie = req.cookies.get('better-auth.session_token');
      
      if (!sessionCookie) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/auth/session`, {
        method: "GET",
        headers: {
          "Cookie": `better-auth.session_token=${sessionCookie.value}`,
        },
      });

      if (!response.ok) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const session = await response.json();

      if (!session?.user) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const userRole = session.user.role;

      if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (pathname.startsWith("/seller-dashboard") && userRole !== "SELLER") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
      
    } catch (error) {
      console.error("Middleware error:", error);
      return NextResponse.redirect(new URL("/login", req.url));
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