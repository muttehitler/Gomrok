"use client";

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { getPanelList } from "@/actions/panel.action";
import { getProduct, updateProduct } from "@/actions/product.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import emitter from "@/lib/utils/eventEmitter";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";

type Panel = {
    id: string;
    name: string;
};

type EditProductProp = {
    id: string;
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
};

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    panel: z.string().min(1, "Panel is required"),
    price: z.coerce.number().min(0, "Price must be a positive number"),
    weight: z.coerce.number(),
    dataLimit: z.coerce.number().min(0, "Data limit must be a positive number"),
    usageDuration: z.coerce
        .number()
        .min(0, "Usage duration must be a positive number"),
    userLimit: z.coerce.number().min(0, "User limit must be a positive number"),
    payAsYouGo: z.boolean(),
    onHold: z.boolean(),
});

type ProductFormValues = z.infer<typeof formSchema>;

const FormSkeleton = () => (
    <div className="space-y-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </div>
        <div className="flex justify-end gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
        </div>
    </div>
);

export const EditProduct: FC<EditProductProp> = ({
    id,
    open,
    onOpenChange,
}) => {
    const t = useTranslations("i18n");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [panels, setPanels] = useState<Panel[]>([]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (open) {
            const fetchInitialData = async () => {
                setIsLoading(true);
                try {
                    const csrf = generateCsrfToken(getCookie("csrf") ?? "");
                    const [panelResultStr, productResultStr] =
                        await Promise.all([
                            getPanelList({
                                csrf,
                                startIndex: 0,
                                limit: 100,
                                order: -1,
                            }),
                            getProduct({ id, csrf }),
                        ]);

                    const panelsData = JSON.parse(panelResultStr);
                    if (panelsData.success) {
                        setPanels(panelsData.data.items);
                    } else {
                        toast.error(
                            `Failed to load panels: ${panelsData.message}`
                        );
                    }

                    const productData = JSON.parse(productResultStr);
                    if (productData.success) {
                        form.reset({
                            name: productData.data.name,
                            panel: productData.data.panel,
                            price: productData.data.price,
                            weight: productData.data.weight,
                            dataLimit:
                                productData.data.dataLimit / Math.pow(1024, 3),
                            usageDuration:
                                productData.data.usageDuration / (24 * 60 * 60),
                            userLimit: productData.data.userLimit,
                            payAsYouGo: productData.data.payAsYouGo,
                            onHold: productData.data.onHold,
                        });
                    } else {
                        toast.error(
                            `Failed to load product data: ${productData.message}`
                        );
                        onOpenChange(false); // Close modal if product data fails
                    }
                } catch (error) {
                    toast.error(
                        "An unexpected error occurred while loading data."
                    );
                    console.error(error);
                    onOpenChange(false);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchInitialData();
        }
    }, [id, open, form, onOpenChange]);

    const onSubmit = async (values: ProductFormValues) => {
        setIsSubmitting(true);
        try {
            const csrf = generateCsrfToken(getCookie("csrf") ?? "");
            const payload = {
                ...values,
                id,
                csrf,
                dataLimit: values.dataLimit * Math.pow(1024, 3),
                usageDuration: values.usageDuration * 24 * 60 * 60,
            };

            const resultStr = await updateProduct(payload);
            const result = JSON.parse(resultStr);

            if (!result.success) {
                toast.error(`${t("update-unsuccessfully")}: ${result.message}`);
                return;
            }

            toast.success(t("updated-successfully"));
            emitter.emit("listProducts");
            onOpenChange(false);
        } catch (error) {
            toast.error(
                "An unexpected error occurred while updating the product."
            );
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-2xl w-[90%] rounded-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("edit-product")}</DialogTitle>
                    <DialogDescription>
                        {t("edit_panel_description")}
                    </DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <FormSkeleton />
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-6"
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("product-name")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="panel"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{t("panel")}</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue
                                                            placeholder={t(
                                                                "choose-a-panel-type"
                                                            )}
                                                        />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {panels.map((p) => (
                                                        <SelectItem
                                                            key={p.id}
                                                            value={p.id}
                                                        >
                                                            {p.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="price"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("product-price")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="weight"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("product-weight")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dataLimit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("product-data-limit")} (GB)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="usageDuration"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("product-usage-duration")}{" "}
                                                (Days)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="userLimit"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("product-user-limit")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="payAsYouGo"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>
                                                    {t("pay-as-you-go")}
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="onHold"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                            <div className="space-y-0.5">
                                                <FormLabel>
                                                    {t("on-hold")}
                                                </FormLabel>
                                            </div>
                                            <FormControl>
                                                <Switch
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => onOpenChange(false)}
                                    disabled={isSubmitting}
                                >
                                    {t("cancel")}
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? t("updating") : t("update")}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};
