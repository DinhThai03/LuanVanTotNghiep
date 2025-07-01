// lib/axios.ts
import { logout } from "@/lib/logout";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Accept: "application/json",
    },
});

instance.interceptors.request.use(
    (config) => {
        const token = Cookies.get("access_token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            const refresh_token = Cookies.get("refresh_token");

            // Kiểm tra refresh_token còn hạn hay không
            if (!refresh_token) {
                await logout();
                return Promise.reject(error);
            }

            try {
                const decoded: any = jwtDecode(refresh_token);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    await logout();
                    return Promise.reject(error);
                }
            } catch (e) {
                await logout();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers["Authorization"] = "Bearer " + token;
                            resolve(instance(originalRequest));
                        },
                        reject: (err: any) => reject(err),
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
                    { refresh_token }
                );

                const { access_token, refresh_token: new_refresh_token } = res.data;
                Cookies.set("access_token", access_token);
                Cookies.set("refresh_token", new_refresh_token);

                processQueue(null, access_token);

                originalRequest.headers["Authorization"] = `Bearer ${access_token}`;
                return instance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                await logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;
