import { jwtDecode } from 'jwt-decode';
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = [
    "/forgot-password",
    "/reset-password",
    "/contact",
];

// Các route không cho admin truy cập
const restrictedForAdmin = [
    "/",
    "/student-schedule",
    "/teacher-schedule",
    "/exam-schedule",
    "/tuition-fee",
    "/registrations",
    "/result",
];

const studentOnlyRoutes = [
    "/registration",
];

// Route chỉ dành cho giáo viên
const teacherOnlyRoutes = [
    "/teacher-schedule",
];

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("access_token")?.value;
    const pathname = request.nextUrl.pathname;

    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    if (!accessToken && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!accessToken && pathname === "/login") {
        return NextResponse.next();
    }

    try {
        const decoded: any = jwtDecode(accessToken!);
        const role = decoded.role;
        const is_active = decoded.is_active;

        // Không phải admin mà truy cập /admin => redirect
        if (pathname.startsWith("/admin") && role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // Nếu là admin mà truy cập vào các route chỉ dành cho user => redirect về admin/home
        if (role === "admin" && restrictedForAdmin.some((route) => pathname === route || pathname.startsWith(route + "/"))) {
            return NextResponse.redirect(new URL("/admin/home", request.url));
        }

        // Nếu đã login mà truy cập /login => redirect về home tương ứng
        if (pathname === "/login") {
            const redirectUrl = role === "admin" ? "/admin/home" : "/";
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }

        // Giáo viên truy cập route của student hoặc parent
        if (
            role === "teacher" &&
            [...studentOnlyRoutes].some(route => pathname.startsWith(route))
        ) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // Student truy cập route teacher hoặc parent
        if (
            role === "student" &&
            [...teacherOnlyRoutes].some(route => pathname.startsWith(route))
        ) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // Parent truy cập route teacher hoặc student
        if (
            role === "parent" &&
            [...teacherOnlyRoutes, ...studentOnlyRoutes].some(route => pathname.startsWith(route))
        ) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        if (
            (role === "student" || role === "parent") &&
            !is_active &&
            pathname !== "/tuition-fee"
        ) {
            return NextResponse.redirect(new URL("/tuition-fee?reason=inactive", request.url));
        }

        return NextResponse.next();
    } catch (e) {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.set("access_token", "", { maxAge: 0 });
        return res;
    }
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|.*\\.(?:png|jpg|jpeg|svg|webp|ico|txt|js|css)).*)",
    ],
};
