import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname === "/login") {
    return NextResponse.next();
  }

  let isAuthenticated = false;
  let userRole = "";

  try {
    const sessionCookie = request.cookies.get('better-auth.session_token');
    
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    const res = await fetch(`${backendUrl}/api/auth/session`, {
      headers: {
        "Cookie": `better-auth.session_token=${sessionCookie.value}`,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const data = await res.json();

    if (data?.user) {
      isAuthenticated = true;
      userRole = data.user.role;
    }
  } catch (error) {
    console.log("Session error:", error);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isAdmin = userRole === "ADMIN";
  const isSeller = userRole === "SELLER";
  const isCustomer = userRole === "CUSTOMER";

  if (isAdmin && pathname.startsWith("/admin-dashboard")) {
    return NextResponse.next();
  }

  if (isAdmin && pathname.startsWith("/seller-dashboard")) {
    return NextResponse.redirect(new URL("/admin-dashboard", request.url));
  }

  if (isSeller && pathname.startsWith("/seller-dashboard")) {
    return NextResponse.next();
  }

  if (isSeller && pathname.startsWith("/admin-dashboard")) {
    return NextResponse.redirect(new URL("/seller-dashboard", request.url));
  }

  if (
    isCustomer &&
    (pathname.startsWith("/admin-dashboard") ||
      pathname.startsWith("/seller-dashboard"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
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