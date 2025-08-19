"use client";

import { BalanceDisplay } from "@/components/balance-display/balanceDisplay";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowRight, Package, Shield, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Page } from "@/components/Page";

const QuickLinkCard = ({
    href,
    title,
    description,
    icon,
}: {
    href: string;
    title: string;
    description: string;
    icon: React.ReactNode;
}) => (
    <Link
        href={href}
        className="block rounded-lg border bg-card text-card-foreground shadow-sm transition-transform hover:scale-[1.02]"
    >
        <Card className="h-full border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-bold">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    </Link>
);

const AdminFAB = () => (
    <Link
        href="/admin"
        className={cn(
            buttonVariants({ variant: "default", size: "icon" }),
            "fixed bottom-24 start-4 z-50 h-14 w-14 rounded-full shadow-lg"
        )}
        aria-label="Admin Panel"
    >
        <Shield className="h-6 w-6" />
    </Link>
);

export default function HomePage() {
    const t = useTranslations("i18n");

    return (
        <Page back={false}>
            <div className="container mx-auto max-w-4xl space-y-6 p-4 pb-28">
                {/* Hero Section */}
                <Card className="flex flex-col items-start bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">
                            {t("welcome-back")}
                        </CardTitle>
                        <CardDescription className="text-primary-foreground/80">
                            {t("start-your-journey-with-us")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Link
                            href="/panel/test_account"
                            className={cn(
                                buttonVariants({
                                    variant: "secondary",
                                    size: "lg",
                                })
                            )}
                        >
                            {t("get-test-account")}
                            <ArrowRight className="ms-2 h-5 w-5 transition-transform rtl:rotate-180" />
                        </Link>
                        <Link
                            href="/panel"
                            className={cn(
                                buttonVariants({
                                    variant: "secondary",
                                    size: "lg",
                                })
                            )}
                        >
                            {t("go-to-shop")}
                            <ArrowRight className="ms-2 h-5 w-5 transition-transform rtl:rotate-180" />
                        </Link>
                    </CardContent>
                </Card>
                <BalanceDisplay />
                <div className="grid gap-4 md:grid-cols-2">
                    <QuickLinkCard
                        href="/order"
                        title={t("my-orders")}
                        description={t("view-your-order-history")}
                        icon={
                            <Package className="h-6 w-6 text-muted-foreground" />
                        }
                    />
                    <QuickLinkCard
                        href="/profile"
                        title={t("profile")}
                        description={t("manage-your-account-settings")}
                        icon={
                            <User className="h-6 w-6 text-muted-foreground" />
                        }
                    />
                </div>
                <AdminFAB />
            </div>
        </Page>
    );
}
