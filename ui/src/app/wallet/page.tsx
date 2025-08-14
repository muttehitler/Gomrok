"use client";

import { useTranslations } from "next-intl";
import NextLink from "next/link";
import { Toaster } from "react-hot-toast";
import { PlusCircle } from "lucide-react";

import { Page } from "@/components/Page";
import { BalanceDisplay } from "@/components/balance-display/balanceDisplay";
import { Button } from "@/components/ui/button";

export default function WalletPage() {
    const t = useTranslations("i18n");

    return (
        <Page back={true}>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container mx-auto p-4 md:p-6">
                <div className="flex flex-col space-y-6">
                    <BalanceDisplay />

                    <div className="flex justify-center">
                        <Button asChild size="lg" className="w-full max-w-xs">
                            <NextLink href={"/wallet/top-up"}>
                                <PlusCircle className="me-2 h-5 w-5" />
                                {t("top-up-account")}
                            </NextLink>
                        </Button>
                    </div>

                    {/* WalletLogs component is removed as requested */}
                </div>
            </div>
        </Page>
    );
}
