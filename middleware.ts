// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { ROLES, RoleType } from "@/@core/constants/role.constant";

export default withAuth(
  function middleware(req) {
    const pathname = req.nextUrl.pathname;
    const token = req.nextauth.token;
    // ... (ตรวจสอบ role และ redirect)
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: [
    "/dashboards/:path*",
    "/admin/:path*",
    "/customers/:path*",
    "/rooms/:path*",
    "/bookings/:path*",
    "/my-bookings/:path*",
    "/book-now/:path*",
    "/profile/:path*"
  ]
};