"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import {
    BatteryCharging,
    Clock,
    Infinity,
    Loader2,
    Package,
    Server,
    Users,
} from "lucide-react";

import { getCookieCSRF } from "@/actions/auth.action";
import { addOrder, buyOrder, getOrder } from "@/actions/order.action";
import { getPanel } from "@/actions/panel.action";
import { getProduct, getTestProductByPanel } from "@/actions/product.action";
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
import { Skeleton } from "@/components/ui/skeleton";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";

// Define the types for our data
type Order = { id: string };
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
const TestAccountSkeleton = () => (
    <Card className="max-w-lg mx-auto">
        <CardHeader className="space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
        </CardContent>
        <CardFooter>
            <Skeleton className="h-10 w-40 ms-auto" />
        </CardFooter>
    </Card>
);

const TestAccountView = () => {
    const t = useTranslations("i18n");
    const router = useRouter();
    const searchParams = useSearchParams();
    const panelId = searchParams.get("panel");

    const [product, setProduct] = useState<Product | null>(null);
    const [panel, setPanel] = useState<Panel | null>(null);
    const [order, setOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!panelId) {
            toast.error(t("panel-id-is-missing"));
            setIsLoading(false);
            return;
        }

        const createTestOrder = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken((await getCookieCSRF())!);

                // 1. Get the test product for the panel
                const testProductStr = await getTestProductByPanel({
                    csrf,
                    id: panelId,
                });
                const testProductRes = JSON.parse(testProductStr);
                if (!testProductRes.success)
                    throw new Error(testProductRes.message);
                const fetchedProduct = testProductRes.data;

                // 2. Create an order for it
                const addOrderStr = await addOrder({
                    csrf,
                    product: fetchedProduct.id,
                });
                const addOrderRes = JSON.parse(addOrderStr);
                if (!addOrderRes.success) throw new Error(addOrderRes.message);
                const newOrder = { id: addOrderRes.data };

                // 3. Fetch panel details
                const panelStr = await getPanel({
                    id: fetchedProduct.panel,
                    csrf,
                });
                const fetchedPanel = JSON.parse(panelStr);
                if (!fetchedPanel || !fetchedPanel.id)
                    throw new Error("Panel not found");

                setProduct(fetchedProduct);
                setPanel(fetchedPanel);
                setOrder(newOrder);
            } catch (error: any) {
                toast.error(error.message || t("error-creating-test-order"));
                router.push("/panel"); // Redirect on error
            } finally {
                setIsLoading(false);
            }
        };

        createTestOrder();
    }, [panelId, router, t]);

    const buyTestOrder = async () => {
        if (!order) return;
        setIsSubmitting(true);
        try {
            const csrf = generateCsrfToken((await getCookieCSRF())!);
            const resultStr = await buyOrder({ id: order.id, csrf });
            const result = JSON.parse(resultStr);

            if (!result.success) throw new Error(result.message);

            toast.success(t("test-account-activated-successfully"));
            setTimeout(() => router.push(`/order/${order.id}`), 1000);
        } catch (error: any) {
            toast.error(`${t("activation-failed")}: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <TestAccountSkeleton />;
    if (!product || !panel)
        return (
            <p className="text-center text-muted-foreground">
                {t("test-plan-not-found")}
            </p>
        );

    const days = Math.round(product.usageDuration / 60 / 60 / 24);
    const gigabytes = product.dataLimit / 1024 / 1024 / 1024;

    return (
        <Card className="max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center text-xl">
                    <Package className="me-3 h-6 w-6" />{" "}
                    {t("your-free-test-plan")}
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
            <CardFooter className="flex justify-end pt-6">
                <Button onClick={buyTestOrder} disabled={isSubmitting}>
                    {isSubmitting && (
                        <Loader2 className="me-2 h-4 w-4 animate-spin" />
                    )}
                    {t("activate-test-account")}
                </Button>
            </CardFooter>
        </Card>
    );
};

export default function TestAccountOrderPage() {
    return (
        <Page back={true}>
            <Toaster position="top-center" />
            <div className="container mx-auto p-4 md-p-6">
                <Suspense fallback={<TestAccountSkeleton />}>
                    <TestAccountView />
                </Suspense>
            </div>
        </Page>
    );
}
