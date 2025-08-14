"use client";

import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2, RefreshCw } from "lucide-react";

import { getCookieCSRF } from "@/actions/auth.action";
import { getProduct, getProductsByPanel } from "@/actions/product.action";
import { renewOrder } from "@/actions/order.action";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ProductBoxItemForModal } from "../productItem/productBoxItemForModal";
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

type RenewOrderProps = {
    orderId: string;
    currentProductId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

const ProductListSkeleton = () => (
    <div className="space-y-2">
        <div className="border rounded-lg p-4 h-24 animate-pulse bg-muted"></div>
        <div className="border rounded-lg p-4 h-24 animate-pulse bg-muted"></div>
        <div className="border rounded-lg p-4 h-24 animate-pulse bg-muted"></div>
    </div>
);

export const RenewOrder: FC<RenewOrderProps> = ({
    orderId,
    currentProductId,
    open,
    onOpenChange,
}) => {
    const t = useTranslations("i18n");
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            const fetchProducts = async () => {
                setIsLoading(true);
                try {
                    const csrf = generateCsrfToken((await getCookieCSRF())!);
                    const currentProduct = JSON.parse(
                        await getProduct({ id: currentProductId, csrf })
                    );
                    if (!currentProduct || !currentProduct.panel)
                        throw new Error(
                            "Could not find current product's panel."
                        );

                    const resultStr = await getProductsByPanel({
                        id: currentProduct.panel,
                        csrf,
                        startIndex: 0,
                        limit: 1000,
                        order: -1,
                    });
                    const result = JSON.parse(resultStr);

                    if (!result.success) throw new Error(result.message);

                    setProducts(
                        result.data.items.sort(
                            (a: Product, b: Product) => a.weight - b.weight
                        )
                    );
                } catch (error: any) {
                    toast.error(
                        `${t("list-unsuccessfully")}: ${error.message}`
                    );
                    onOpenChange(false);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProducts();
        }
    }, [open, currentProductId, onOpenChange, t]);

    const renewOrderHandler = async () => {
        setIsSubmitting(true);
        try {
            const csrf = generateCsrfToken((await getCookieCSRF())!);
            const resultStr = await renewOrder({
                id: orderId,
                product: selectedProduct,
                csrf,
            });
            const result = JSON.parse(resultStr);
            if (!result.success) throw new Error(result.message);

            toast.success(t("renewed-successfully"));
            onOpenChange(false);
            // Optionally, you can emit an event here to refresh the order list/details
            // emitter.emit("refreshOrderDetails");
        } catch (error: any) {
            toast.error(`${t("renew-unsuccessfully")}: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("renew-subscription")}</DialogTitle>
                    <DialogDescription>
                        {t("witch-plan-you-want-to-renew")}
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-4">
                    {isLoading ? (
                        <ProductListSkeleton />
                    ) : (
                        products.map((product) => (
                            <ProductBoxItemForModal
                                product={product}
                                selectedProductState={[
                                    selectedProduct,
                                    setSelectedProduct,
                                ]}
                                key={product.id}
                            />
                        ))
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {t("cancel")}
                    </Button>
                    <Button
                        onClick={renewOrderHandler}
                        disabled={!selectedProduct || isSubmitting}
                    >
                        {isSubmitting && (
                            <Loader2 className="me-2 h-4 w-4 animate-spin" />
                        )}
                        {t("renew")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
