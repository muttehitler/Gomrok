"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Page } from "@/components/Page";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

export default function TopUpPage() {
    const t = useTranslations("i18n");
    const router = useRouter();

    return (
        <Page back={true}>
            <div className="container mx-auto p-4 md:p-6">
                <div className="flex flex-col space-y-4">
                    <h1 className="text-2xl font-bold tracking-tight">
                        {t("select-payment-method")}
                    </h1>
                    <Card
                        onClick={() => router.push("/wallet/top-up/trx-wallet")}
                        className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
                    >
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>{t("trx-wallet")}</CardTitle>
                                <CardDescription>
                                    {t("pay-with-tron-network")}
                                </CardDescription>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </CardHeader>
                    </Card>
                </div>
            </div>
        </Page>
    );
}
