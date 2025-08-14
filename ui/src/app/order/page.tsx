"use client";

import { useTranslations } from "next-intl";
import { Page } from "@/components/Page";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { getMyOrders } from "@/actions/order.action";
import { Pagination } from "@/components/pagination/pagination";
import { OrderItem } from "@/components/orderList/orderItem";
import { getCookieCSRF } from "@/actions/auth.action";
import { Skeleton } from "@/components/ui/skeleton";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
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

export default function UserOrderPage() {
    const t = useTranslations("i18n");
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([]);
    const [ordersLength, setOrdersLength] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        const fetchUserOrders = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken((await getCookieCSRF()) ?? "");
                const resultStr = await getMyOrders({
                    csrf,
                    startIndex: (currentPage - 1) * pageSize,
                    limit: pageSize,
                    order: -1,
                });
                const result = JSON.parse(resultStr);

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

        fetchUserOrders();
    }, [currentPage, pageSize, t]);

    return (
        <Page back={true}>
            <Toaster position="top-center" />
            <div className="container mx-auto p-4 md:p-6 space-y-6">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t("my-orders")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("my-orders-description")}
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
                                // This logic correctly sends users to the payment page for unpaid orders
                                orderDetailUrl={
                                    order.payed
                                        ? `/order/${order.id}`
                                        : `/order/detail?order=${order.id}`
                                }
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
