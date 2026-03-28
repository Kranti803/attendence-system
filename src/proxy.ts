import { NextRequest, NextResponse } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {

    const accessToken = request.cookies.get("accessToken")?.value;
    if (!accessToken) return NextResponse.redirect(new URL('/login', request.url));
    const role = request.cookies.get("role")?.value;

    // Optional: Avoid infinite redirects if the user is already on the correct dashboard
    if (role === "admin" && !request.nextUrl.pathname.startsWith('/admin')) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    if (role === "teacher" && !request.nextUrl.pathname.startsWith('/teacher')) {
        return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
    }
    if (role === "student" && !request.nextUrl.pathname.startsWith('/student')) {
        return NextResponse.redirect(new URL('/student/dashboard', request.url));
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/admin/:path*', '/teacher/:path*', '/student/:path*'],
}