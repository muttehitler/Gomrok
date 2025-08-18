import type { PropsWithChildren } from "react";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

import { Root } from "@/components/Root/Root";
import { I18nProvider } from "@/core/i18n/provider";
import StyledComponentsRegistry from "@/lib/registry";
import { Toaster } from "@/components/ui/toaster";

import "./globals.css";
import CheckAuth from "@/components/auth/CheckAuth";
import { Navbar } from "@/components/navbar/navbar";
import { Top } from "@/components/top/top";

export const metadata: Metadata = {
    title: "Your Application Title Goes Here",
    description: "Your application description goes here",
};

export default async function RootLayout({ children }: PropsWithChildren) {
    const locale = await getLocale();
    const t = await getTranslations("i18n");

    return (
        <html lang={locale} dir={t("dir")}>
            <body>
                <StyledComponentsRegistry>
                    <I18nProvider>
                        <Root>
                            <CheckAuth>
                                <Top />
                                {children}
                                <Navbar />
                                <div className="min-h-[90px]"></div>
                                <Toaster />{" "}
                            </CheckAuth>
                        </Root>
                    </I18nProvider>
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
