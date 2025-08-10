"use client";

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { getPanel, testConnection, updatePanel } from "@/actions/panel.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import emitter from "@/lib/utils/eventEmitter";
import { cn } from "@/lib/utils";

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
import { Skeleton } from "@/components/ui/skeleton";

type EditPanelProp = {
    id: string;
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
};

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.string().min(1, "Type is required"),
    url: z.string().url("Invalid URL format"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    weight: z
        .string()
        .refine((val) => !isNaN(parseInt(val, 10)), {
            message: "Weight must be a number",
        }),
});

export const EditPanel: FC<EditPanelProp> = ({ id, open, onOpenChange }) => {
    const t = useTranslations("i18n");
    const [isLoading, setIsLoading] = useState(true);
    const [testConnectionText, setTestConnectionText] = useState(t("test"));

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "",
            url: "",
            username: "",
            password: "",
            weight: "0",
        },
    });

    useEffect(() => {
        if (open) {
            setIsLoading(true);
            const fetchPanelData = async () => {
                const csrf = generateCsrfToken(getCookie("csrf") ?? "");
                const panelData = JSON.parse(await getPanel({ id, csrf }));
                form.reset({
                    name: panelData.name,
                    type: panelData.type,
                    url: panelData.url,
                    username: panelData.username,
                    password: panelData.password,
                    weight: String(panelData.weight),
                });
                setIsLoading(false);
            };
            fetchPanelData();
        }
    }, [id, open, form]);

    const testConnectionHandler = async () => {
        setTestConnectionText(t("testing"));
        const data = form.getValues();
        const csrf = generateCsrfToken(getCookie("csrf") ?? "");
        const result = await testConnection({ ...data, csrf });
        setTestConnectionText(result === 200 ? t("successed") : t("fail"));
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const csrf = generateCsrfToken(getCookie("csrf") ?? "");
        const result = JSON.parse(await updatePanel({ ...values, id, csrf }));

        if (!result.success) {
            toast.error(`${t("update-unsuccessfully")}: ${result.message}`);
            return;
        }

        toast.success(t("updated-successfully"));
        emitter.emit("listPanels");
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {t("edit")} {form.getValues("name")}
                    </DialogTitle>
                    <DialogDescription>{t("panel-name")}</DialogDescription>
                </DialogHeader>

                {isLoading ? (
                    <div className="space-y-4 py-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("panel-name")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("panel-type")}</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
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
                                                <SelectItem value="marzneshin">
                                                    {t("marzneshin")}
                                                </SelectItem>
                                                <SelectItem value="marzban">
                                                    {t("marzban")}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("panel-url")}</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("panel-username")}
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("panel-password")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
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
                                            {t("panel-weight")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter className="pt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={testConnectionHandler}
                                >
                                    {testConnectionText}
                                </Button>
                                <Button type="submit">{t("update")}</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
};
