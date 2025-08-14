"use client";

import { useTranslations } from "next-intl";
import { use, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { getCookieCSRF } from "@/actions/auth.action";
import { getOrderWithPanelUser } from "@/actions/order.action";
import { Page } from "@/components/Page";
import {
    OrderDetailView,
    OrderDetailSkeleton,
} from "@/components/order/OrderDetailView";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";

type Order = { id: string; name: string; product: string };
type PanelUser = {
    username: string;
    onlineAt?: string;
    isActive: boolean;
    dataLimit: number;
    lifetimeUsedTraffic: number;
    expireStrategy: string;
    expireDate?: string;
    usageDuration?: number;
    subscriptionUrl: string;
};

type Props = {
    params: Promise<{ id: string }>;
};

export default function OrderIdPage({ params }: Props) {
    const t = useTranslations("i18n");
    const { id } = use(params);

    const [order, setOrder] = useState<Order | null>(null);
    const [panelUser, setPanelUser] = useState<PanelUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchOrderDetails = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken((await getCookieCSRF()) ?? "");
                const resultStr = await getOrderWithPanelUser({ id, csrf });
                const result = JSON.parse(resultStr);

                if (!result.success) {
                    throw new Error(result.message);
                }

                setOrder(result.data.order);
                setPanelUser(result.data.panelUser);
            } catch (error: any) {
                toast.error(`${t("list-unsuccessfully")}: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [id, t]); 

    return (
        <Page back={true}>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container mx-auto p-4 md:p-6">
                {isLoading ? (
                    <OrderDetailSkeleton />
                ) : (
                    <OrderDetailView order={order} panelUser={panelUser} />
                )}
            </div>
        </Page>
    );
}
