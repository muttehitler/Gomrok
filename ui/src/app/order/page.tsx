'use client';

import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { generateCsrfToken } from '@/lib/utils/csrf.helper';
import { getMyOrders } from '@/actions/order.action';
import { Pagination } from '@/components/pagination/pagination';
import { OrderItem } from '@/components/orderList/orderItem';
import { getCookieCSRF } from '@/actions/auth.action';
import { Skeleton } from '@/components/ui/skeleton';

type Order = {
    id: string
    name: string
    payed: boolean
    product: string
    price: number
    finalPrice: number
}

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

export default function Order() {
    const t = useTranslations('i18n');

    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState<Order[]>([])
    const [ordersLength, setOrdersLength] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, _] = useState(10)

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            try {
                setOrders([])

                const csrf = generateCsrfToken(await getCookieCSRF() ?? "");
                const result = JSON.parse(
                    await getMyOrders({
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
        })()
    }, [currentPage])

    return (
        <Page back={true}>
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {t("my-orders")}
                    </h2>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <OrderListSkeleton />
                    ) : orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderItem {...order} key={order.id} orderDetailUrl={order.payed ? `/order/${order.id}` : `/order/detail?order=${order.id}`} />
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
            <Toaster position="top-right" reverseOrder={false} />
        </Page>
    )
}
