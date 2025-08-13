"use client";

import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import { getPanelList } from "@/actions/panel.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import { PanelItem } from "./panelItem";
import emitter from "@/lib/utils/eventEmitter";
import toast from "react-hot-toast";
import { Pagination } from "../pagination/pagination";
import { Skeleton } from "@/components/ui/skeleton";

type Panel = {
    id: string;
    name: string;
    type: string;
    url: string;
    weight: number;
};

const PanelListSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-4 w-48 mt-2" />
            </div>
        ))}
    </div>
);

export const PanelList: FC = () => {
    const t = useTranslations("i18n");
    const [panels, setPanels] = useState<Panel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [panelsLength, setPanelsLength] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        const fetchPanels = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken(getCookie("csrf") ?? "");
                const result = JSON.parse(
                    await getPanelList({
                        csrf,
                        startIndex: (currentPage - 1) * pageSize,
                        limit: pageSize,
                        order: -1,
                    })
                );

                if (!result.success) {
                    toast.error(
                        `${t("list-unsuccessfully")}: ${result.message}`
                    );
                    return;
                }

                setPanelsLength(result.data.length);
                setPanels(result.data.items);
            } catch (error) {
                toast.error("An unexpected error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        emitter.on("listPanels", fetchPanels);
        fetchPanels();

        return () => {
            emitter.off("listPanels", fetchPanels);
        };
    }, [currentPage, pageSize, t]);

    return (
        <div className="space-y-6">
            {isLoading ? (
                <PanelListSkeleton />
            ) : (
                <div className="space-y-4">
                    {panels.length > 0 ? (
                        panels.map((panel) => (
                            <PanelItem {...panel} key={panel.id} />
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center">
                            {t("no-panels-found")}
                        </p>
                    )}
                </div>
            )}

            <div className="mt-6">
                <Pagination
                    currentPageState={[currentPage, setCurrentPage]}
                    pageCount={Math.ceil(panelsLength / pageSize)}
                />
            </div>
        </div>
    );
};
