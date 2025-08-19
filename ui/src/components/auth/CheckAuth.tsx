"use client";

import { login, verify } from "@/actions/auth.action";
import { getCookie, setCookie } from "@/lib/utils/cookie.helper";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import crypto from "crypto";
import { Loader2 } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

type CheckAuthProps = {
    children: ReactNode;
};

const AuthLoader = () => (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background text-primary">
        <Loader2 className="h-10 w-10 animate-spin" />
        <span className="mt-4 text-lg">Authenticating...</span>
    </div>
);

export default function CheckAuth({ children }: CheckAuthProps) {
    const [isAuthenticating, setIsAuthenticating] = useState(true);

    const raw = useSignal(initData.raw);

    useEffect(() => {
        const authenticate = async () => {
            const token = getCookie("token");
            const csrf = getCookie("csrf");

            if (token && csrf) {
                setIsAuthenticating(false);
                if ((await verify(raw ?? '')).success)
                    return;
            }

            try {
                const data = await login(raw ?? "");

                setCookie("token", data.token, {
                    path: "/",
                    httpOnly: false,
                }, 1 / 24);

                const csrfSecret = crypto.randomBytes(64).toString("hex");
                setCookie("csrf", csrfSecret, {
                    path: "/",
                    httpOnly: false,
                }, 1 / 24);
            } catch (error) {
                console.error("Authentication failed:", error);
                // Optionally handle auth failure, e.g., show an error message
            } finally {
                setIsAuthenticating(false);
            }
        };

        authenticate();
    }, [raw]);

    if (isAuthenticating) {
        return <AuthLoader />;
    }

    return (
        <div className="flex h-full flex-col">
            <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
    );
}
