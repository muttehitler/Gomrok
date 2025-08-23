"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import {
    BatteryCharging,
    Clock,
    Infinity,
    Tag,
    Users,
    Package,
    Server,
    Loader2,
} from "lucide-react";

import { getCookieCSRF } from "@/actions/auth.action";
import { addOrder } from "@/actions/order.action";
import { getPanelForUser } from "@/actions/panel.action";
import { getProductForUser } from "@/actions/product.action";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";

// Define Zod schema for the form
const formSchema = z.object({
    name: z.string().min(1, "Order name is required").regex(/^[a-z0-9_]+$/, { message: "Username can only contain English and lowercase letters and numbers." }),
});

// Define types for our data
type Product = {
    id: string;
    name: string;
    panel: string;
    payAsYouGo: boolean;
    usageDuration: number;
    dataLimit: number;
    userLimit: number;
    price: number;
};
type Panel = { id: string; name: string };

// A detailed skeleton loader for a better UX
const ProductDetailSkeleton = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader className="space-y-2">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-2/3" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-8 w-1/3" />
            </CardFooter>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-1/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-32 ms-auto" />
            </CardContent>
        </Card>
    </div>
);

export const ProductDetailView: FC = () => {
    const t = useTranslations("i18n");
    const router = useRouter();
    const searchParams = useSearchParams();
    const productId = searchParams.get("product");

    const [product, setProduct] = useState<Product | null>(null);
    const [panel, setPanel] = useState<Panel | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { name: "" },
    });

    useEffect(() => {
        if (!productId) {
            setIsLoading(false);
            toast.error(t("product-id-is-missing"));
            return;
        }

        const fetchDetails = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken((await getCookieCSRF())!);
                const productResultStr = await getProductForUser({
                    id: productId,
                    csrf,
                });
                const productData = JSON.parse(productResultStr);

                if (!productData || !productData.id) {
                    throw new Error(productData.message || "Product not found");
                }
                setProduct(productData);

                const panelResultStr = await getPanelForUser({
                    id: productData.panel,
                    csrf,
                });
                const panelData = JSON.parse(panelResultStr);

                if (!panelData || !panelData.id) {
                    throw new Error(panelData.message || "Panel not found");
                }
                setPanel(panelData);
            } catch (error: any) {
                toast.error(error.message || t("error-fetching-data"));
                console.error("Failed to fetch details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetails();
    }, [productId, t]);

    const addOrderHandler = async (data: z.infer<typeof formSchema>) => {
        if (!product) return;

        setIsSubmitting(true);
        try {
            const csrf = generateCsrfToken((await getCookieCSRF())!);
            const payload = { ...data, product: product.id, csrf };

            const resultStr = await addOrder(payload);
            const result = JSON.parse(resultStr);

            if (!result.success) {
                toast.error(`${t("add-unsuccessfully")}: ${result.message}`);
                return;
            }

            toast.success(t("added-successfully"));
            setTimeout(() => {
                router.push(`/order/detail?order=${result.data}`);
            }, 1000);
        } catch (error) {
            toast.error(t("an-unexpected-error-occurred"));
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <ProductDetailSkeleton />;
    if (!product || !panel)
        return (
            <p className="text-center text-muted-foreground">
                {t("product-not-found")}
            </p>
        );

    const days = Math.round(product.usageDuration / 60 / 60 / 24);
    const gigabytes = product.dataLimit / 1024 / 1024 / 1024;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                        <Package className="me-3 h-6 w-6" /> {product.name}
                    </CardTitle>
                    <CardDescription className="flex items-center pt-1">
                        <Server className="me-2 h-4 w-4" /> {panel.name}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
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
                <CardFooter className="pt-4">
                    <div className="flex items-center text-xl font-bold text-primary">
                        <Tag className="me-2 h-5 w-5" />
                        <span>
                            {product.price} {t("toman")}
                        </span>
                    </div>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("complete-your-order")}</CardTitle>
                    <CardDescription>
                        {t("give-your-plan-a-name")}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(addOrderHandler)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("plan-name")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "e-g-my-personal-plan"
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end pt-2">
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting && (
                                        <Loader2 className="me-2 h-4 w-4 animate-spin" />
                                    )}
                                    {t("confirm-and-pay")}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};
