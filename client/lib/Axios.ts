// lib/axios.ts
import { logout } from "@/lib/logout";
import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

type FailedQueueItem = {
    resolve: (token: string) => void;
    reject: (error: AxiosError) => void;
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null): void => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else if (token) {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = Cookies.get("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
            const refresh_token = Cookies.get("refresh_token");

            if (!refresh_token) {
                await logout();
                return Promise.reject(error);
            }

            try {
                const decoded = jwtDecode<{ exp: number }>(refresh_token);
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
                return new Promise<string>((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token: string) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            resolve(token);
                        },
                        reject: (err: AxiosError) => reject(err),
                    });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return instance(originalRequest);
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

                originalRequest.headers.Authorization = `Bearer ${access_token}`;
                return instance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError as AxiosError, null);
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