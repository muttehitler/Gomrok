"use client";

import { useTranslations } from "next-intl";
import { Page } from "@/components/Page";
import { AddProduct } from "@/components/addProduct/addProduct";
import { ProductList } from "@/components/productList/productList";

export default function ProductPage() {
    const t = useTranslations("i18n");

    return (
        <Page back={true}>
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {t("products")}
                    </h2>
                    <AddProduct />
                </div>
                <ProductList />
            </div>
        </Page>
    );
}
