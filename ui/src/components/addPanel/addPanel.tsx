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
import { cn } from "@/lib/utils";

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

type TestStatus = "idle" | "testing" | "success" | "fail";

export const AddPanel: FC = () => {
    const t = useTranslations("i18n");
    const [isOpen, setIsOpen] = useState(false);
    const [testStatus, setTestStatus] = useState<TestStatus>("idle");

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

        setTestStatus("testing");
        const data = form.getValues();
        const csrf = generateCsrfToken(getCookie("csrf") ?? "");
        const result = await testConnection({ ...data, csrf });

        if (result === 200) {
            toast.success(t("successed"));
            setTestStatus("success");
        } else {
            toast.error(t("fail"));
            setTestStatus("fail");
        }
        setTimeout(() => setTestStatus("idle"), 2000); // Reset after 2 seconds
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

    const getTestButtonText = () => {
        switch (testStatus) {
            case "testing":
                return t("testing");
            case "success":
                return t("successed");
            case "fail":
                return t("fail");
            default:
                return t("test-panel-connection");
        }
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
                            {/* Form Fields remain the same */}
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        {" "}
                                        <FormLabel>
                                            {t("panel-name")}
                                        </FormLabel>{" "}
                                        <FormControl>
                                            <Input
                                                placeholder={t("panel-name")}
                                                {...field}
                                            />
                                        </FormControl>{" "}
                                        <FormMessage />{" "}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        {" "}
                                        <FormLabel>
                                            {t("panel-type")}
                                        </FormLabel>{" "}
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
                                                <SelectItem value="marzneshin">
                                                    {t("marzneshin")}
                                                </SelectItem>{" "}
                                                <SelectItem value="marzban">
                                                    {t("marzban")}
                                                </SelectItem>{" "}
                                            </SelectContent>{" "}
                                        </Select>{" "}
                                        <FormMessage />{" "}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="url"
                                render={({ field }) => (
                                    <FormItem>
                                        {" "}
                                        <FormLabel>
                                            {t("panel-url")}
                                        </FormLabel>{" "}
                                        <FormControl>
                                            <Input
                                                placeholder="https://example.com"
                                                {...field}
                                            />
                                        </FormControl>{" "}
                                        <FormMessage />{" "}
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        {" "}
                                        <FormLabel>
                                            {t("panel-username")}
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        {" "}
                                        <FormLabel>
                                            {t("panel-password")}
                                        </FormLabel>{" "}
                                        <FormControl>
                                            <Input type="password" {...field} />
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
                                            {t("panel-weight")}
                                        </FormLabel>{" "}
                                        <FormControl>
                                            <Input type="number" {...field} />
                                        </FormControl>{" "}
                                        <FormMessage />{" "}
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsOpen(false)}
                                className="w-full sm:w-auto"
                            >
                                {t("cancel")}
                            </Button>
                            <div className="flex w-full gap-2 sm:w-auto">
                                <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={testConnectionHandler}
                                    disabled={testStatus === "testing"}
                                    className={cn("w-full sm:w-auto", {
                                        "bg-green-500 hover:bg-green-600 text-white":
                                            testStatus === "success",
                                        "bg-red-500 hover:bg-red-600 text-white":
                                            testStatus === "fail",
                                    })}
                                >
                                    {getTestButtonText()}
                                </Button>
                                <Button
                                    type="submit"
                                    className="w-full sm:w-auto"
                                >
                                    {t("add")}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
