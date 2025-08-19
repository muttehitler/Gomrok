"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Payment } from "@/types/payment";
import { cva } from "class-variance-authority";
import { CreditCard, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

interface PaymentItemProps extends Payment {}

const statusBadge = cva("text-xs font-semibold", {
    variants: {
        status: {
            completed: "bg-green-100 text-green-800 border-green-200",
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
            failed: "bg-red-100 text-red-800 border-red-200",
        },
    },
    defaultVariants: {
        status: "pending",
    },
});

export const PaymentItem = ({
    id,
    amount,
    status,
    createdAt,
    currency,
    user,
}: PaymentItemProps) => {
    const t = useTranslations("i18n");

    const userInitials =
        (user?.firstName?.[0] || "") + (user?.lastName?.[0] || "");

    const formattedDate = useMemo(() => {
        return new Date(createdAt).toLocaleDateString("fa-IR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    }, [createdAt]);

    return (
        <Card>
            <CardContent className="p-4">
                <Link
                    href={`/admin/payment/${id}`}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-x-4">
                        <Avatar>
                            <AvatarImage
                                src={user.photoUrl}
                                alt={user.username}
                            />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold">
                                {user.firstName} {user.lastName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {formattedDate}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-x-4">
                        <div className="text-end">
                            <p className="font-mono text-lg font-semibold">
                                {amount.toLocaleString()} {currency}
                            </p>
                            <Badge className={statusBadge({ status })}>
                                {t(status)}
                            </Badge>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform rtl:rotate-180" />
                    </div>
                </Link>
            </CardContent>
        </Card>
    );
};
