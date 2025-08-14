"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FC } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BatteryCharging, Clock, Users, Tag, Infinity } from "lucide-react";

type ProductBoxItemProps = {
    id: string;
    name: string;
    payAsYouGo: boolean;
    usageDuration: number;
    dataLimit: number;
    userLimit: number;
    price: number;
};

// Helper component to display product features with an icon
const ProductFeature: FC<{
    icon: React.ElementType;
    text: string | number;
    label: string;
}> = ({ icon: Icon, text, label }) => (
    <div className="flex items-center text-sm text-muted-foreground">
        <Icon className="me-2 h-4 w-4" />
        <span>
            {text} {label}
        </span>
    </div>
);

export const ProductBoxItem: FC<ProductBoxItemProps> = ({
    id,
    name,
    usageDuration,
    dataLimit,
    userLimit,
    price,
    payAsYouGo,
}) => {
    const t = useTranslations("i18n");
    const router = useRouter();

    const days = Math.round(usageDuration / 60 / 60 / 24);
    const gigabytes = dataLimit / 1024 / 1024 / 1024;

    return (
        <Card
            onClick={() => router.push(`/product/detail?product=${id}`)}
            className="flex flex-col cursor-pointer transition-all hover:border-primary hover:shadow-lg"
        >
            <CardHeader>
                <CardTitle className="truncate">{name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                {payAsYouGo ? (
                    <ProductFeature
                        icon={Infinity}
                        text={t("pay-as-you-go")}
                        label=""
                    />
                ) : (
                    <>
                        <ProductFeature
                            icon={Clock}
                            text={days}
                            label={t("days")}
                        />
                        <ProductFeature
                            icon={BatteryCharging}
                            text={gigabytes}
                            label={t("gb")}
                        />
                        <ProductFeature
                            icon={Users}
                            // Bug Fix: Displaying userLimit instead of dataLimit
                            text={userLimit}
                            label={t("user")}
                        />
                    </>
                )}
            </CardContent>
            <CardFooter>
                <div className="flex items-center text-lg font-semibold text-primary">
                    <Tag className="me-2 h-5 w-5" />
                    <span>
                        {price} {t("toman")}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
};

// Skeleton loader for the ProductBoxItem
export const ProductBoxItemSkeleton: FC = () => {
    return (
        <Card className="flex flex-col">
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="flex-grow space-y-3">
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-1/2" />
                <Skeleton className="h-5 w-1/2" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-6 w-1/3" />
            </CardFooter>
        </Card>
    );
};
