"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    BatteryCharging,
    Clock,
    Infinity,
    Tag,
    Loader2,
    Package,
    Server,
    Users,
} from "lucide-react";

import { getCookieCSRF } from "@/actions/auth.action";
import { buyOrder, getOrder } from "@/actions/order.action";
import { getPanel } from "@/actions/panel.action";
import { getProduct } from "@/actions/product.action";
import { Page } from "@/components/Page";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";

// Define the types for our data
type Order = {
    id: string;
    name: string;
    product: string;
    price: number;
    finalPrice: number;
    payed: boolean;
};
type Product = {
    id: string;
    name: string;
    panel: string;
    payAsYouGo: boolean;
    usageDuration: number;
    dataLimit: number;
    userLimit: number;
};
type Panel = { id: string; name: string };

// A detailed skeleton loader for a better UX
const OrderDetailSkeleton = () => (
    <Card className="max-w-lg mx-auto">
        <CardHeader className="space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
            <Skeleton className="h-5 w-full" />
        </CardContent>
        <CardFooter className="flex justify-between items-center">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-10 w-32" />
        </CardFooter>
    </Card>
);

const OrderDetailView = () => {
    const t = useTranslations("i18n");
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order");

    const [order, setOrder] = useState<Order | null>(null);
    const [product, setProduct] = useState<Product | null>(null);
    const [panel, setPanel] = useState<Panel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!orderId) {
            toast.error(t("order-id-is-missing"));
            setIsLoading(false);
            return;
        }

        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken((await getCookieCSRF())!);
                const orderResultStr = await getOrder({ id: orderId, csrf });
                const orderData = JSON.parse(orderResultStr);

                if (!orderData.success) throw new Error(orderData.message);
                if (orderData.data.payed) {
                    router.replace(`/order/${orderData.data.id}`);
                    return;
                }
                setOrder(orderData.data);

                const [productResultStr, panelResultStr] = await Promise.all([
                    getProduct({ id: orderData.data.product, csrf }),
                    getPanel({
                        id: JSON.parse(
                            await getProduct({
                                id: orderData.data.product,
                                csrf,
                            })
                        ).panel,
                        csrf,
                    }),
                ]);

                const productData = JSON.parse(productResultStr);
                const panelData = JSON.parse(panelResultStr);

                if (!productData || !productData.id)
                    throw new Error("Product not found");
                if (!panelData || !panelData.id)
                    throw new Error("Panel not found");

                setProduct(productData);
                setPanel(panelData);
            } catch (error: any) {
                toast.error(error.message || t("error-fetching-data"));
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [orderId, router, t]);

    const buyHandler = async () => {
        if (!orderId) return;
        setIsSubmitting(true);
        try {
            const csrf = generateCsrfToken((await getCookieCSRF())!);
            const resultStr = await buyOrder({ id: orderId, csrf });
            const result = JSON.parse(resultStr);

            if (!result.success) throw new Error(result.message);

            toast.success(t("purchased-successfully"));
            setTimeout(() => router.push(`/order/${orderId}`), 1000);
        } catch (error: any) {
            toast.error(`${t("purchase-unsuccessfully")}: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <OrderDetailSkeleton />;
    if (!order || !product || !panel)
        return (
            <p className="text-center text-muted-foreground">
                {t("order-details-not-found")}
            </p>
        );

    const days = Math.round(product.usageDuration / 60 / 60 / 24);
    const gigabytes = product.dataLimit / 1024 / 1024 / 1024;

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                    <Package className="me-3 h-6 w-6" /> {product.name}
                </CardTitle>
                <CardDescription className="flex items-center pt-1">
                    <Server className="me-2 h-4 w-4" /> {panel.name}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-muted-foreground">
                {product.payAsYouGo ? (
                    <div className="flex items-center">
                        <Infinity className="me-2 h-4 w-4" />{" "}
                        {t("pay-as-you-go")}
                    </div>
                ) : (
                    <>
                        <div className="flex items-center">
                            <Clock className="me-2 h-4 w-4" /> {days}{" "}
                            {t("days")}
                        </div>
                        <div className="flex items-center">
                            <BatteryCharging className="me-2 h-4 w-4" />{" "}
                            {gigabytes} {t("gb")}
                        </div>
                        <div className="flex items-center">
                            <Users className="me-2 h-4 w-4" />{" "}
                            {product.userLimit} {t("user")}
                        </div>
                    </>
                )}
            </CardContent>
            <Separator />
            <CardFooter className="flex justify-between items-center pt-6">
                <div className="text-lg font-bold">
                    <span className="text-muted-foreground me-2">
                        {t("final-price")}:
                    </span>
                    <span className="text-primary">
                        {order.finalPrice.toLocaleString()} {t("toman")}
                    </span>
                </div>
                <Button onClick={buyHandler} disabled={isSubmitting}>
                    {isSubmitting && (
                        <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    )}
                    {t("pay-from-wallet")}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default function OrderDetailPage() {
    return (
        <Page back={true}>
            <Toaster position="top-center" />
            <div className="container mx-auto p-4 md:p-6">
                <Suspense fallback={<OrderDetailSkeleton />}>
                    <OrderDetailView />
                </Suspense>
            </div>
        </Page>
    );
}
