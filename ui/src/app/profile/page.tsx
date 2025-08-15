"use client";

import { getCookieCSRF } from "@/actions/auth.action";
import { me } from "@/actions/user.action";
import { BalanceDisplay } from "@/components/balance-display/balanceDisplay";
import { LocaleSwitcher } from "@/components/LocaleSwitcher/LocaleSwitcher";
import { Page } from "@/components/Page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { Check, Copy, CreditCard, PlusCircle, ShoppingBag } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

type User = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    chatId: number;
    photoUrl: string;

    claims: string[]
    createdAt: Date
    updatedAt: Date

    orderCount?: number
}

// A small component for displaying a single piece of user info
const InfoRow = ({
    label,
    value,
    canCopy = false,
}: {
    label: string;
    value?: string | number;
    canCopy?: boolean;
}) => {
    const t = useTranslations("i18n");
    const [hasCopied, setHasCopied] = useState(false);

    const handleCopy = async () => {
        if (!value) return;
        try {
            await navigator.clipboard.writeText(String(value));
            setHasCopied(true);
            toast.success(t("user-id-copied"));
            setTimeout(() => setHasCopied(false), 2000);
        } catch (err) {
            toast.error(t("failed-to-copy"));
        }
    };

    return (
        <div className="flex items-center justify-between py-3">
            <div className="text-sm">
                <p className="text-muted-foreground">{label}</p>
                <p className="font-mono">{value || "N/A"}</p>
            </div>
            {canCopy && (
                <Button variant="ghost" size="icon" onClick={handleCopy}>
                    {hasCopied ? (
                        <Check className="h-4 w-4 text-green-500" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                </Button>
            )}
        </div>
    );
};

export default function ProfilePage() {
    const t = useTranslations("i18n");
    const data = useSignal(initData.state);
    const user = data?.user;
    const userInitials =
        (user?.firstName?.[0] || "") + (user?.lastName?.[0] || "");
    const [userB, setUserB] = useState<User>();

    useEffect(() => {
        (async () => {
            const csrf = generateCsrfToken(await getCookieCSRF() ?? "");
            const result = JSON.parse(await me({ csrf }));

            if (result.success) {
                setUserB(result.data);
            } else {
                toast.error(`Failed to get user: ${result.message}`);
            }
        })()
    }, [])

    return (
        <Page back={false}>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container mx-auto max-w-lg space-y-6 p-4 pb-28">
                {/* User Info Card */}
                <Card>
                    <CardHeader className="items-center text-center">
                        <Avatar className="mb-4 h-24 w-24">
                            <AvatarImage
                                src={user?.photoUrl}
                                alt={user?.username || "User profile photo"}
                            />
                            <AvatarFallback className="text-3xl">
                                {userInitials}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-2xl">
                            {user?.firstName} {user?.lastName}
                        </CardTitle>
                        {user?.username && (
                            <CardDescription>@{user.username}</CardDescription>
                        )}
                    </CardHeader>
                    <CardContent>
                        <Separator />
                        <InfoRow
                            label={t("telegram-user-id")}
                            value={user?.id}
                            canCopy
                        />
                        <Separator />
                        <InfoRow
                            label={t("language-code")}
                            value={user?.languageCode}
                        />
                    </CardContent>
                </Card>

                {/* Account Stats Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("account-stats")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <BalanceDisplay />
                        <Button asChild size="lg" className="w-full">
                            <Link href={"/wallet/top-up"}>
                                <PlusCircle className="me-2 h-5 w-5" />
                                {t("top-up-account")}
                            </Link>
                        </Button>
                        <Separator />
                        <div className="flex items-center justify-between rounded-lg border p-4">
                            <div className="flex items-center">
                                <ShoppingBag className="me-3 h-6 w-6 text-primary" />
                                <span className="font-medium">
                                    {t("total-orders")}
                                </span>
                            </div>
                            {userB ? userB.orderCount : (<Skeleton className="h-6 w-8" />)}
                        </div>
                    </CardContent>
                </Card>

                {/* Settings Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>{t("settings")}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <LocaleSwitcher />
                    </CardContent>
                </Card>
            </div>
        </Page>
    );
}
