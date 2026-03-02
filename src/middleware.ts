import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  const isAuthPage =
    url.pathname.startsWith("/sign-in") ||
    url.pathname.startsWith("/sign-up");

  const protectedRoutes = ["/", "/interview" ,"/authenticatedLandingPage" , "interview/:id/feedback" ,"/interview/:id"];
  const isProtected = protectedRoutes.includes(url.pathname);

  // Always allow auth pages
  if (isAuthPage) return NextResponse.next();

  // Block protected pages if user not logged in and redirect the users to the landing pages
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/landingPage", request.url));
  }

  return NextResponse.next();
}
