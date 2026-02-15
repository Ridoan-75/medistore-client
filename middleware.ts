import { NextResponse, type NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Login page allowed for everyone
  if (pathname === "/login") {
    return NextResponse.next();
  }

  const isDashboardRoute =
    pathname.startsWith("/admin-dashboard") ||
    pathname.startsWith("/seller-dashboard");

  if (isDashboardRoute) {
    try {
      // ✅ Get session cookie
      const sessionCookie = req.cookies.get('better-auth.session_token');
      
      if (!sessionCookie) {
        console.log("No session cookie found, redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // ✅ Validate session with backend
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/auth/get-session`, {
        method: "GET",
        headers: {
          "Cookie": `better-auth.session_token=${sessionCookie.value}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        console.log("Session validation failed, redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const data = await response.json();
      const session = data.session || data;

      if (!session?.user) {
        console.log("No user in session, redirecting to login");
        return NextResponse.redirect(new URL("/login", req.url));
      }

      const userRole = session.user.role;

      if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
        console.log(`Unauthorized admin access by role: ${userRole}`);
        return NextResponse.redirect(new URL("/", req.url));
      }

      if (pathname.startsWith("/seller-dashboard") && userRole !== "SELLER") {
        console.log(`Unauthorized seller access by role: ${userRole}`);
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
      
    } catch (error) {
      console.error("Middleware auth error:", error);
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