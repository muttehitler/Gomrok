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
import { Badge } from "@/components/ui/badge";
import { ChevronRight } from "lucide-react";

type OrderItemProps = {
    id: string;
    name: string;
    product: string;
    price: number;
    payed: boolean;
    finalPrice: number;
    orderDetailUrl?: string;
    showPayed?: boolean;
};

export const OrderItem: FC<OrderItemProps> = ({
    id,
    name,
    payed,
    finalPrice,
    orderDetailUrl,
    showPayed = false
}) => {
    const t = useTranslations("i18n");

    return (
        <Link href={orderDetailUrl ?? `/admin/order/${id}`} className="block mb-4">
            <Card className="transition-all hover:border-primary/80 hover:shadow-md">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="grid gap-1">
                        <CardTitle className="text-base font-semibold">
                            {name}
                        </CardTitle>
                        <CardDescription className="font-mono text-xs">
                            ID: {id}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                        {(!payed || showPayed) && (
                            <div className="flex flex-col items-end gap-2">
                                <Badge variant={payed ? "default" : "destructive"}>
                                    {t(payed ? "payed" : "not-payed")}
                                </Badge>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {finalPrice.toLocaleString()} {t("toman")}
                                </span>
                            </div>
                        )}
                        <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform rtl:rotate-180" />{" "}
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
};
