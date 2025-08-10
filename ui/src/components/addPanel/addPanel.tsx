"use client";

import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import { addPanel, testConnection } from "@/actions/panel.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import toast from "react-hot-toast";
import emitter from "@/lib/utils/eventEmitter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { PlusCircle } from "lucide-react";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.string({ required_error: "Please select a panel type." }),
    url: z.string().url("Invalid URL format"),
    username: z.string().min(1, "Username is required"),
    password: z.string().min(1, "Password is required"),
    weight: z
        .string()
        .refine((val) => !isNaN(parseInt(val, 10)), {
            message: "Weight must be a number",
        }),
});

export const AddPanel: FC = () => {
    const t = useTranslations("i18n");
    const [isOpen, setIsOpen] = useState(false);
    const [testConnectionText, setTestConnectionText] = useState(
        t("test-panel-connection")
    );

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            url: "",
            username: "",
            password: "",
            weight: "0",
        },
    });

    const testConnectionHandler = async () => {
        const isValid = await form.trigger([
            "url",
            "username",
            "password",
            "type",
        ]);
        if (!isValid) {
            toast.error("Please fill required fields for testing connection.");
            return;
        }

        setTestConnectionText(t("testing"));
        const data = form.getValues();
        const csrf = generateCsrfToken(getCookie("csrf") ?? "");
        const result = await testConnection({ ...data, csrf });

        if (result === 200) {
            toast.success(t("successed"));
            setTestConnectionText(t("successed"));
        } else {
            toast.error(t("fail"));
            setTestConnectionText(t("fail"));
        }
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const csrf = generateCsrfToken(getCookie("csrf") ?? "");
        const result = JSON.parse(await addPanel({ ...values, csrf }));

        if (!result.success) {
            toast.error(`${t("add-unsuccessfully")}: ${result.message}`);
            return;
        }

        toast.success(t("added-successfully"));
        emitter.emit("listPanels");
        setIsOpen(false);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="me-2 h-4 w-4" />
                    {t("add-panel")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg w-[90%] rounded-lg">
                <DialogHeader>
                    <DialogTitle>{t("add-panel")}</DialogTitle>
                    <DialogDescription>{t("add-panel-desc")}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t("panel-name")}</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t("panel-name")}
                                                {...field}
                                            />
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
                                            <Input
                                                placeholder="https://example.com"
                                                {...field}
                                            />
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
                        </div>
                        <DialogFooter className="flex-col-reverse sm:flex-row sm:justify-between sm:space-x-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="w-full sm:w-auto"
                            >
                                {t("cancel")}
                            </Button>
                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={testConnectionHandler}
                                >
                                    {testConnectionText}
                                </Button>
                                <Button type="submit">{t("add")}</Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
