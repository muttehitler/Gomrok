"use client";

import { useTranslations } from "next-intl";
import { Page } from "@/components/Page";
import { useEffect, useState } from "react";
import { getOrderList } from "@/actions/order.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { OrderItem } from "@/components/orderList/orderItem";
import { Pagination } from "@/components/pagination/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import toast, { Toaster } from "react-hot-toast";
import { getCookieCSRF } from "@/actions/auth.action";
import { Card, CardContent } from "@/components/ui/card";

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
            <Card key={i}>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-5 w-5" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

export default function AdminOrderListPage() {
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
                const csrf = generateCsrfToken((await getCookieCSRF()) ?? "");
                const result = JSON.parse(
                    await getOrderList({
                        csrf,
                        startIndex: (currentPage - 1) * pageSize,
                        limit: pageSize,
                        order: -1,
                    })
                );

                if (!result.success) {
                    throw new Error(result.message);
                }

                setOrdersLength(result.data.length);
                setOrders(result.data.items);
            } catch (error: any) {
                toast.error(`${t("list-unsuccessfully")}: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrders();
    }, [currentPage, pageSize, t]);

    return (
        <Page back={true}>
            <Toaster position="top-center" />
            <div className="container mx-auto p-4 md:p-6 space-y-6">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t("manage-orders")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("view-and-manage-all-user-orders")}
                    </p>
                </header>

                <div className="space-y-4">
                    {isLoading ? (
                        <OrderListSkeleton />
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderItem
                                {...order}
                                key={order.id}
                                orderDetailUrl={`/admin/order/${order.id}`}
                            />
                        ))
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">
                                {t("no-orders-found")}
                            </p>
                        </div>
                    )}
                </div>

                {ordersLength > pageSize && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            currentPageState={[currentPage, setCurrentPage]}
                            pageCount={Math.ceil(ordersLength / pageSize)}
                        />
                    </div>
                )}
            </div>
        </Page>
    );
}
