"use client";

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useMemo } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    BatteryCharging,
    Clock,
    Infinity,
    Users,
    CheckCircle2,
} from "lucide-react";

// Define the types
type Product = {
    id: string;
    name: string;
    payAsYouGo: boolean;
    usageDuration: number;
    dataLimit: number;
    userLimit: number;
    price: number;
};

type ProductBoxItemForModalProps = {
    product: Product;
    selectedProductState: [string, Dispatch<SetStateAction<string>>];
};

// Reusable component for displaying product features
const ProductFeature: FC<{
    icon: React.ElementType;
    text: string | number;
    label: string;
}> = ({ icon: Icon, text, label }) => (
    <div className="flex items-center text-sm text-muted-foreground">
        <Icon className="me-2 h-4 w-4" />
        <span>
            {text} {label}
        </span>
    </div>
);

export const ProductBoxItemForModal: FC<ProductBoxItemForModalProps> = ({
    product,
    selectedProductState,
}) => {
    const t = useTranslations("i18n");
    const [selectedProduct, setSelectedProduct] = selectedProductState;
    const { id, name, usageDuration, dataLimit, userLimit, price, payAsYouGo } =
        product;

    const isSelected = selectedProduct === id;

    // Memoize calculations to avoid re-computing on every render
    const { days, gigabytes } = useMemo(
        () => ({
            days: Math.round(usageDuration / 60 / 60 / 24),
            gigabytes: dataLimit / 1024 / 1024 / 1024,
        }),
        [usageDuration, dataLimit]
    );

    return (
        <Card
            onClick={() => setSelectedProduct(id)}
            className="cursor-pointer transition-all relative"
            data-state={isSelected ? "selected" : "unselected"}
        >
            {isSelected && (
                <div className="absolute top-2 end-2 text-green-500">
                    <CheckCircle2 className="h-6 w-6" />
                </div>
            )}
            <CardHeader>
                <CardTitle className="truncate">{name}</CardTitle>
                <CardDescription>
                    {price.toLocaleString()} {t("toman")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {payAsYouGo ? (
                    <ProductFeature
                        icon={Infinity}
                        text={t("pay-as-you-go")}
                        label=""
                    />
                ) : (
                    <>
                        <ProductFeature
                            icon={Clock}
                            text={days}
                            label={t("days")}
                        />
                        <ProductFeature
                            icon={BatteryCharging}
                            text={gigabytes}
                            label={t("gb")}
                        />
                        <ProductFeature
                            icon={Users}
                            text={userLimit} // Bug Fixed
                            label={t("user")}
                        />
                    </>
                )}
            </CardContent>
        </Card>
    );
};
