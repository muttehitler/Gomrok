"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getLocations } from "@/actions/panel.action";
import {
    LocationItem,
    LocationItemSkeleton,
} from "@/components/locationItem/locationItem";
import { getCookie } from "@/lib/utils/cookie.helper";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";

type Panel = {
    id: string;
    name: string;
    type: string;
    url: string;
    weight: number;
};

// کامپوننت داخلی برای نمایش اسکلت لودینگ
const LocationListSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
            <LocationItemSkeleton key={index} />
        ))}
    </div>
);

type LocationSelectorProps = {
    pageTitle: string;
    routeUrlPattern: (panelId: string) => string;
};

export const LocationSelector = ({
    pageTitle,
    routeUrlPattern,
}: LocationSelectorProps) => {
    const t = useTranslations("i18n");
    const [panels, setPanels] = useState<Panel[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken(getCookie("csrf") ?? "");
                const resultStr = await getLocations({
                    csrf,
                    startIndex: 0,
                    limit: 1000,
                    order: -1,
                });
                const result = JSON.parse(resultStr);

                if (!result.success) {
                    toast.error(
                        `${t("list-unsuccessfully")}: ${result.message}`
                    );
                    return;
                }
                const sortedPanels = result.data.items.sort(
                    (a: Panel, b: Panel) => a.weight - b.weight
                );
                setPanels(sortedPanels);
            } catch (error) {
                toast.error(t("error-fetching-data"));
                console.error("Failed to fetch locations:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, [t]);

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="flex flex-col space-y-4">
                <h1 className="text-2xl font-bold tracking-tight">
                    {pageTitle}
                </h1>

                {isLoading ? (
                    <LocationListSkeleton />
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {panels.map((panel) => (
                            <LocationItem
                                {...panel}
                                key={panel.id}
                                routeUrl={routeUrlPattern(panel.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
