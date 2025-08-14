"use client";

import { useTranslations } from "next-intl";
import { Page } from "@/components/Page";
import { useEffect, useState } from "react";
import { getOrderList } from "@/actions/order.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { OrderItem } from "@/components/orderList/orderItem";
import { Pagination } from "@/components/pagination/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import { getCookieCSRF } from "@/actions/auth.action";

type Order = {
    id: string;
    name: string;
    payed: boolean;
    product: string;
    price: number;
    finalPrice: number;
};

const OrderListSkeleton = () => (
    <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
            <div
                key={i}
                className="flex items-center justify-between p-4 border rounded-lg"
            >
                <div className="space-y-1">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        ))}
    </div>
);

export default function OrderListPage() {
    const t = useTranslations("i18n");
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [ordersLength, setOrdersLength] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken(await getCookieCSRF() ?? "");
                const result = JSON.parse(
                    await getOrderList({
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

                setOrdersLength(result.data.length);
                setOrders(result.data.items);
            } catch (error) {
                toast.error(
                    "An unexpected error occurred while fetching orders."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage, pageSize, t]);

    return (
        <Page back={true}>
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {t("orders")}
                    </h2>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <OrderListSkeleton />
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderItem {...order} key={order.id} orderDetailUrl={`/admin/order/${order.id}`} />
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center">
                            {t("no-orders-found")}
                        </p>
                    )}
                </div>

                <div className="mt-6">
                    <Pagination
                        currentPageState={[currentPage, setCurrentPage]}
                        pageCount={Math.ceil(ordersLength / pageSize)}
                    />
                </div>
            </div>
        </Page>
    );
}
