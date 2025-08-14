"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import { getCookieCSRF } from "@/actions/auth.action";
import { getProductsByPanel } from "@/actions/product.action";
import { Page } from "@/components/Page";
import {
    ProductBoxItem,
    ProductBoxItemSkeleton,
} from "@/components/productItem/productBoxItem";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";

type Product = {
    id: string;
    name: string;
    panel: string;
    payAsYouGo: boolean;
    usageDuration: number;
    dataLimit: number;
    userLimit: number;
    onHold: boolean;
    price: number;
    weight: number;
    code: string;
};

// Skeleton loader for the entire product list
const ProductListSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
            <ProductBoxItemSkeleton key={index} />
        ))}
    </div>
);

// Presentational Component
const ProductListView = () => {
    const t = useTranslations("i18n");
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    const panelId = searchParams.get("panel");

    useEffect(() => {
        if (!panelId) return;

        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const csrfToken = await getCookieCSRF();
                if (!csrfToken) throw new Error("CSRF token not found");

                const resultStr = await getProductsByPanel({
                    id: panelId,
                    csrf: generateCsrfToken(csrfToken),
                    startIndex: 0,
                    limit: 1000,
                    order: -1,
                });
                const result = JSON.parse(resultStr);

                if (!result.success) {
                    toast.error(
                        `${t("list-unsuccessfully")}: ${result.message}`
                    );
                    return;
                }
                const sortedProducts = result.data.items.sort(
                    (a: Product, b: Product) => a.weight - b.weight
                );
                setProducts(sortedProducts);
            } catch (error) {
                toast.error(t("error-fetching-data"));
                console.error("Failed to fetch products:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [panelId, t]);

    return (
        <div className="container mx-auto p-4 md:p-6">
            <div className="flex flex-col space-y-4">
                <h1 className="text-2xl font-bold tracking-tight">
                    {t("select-your-plan")}
                </h1>

                {isLoading ? (
                    <ProductListSkeleton />
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {products.map((product) => (
                            <ProductBoxItem {...product} key={product.id} />
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">
                        {t("no-products-found-for-this-location")}
                    </p>
                )}
            </div>
        </div>
    );
};

// Main Page Component (Container) wrapped in Suspense
export default function ProductPage() {
    return (
        <Page back={true}>
            <Toaster position="top-center" reverseOrder={false} />
            <Suspense fallback={<ProductListSkeleton />}>
                <ProductListView />
            </Suspense>
        </Page>
    );
}
