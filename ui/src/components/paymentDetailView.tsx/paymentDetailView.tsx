"use client";

import { useLocale, useTranslations } from "next-intl";
import { FC } from "react";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

import moment from "moment";
import "moment/locale/ru";
import "moment/locale/fa";
import jmoment from "moment-jalaali";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Payment } from "@/types/payment";
import { UserItem } from "../userItem/userItem";

const InfoRow = ({
    label,
    value,
    copyButton = true
}: {
    label: string;
    value: string | number;
    copyButton?: boolean;
}) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(String(value));
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="flex items-start justify-between py-3">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="flex items-start gap-2 max-w-[70%] text-right">
                <p className="text-sm font-semibold break-words min-w-0">
                    {value}
                </p>
                {copyButton && (<Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={handleCopy}
                >
                    <Copy className="h-4 w-4" />
                </Button>)}
            </div>
        </div>
    );
};

export const PaymentDetailSkeleton = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </CardContent>
        </Card>
        <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
            </div>
            <Skeleton className="h-8 w-8" />
        </div>
    </div>
);

type PaymentDetailViewProps = {
    payment: Payment | null;
};

export const PaymentDetailView: FC<PaymentDetailViewProps> = ({ payment }) => {
    const t = useTranslations("i18n");
    const locale = useLocale();
    moment.locale(locale);
    if (locale == "fa")
        jmoment.loadPersian({
            dialect: "persian-modern",
            usePersianDigits: true,
        });

    if (!payment) {
        return (
            <div className="text-center">
                <p>{t("user-not-found")}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>{t("payment-details")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <InfoRow label={t("id")} value={payment.id} />
                    <Separator />
                    <InfoRow label={t("wallet-address")} value={payment.walletAddress ?? ''} />
                    <Separator />
                    <InfoRow label={t("amount")} value={payment.amount ?? ''} copyButton={false} />
                    <Separator />
                    <InfoRow label={t("completed")} value={t(payment.completed ? 'completed' : 'failed')} copyButton={false} />
                    <Separator />
                    <InfoRow label={t("currency")} value={payment.currency ?? ''} copyButton={false} />
                    <Separator />
                    <InfoRow label={t("payment-method")} value={t(payment.paymentMethod ?? '')} copyButton={false} />
                    <Separator />
                    <InfoRow label={t("created-at")} value={locale == "fa"
                        ? jmoment(payment.createdAt).format(
                            "dddd jD jMMMM jYYYY"
                        )
                        : moment(payment.createdAt).format(
                            "dddd D MMMM YYYY"
                        )} copyButton={false} />
                    <Separator />
                    <InfoRow label={t("updated-at")} value={locale == "fa"
                        ? jmoment(payment.updatedAt).format(
                            "dddd jD jMMMM jYYYY"
                        )
                        : moment(payment.updatedAt).format(
                            "dddd D MMMM YYYY"
                        )} copyButton={false} />
                </CardContent>
            </Card>

            <div className="space-y-4">
                <UserItem {...payment.user} />
            </div>
        </div>
    );
};
