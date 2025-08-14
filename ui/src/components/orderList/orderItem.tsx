"use client";

import { useTranslations } from "next-intl";
import { FC } from "react";
import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

type Order = {
    id: string;
    name: string;
    product: string;
    price: number;
    payed: boolean;
    finalPrice: number;
    orderDetailUrl?: string
};

export const OrderItem: FC<Order> = ({
    id,
    name,
    product,
    price,
    payed,
    finalPrice,
    orderDetailUrl
}) => {
    const t = useTranslations("i18n");

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="grid gap-1">
                        <CardTitle className="text-base">{name}</CardTitle>
                        <CardDescription>
                            {t("price")}: {finalPrice.toLocaleString()}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        <Badge variant={payed ? "default" : "destructive"}>
                            {payed ? t("payed") : t("not-payed")}
                        </Badge>
                        <Button asChild variant="ghost" size="icon">
                            <Link href={orderDetailUrl ?? `/order/${id}`}>
                                <ChevronRight className="h-5 w-5" />
                                <span className="sr-only">{t("details")}</span>
                            </Link>
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
