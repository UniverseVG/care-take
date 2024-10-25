// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserId, isTokenExpired } from "./lib/utils";
import { getPatient } from "./lib/actions/patient.actions";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  const isAuthenticated = token && !isTokenExpired(token);

  const userId = getUserId(token!);

  if (
    !isAuthenticated &&
    req.nextUrl.pathname !== "/login" &&
    req.nextUrl.pathname !== "/" &&
    req.nextUrl.pathname !== "/admin"
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (
    isAuthenticated &&
    (req.nextUrl.pathname === "/login" ||
      req.nextUrl.pathname === "/" ||
      req.nextUrl.pathname === `/patients/${userId}/dashboard` ||
      req.nextUrl.pathname === `/patients/${userId}/new-appointment` ||
      req.nextUrl.pathname === `/patients/${userId}/new-appointment/success`)
  ) {
    const response = await getPatient(userId!);

    let isRegisterComplete = false;
    if (response) {
      isRegisterComplete = response.isRegistrationComplete;
    }

    if (!isRegisterComplete) {
      return NextResponse.redirect(
        new URL(`/patients/${userId}/register`, req.url)
      );
    }
  }

  if (
    isAuthenticated &&
    (req.nextUrl.pathname === "/login" ||
      req.nextUrl.pathname === "/" ||
      req.nextUrl.pathname === `/patients/${userId}/register`)
  ) {
    const response = await getPatient(userId!);

    let isRegisterComplete = false;
    if (response) {
      isRegisterComplete = response.isRegistrationComplete;
    }

    if (isRegisterComplete) {
      return NextResponse.redirect(
        new URL(`/patients/${userId}/dashboard`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!admin|_next|favicon.ico|assets|fonts|images|icons).*)"],
};
