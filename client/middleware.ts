import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";


const publicRoutes = [
    "/forgot-password",
    "/contact",
];

export function middleware(request: NextRequest) {
    const accessToken = request.cookies.get("access_token")?.value;
    const pathname = request.nextUrl.pathname;

    if (publicRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Nếu KHÔNG có token và KHÔNG đang ở /login => redirect về /login
    if (!accessToken && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // Nếu KHÔNG có token và đang ở /login => cho đi tiếp
    if (!accessToken && pathname === "/login") {
        return NextResponse.next();
    }

    // Nếu CÓ token, xử lý kiểm tra quyền truy cập và redirect nếu cần
    try {
        const decoded: any = jwtDecode(accessToken!);
        const role = decoded.role;

        // Nếu đang vào trang admin mà không phải admin => về /
        if (pathname.startsWith("/admin") && role !== "admin") {
            return NextResponse.redirect(new URL("/", request.url));
        }

        // Nếu đã đăng nhập mà truy cập /login => redirect đúng role
        if (pathname === "/login") {
            const redirectUrl = role === "admin" ? "/admin/home" : "/";
            return NextResponse.redirect(new URL(redirectUrl, request.url));
        }

        return NextResponse.next();
    } catch (e) {
        const res = NextResponse.redirect(new URL("/login", request.url));
        res.cookies.set("access_token", "", { maxAge: 0 });
        return res;
    }
}

export const config = {
    matcher: "/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt).*)",
};
