"use client";

import { Page } from "@/components/Page";
import { useEffect, useState } from "react";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import { getOrderWithPanelUserForAdmin } from "@/actions/order.action";
import toast from "react-hot-toast";
import {
    OrderDetailView,
    OrderDetailSkeleton,
} from "@/components/order/OrderDetailView";

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
    params: { id: string };
};

export default function OrderDetailPage({ params }: Props) {
    const { id } = params;
    const [order, setOrder] = useState<Order | null>(null);
    const [panelUser, setPanelUser] = useState<PanelUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            setIsLoading(true);

            try {
                const csrf = generateCsrfToken(getCookie("csrf") ?? "");
                const result = JSON.parse(
                    await getOrderWithPanelUserForAdmin({ id, csrf })
                );

                if (result.success) {
                    setOrder(result.data.order);
                    setPanelUser(result.data.panelUser);
                } else {
                    toast.error(
                        `Failed to get order details: ${result.message}`
                    );
                }
            } catch (error) {
                toast.error("An unexpected error occurred.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrderDetails();
    }, [id]);

    return (
        <Page back={true}>
            <div className="p-4 md:p-6">
                {isLoading ? (
                    <OrderDetailSkeleton />
                ) : (
                    <OrderDetailView order={order} panelUser={panelUser} />
                )}
            </div>
        </Page>
    );
}
