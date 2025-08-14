"use client";

import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Wallet } from "lucide-react";

import { getCookieCSRF } from "@/actions/auth.action";
import { getUserBalance } from "@/actions/user.action";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";

// A dedicated skeleton component for the balance display
const BalanceSkeleton: FC = () => {
    return (
        <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
                <Skeleton className="h-6 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
            </div>
        </div>
    );
};

export const BalanceDisplay: FC = () => {
    const t = useTranslations("i18n");
    const [userBalance, setUserBalance] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBalance = async () => {
            setIsLoading(true);
            try {
                const csrfToken = await getCookieCSRF();
                if (!csrfToken) throw new Error("CSRF token not found.");

                const resultStr = await getUserBalance({
                    csrf: generateCsrfToken(csrfToken),
                });
                const result = JSON.parse(resultStr);

                if (!result.success) {
                    throw new Error(result.message);
                }

                setUserBalance(result.data);
            } catch (error: any) {
                toast.error(
                    `${t("get-balance-unsuccessfully")}: ${error.message}`
                );
                setUserBalance(0); // Set a default value on error
            } finally {
                setIsLoading(false);
            }
        };

        fetchBalance();
    }, [t]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("your-wallet-balance")}</CardTitle>
            </CardHeader>
            <CardContent>
                {isLoading ? (
                    <Skeleton className="h-10 w-48" />
                ) : (
                    <div className="flex items-center text-3xl font-bold text-primary">
                        <Wallet className="me-3 h-8 w-8" />
                        <span>
                            {userBalance?.toLocaleString() ?? "0"}{" "}
                            <span className="text-lg font-medium text-muted-foreground">
                                {t("toman")}
                            </span>
                        </span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
