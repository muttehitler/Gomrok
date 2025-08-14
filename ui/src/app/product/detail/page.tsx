"use client";

import { Page } from "@/components/Page";
import { ProductDetailView } from "@/components/product/ProductDetailView";
import { Suspense } from "react";
import { Toaster } from "react-hot-toast";

const ProductDetailPage = () => {
    return (
        <Page back={true}>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container mx-auto p-4 md:p-6">
                {/* Suspense is used to handle components that rely on searchParams */}
                <Suspense fallback={<div>Loading...</div>}>
                    <ProductDetailView />
                </Suspense>
            </div>
        </Page>
    );
};

export default ProductDetailPage;
