"use client";

import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import { getProductList } from "@/actions/product.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import { ProductItem } from "./productItem";
import emitter from "@/lib/utils/eventEmitter";
import toast from "react-hot-toast";
import { Pagination } from "../pagination/pagination";
import { Skeleton } from "@/components/ui/skeleton";

type Product = {
    id: string;
    name: string;
    panel: string;
};

const ProductListSkeleton = () => (
    <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        ))}
    </div>
);

export const ProductList: FC = () => {
    const t = useTranslations("i18n");
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [productsLength, setProductsLength] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken(getCookie("csrf") ?? "");
                const result = JSON.parse(
                    await getProductList({
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

                setProductsLength(result.data.length);
                setProducts(result.data.items);
            } catch (error) {
                toast.error(
                    "An unexpected error occurred while fetching products."
                );
            } finally {
                setIsLoading(false);
            }
        };

        emitter.on("listProducts", fetchProducts);
        fetchProducts(); // Initial fetch

        return () => {
            emitter.off("listProducts", fetchProducts);
        };
    }, [currentPage, pageSize, t]);

    return (
        <div className="space-y-6">
            {isLoading ? (
                <ProductListSkeleton />
            ) : (
                <div className="space-y-4">
                    {products.length > 0 ? (
                        products.map((product) => (
                            <ProductItem {...product} key={product.id} />
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center">
                            {t("no-products-found")}
                        </p>
                    )}
                </div>
            )}

            <div className="mt-6">
                <Pagination
                    currentPageState={[currentPage, setCurrentPage]}
                    pageCount={Math.ceil(productsLength / pageSize)}
                />
            </div>
        </div>
    );
};
