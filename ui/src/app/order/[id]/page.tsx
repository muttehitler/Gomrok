"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, Suspense } from "react";
import toast, { Toaster } from "react-hot-toast";

import { getCookieCSRF } from "@/actions/auth.action";
import { getOrderWithPanelUser } from "@/actions/order.action";
import { Page } from "@/components/Page";
import {
    OrderDetailView,
    OrderDetailSkeleton,
} from "@/components/order/OrderDetailView";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";

// Define the types for our data
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

// This is the main view component that fetches and manages state.
const OrderView = ({ orderId }: { orderId: string }) => {
    const t = useTranslations("i18n");
    const [order, setOrder] = useState<Order | null>(null);
    const [panelUser, setPanelUser] = useState<PanelUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            setIsLoading(false);
            return;
        }

        const fetchOrderDetails = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken((await getCookieCSRF()) ?? "");
                const resultStr = await getOrderWithPanelUser({
                    id: orderId,
                    csrf,
                });
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
    }, [orderId, t]);

    if (isLoading) {
        return <OrderDetailSkeleton />;
    }

    if (!order || !panelUser) {
        return (
            <div className="text-center text-muted-foreground">
                {t("order-could-not-be-loaded")}
            </div>
        );
    }

    // We now render the clean, refactored OrderDetailView component
    return <OrderDetailView order={order} panelUser={panelUser} />;
};

// The page itself remains simple, handling Suspense and passing params.
export default function OrderIdPage({ params }: { params: { id: string } }) {
    return (
        <Page back={true}>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container mx-auto p-4 md:p-6">
                <Suspense fallback={<OrderDetailSkeleton />}>
                    <OrderView orderId={params.id} />
                </Suspense>
            </div>
        </Page>
    );
}
