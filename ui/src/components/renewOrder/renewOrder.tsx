"use client";

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

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

// Define the types
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

// FIX: Using the original props structure as requested, no features removed.
type RenewOrderProps = {
    id: string;
    product: string;
    visableState: [boolean, Dispatch<SetStateAction<boolean>>];
    subscriptionUrl: [string, Dispatch<SetStateAction<string>>];
};

const ProductListSkeleton = () => (
    <div className="space-y-2">
        <div className="border rounded-lg p-4 h-24 animate-pulse bg-muted"></div>
        <div className="border rounded-lg p-4 h-24 animate-pulse bg-muted"></div>
        <div className="border rounded-lg p-4 h-24 animate-pulse bg-muted"></div>
    </div>
);

export const RenewOrder: FC<RenewOrderProps> = ({
    id,
    product: currentProductId,
    visableState,
}) => {
    const t = useTranslations("i18n");
    const [isOpen, setIsOpen] = visableState;

    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
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
                    setIsOpen(false);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchProducts();
        }
    }, [isOpen, currentProductId, setIsOpen, t]);

    const renewOrderHandler = async () => {
        setIsSubmitting(true);
        try {
            const csrf = generateCsrfToken((await getCookieCSRF())!);
            const resultStr = await renewOrder({
                id,
                product: selectedProduct,
                csrf,
            });
            const result = JSON.parse(resultStr);
            if (!result.success) throw new Error(result.message);

            toast.success(t("renewed-successfully"));
            setIsOpen(false);
        } catch (error: any) {
            toast.error(`${t("renew-unsuccessfully")}: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                    <Button variant="outline" onClick={() => setIsOpen(false)}>
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
