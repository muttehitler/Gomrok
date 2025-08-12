"use client";

import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import { getPanelList } from "@/actions/panel.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import toast from "react-hot-toast";
import emitter from "@/lib/utils/eventEmitter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addProduct } from "@/actions/product.action";
import { PlusCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
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
    test: z.boolean(),
    payAsYouGo: z.boolean(),
    onHold: z.boolean(),
});

type ProductFormValues = z.infer<typeof formSchema>;

type Panel = {
    id: string;
    name: string;
};

export const AddProduct: FC = () => {
    const t = useTranslations("i18n");
    const [isOpen, setIsOpen] = useState(false);
    const [panels, setPanels] = useState<Panel[]>([]);

    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            panel: "",
            price: 0,
            weight: 0,
            dataLimit: 0,
            usageDuration: 0,
            userLimit: 0,
            test: false,
            payAsYouGo: false,
            onHold: false,
        },
    });

    useEffect(() => {
        if (isOpen) {
            const fetchPanels = async () => {
                const csrf = generateCsrfToken(getCookie("csrf") ?? "");
                const result = JSON.parse(
                    await getPanelList({
                        csrf,
                        startIndex: 0,
                        limit: 100,
                        order: -1,
                    })
                );
                if (result.success) {
                    setPanels(result.data.items);
                } else {
                    toast.error("Failed to load panels.");
                }
            };
            fetchPanels();
        }
    }, [isOpen]);

    const onSubmit = async (values: ProductFormValues) => {
        const csrf = generateCsrfToken(getCookie("csrf") ?? "");
        const payload = {
            ...values,
            csrf,
            dataLimit: values.dataLimit * Math.pow(1024, 3),
            usageDuration: values.usageDuration * 24 * 60 * 60,
        };

        const result = JSON.parse(await addProduct(payload));

        if (!result.success) {
            toast.error(`${t("add-unsuccessfully")}: ${result.message}`);
            return;
        }

        toast.success(t("added-successfully"));
        emitter.emit("listProducts");
        setIsOpen(false);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="me-2 h-4 w-4" />
                    {t("add-product")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl w-[90%] rounded-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{t("add-product")}</DialogTitle>
                    <DialogDescription>
                        {t("add_panel_description")}
                    </DialogDescription>
                </DialogHeader>
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
                                        {" "}
                                        <FormLabel>
                                            {t("product-name")}
                                        </FormLabel>{" "}
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>{" "}
                                        <FormMessage />{" "}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="panel"
                                render={({ field }) => (
                                    <FormItem>
                                        {" "}
                                        <FormLabel>{t("panel")}</FormLabel>{" "}
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            {" "}
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t(
                                                            "choose-a-panel-type"
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>{" "}
                                            <SelectContent>
                                                {" "}
                                                {panels.map((p) => (
                                                    <SelectItem
                                                        key={p.id}
                                                        value={p.id}
                                                    >
                                                        {p.name}
                                                    </SelectItem>
                                                ))}{" "}
                                            </SelectContent>{" "}
                                        </Select>{" "}
                                        <FormMessage />{" "}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        {" "}
                                        <FormLabel>
                                            {t("product-price")}
                                        </FormLabel>{" "}
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>{" "}
                                        <FormMessage />{" "}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="weight"
                                render={({ field }) => (
                                    <FormItem>
                                        {" "}
                                        <FormLabel>
                                            {t("product-weight")}
                                        </FormLabel>{" "}
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>{" "}
                                        <FormMessage />{" "}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="dataLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        {" "}
                                        <FormLabel>
                                            {t("product-data-limit")} (GB)
                                        </FormLabel>{" "}
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>{" "}
                                        <FormMessage />{" "}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="usageDuration"
                                render={({ field }) => (
                                    <FormItem>
                                        {" "}
                                        <FormLabel>
                                            {t("product-usage-duration")} (Days)
                                        </FormLabel>{" "}
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>{" "}
                                        <FormMessage />{" "}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="userLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        {" "}
                                        <FormLabel>
                                            {t("product-user-limit")}
                                        </FormLabel>{" "}
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>{" "}
                                        <FormMessage />{" "}
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="test"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        {" "}
                                        <div className="space-y-0.5">
                                            {" "}
                                            <FormLabel>
                                                {t("test-account")}
                                            </FormLabel>{" "}
                                        </div>{" "}
                                        <FormControl>
                                            {" "}
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />{" "}
                                        </FormControl>{" "}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="payAsYouGo"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        {" "}
                                        <div className="space-y-0.5">
                                            {" "}
                                            <FormLabel>
                                                {t("pay-as-you-go")}
                                            </FormLabel>{" "}
                                        </div>{" "}
                                        <FormControl>
                                            {" "}
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />{" "}
                                        </FormControl>{" "}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="onHold"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                        {" "}
                                        <div className="space-y-0.5">
                                            {" "}
                                            <FormLabel>
                                                {t("on-hold")}
                                            </FormLabel>{" "}
                                        </div>{" "}
                                        <FormControl>
                                            {" "}
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />{" "}
                                        </FormControl>{" "}
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                            >
                                {t("cancel")}
                            </Button>
                            <Button type="submit">{t("add")}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
