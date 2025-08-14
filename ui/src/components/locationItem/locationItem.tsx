"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { FC } from "react";
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type LocationItemProps = {
    id: string;
    name: string;
    type: string;
    url: string;
    weight: number;
    routeUrl?: string;
};

export const LocationItem: FC<LocationItemProps> = ({
    id,
    name,
    type,
    routeUrl,
}) => {
    const router = useRouter();
    const t = useTranslations("i18n");

    const handleNavigation = () => {
        const destination = routeUrl ?? `/product?panel=${id}`;
        router.push(destination);
    };

    return (
        <Card
            onClick={handleNavigation}
            className="cursor-pointer transition-all hover:border-primary hover:shadow-md"
        >
            <CardHeader>
                <CardTitle className="text-lg">{name}</CardTitle>
                <CardDescription>{t("select-to-continue")}</CardDescription>
            </CardHeader>
        </Card>
    );
};

// A dedicated skeleton component for a location item
export const LocationItemSkeleton: FC = () => {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
        </Card>
    );
};
