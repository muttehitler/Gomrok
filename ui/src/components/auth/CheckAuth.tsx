"use client";

import { login } from "@/actions/auth.action";
import { getCookie, setCookie } from "@/lib/utils/cookie.helper";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { ReactNode, useEffect, useState } from "react";
import crypto from "crypto";

type CheckAuthProps = {
    children: ReactNode;
};

export default function CheckAuth({ children }: CheckAuthProps) {
    const [auth, setAuth] = useState(false);

    let token = getCookie("token");
    let csrf = getCookie("csrf");

    const raw = useSignal(initData.raw);

    useEffect(() => {
        (async () => {
            if (token && csrf) {
                setAuth(true);
                return;
            }

            const data = await login(raw ?? "");

            setCookie("token", data.token, 1 / 24, {
                path: "/",
                httpOnly: false,
            });

            const csrfSecret = crypto.randomBytes(64).toString("hex");

            setCookie("csrf", csrfSecret ?? "sdkf", 1 / 24, {
                path: "/",
                httpOnly: false,
            });

            setAuth(true);
        })();
    }, [csrf, raw, token]); // Dependency array to prevent re-renders

    if (!auth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-background">
                Loading...
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}
