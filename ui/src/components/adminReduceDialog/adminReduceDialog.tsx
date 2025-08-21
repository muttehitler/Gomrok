"use client";

import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
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
import { MinusCircle } from "lucide-react";
import { decreaseUserBalance } from "@/actions/user.action";
import { getCookieCSRF } from "@/actions/auth.action";

const formSchema = z.object({
    amount: z.number().min(0, "Amount must be greater than zero!")
});

type adminReduceDialogViewProps = {
    id: string
};

export const AdminReduceDialog: FC<adminReduceDialogViewProps> = ({ id }) => {
    const t = useTranslations("i18n");
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const csrf = generateCsrfToken(await getCookieCSRF() ?? "");
        const result = JSON.parse(await decreaseUserBalance({ ...values, id, csrf }));

        if (!result.success) {
            toast.error(`${t("add-unsuccessfully")}: ${result.message}`);
            return;
        }

        toast.success(t("added-successfully"));
        emitter.emit("reload-user");
        setIsOpen(false);
        form.reset();
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="flex-1" variant="destructive">
                    <MinusCircle className="me-2 h-5 w-5" />
                    {t("reduce")}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg w-[90%] rounded-lg">
                <DialogHeader>
                    <DialogTitle>{t("reduce-account")}</DialogTitle>
                    <DialogDescription>{t("admin-reduce-desc")}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        <div className="grid gap-4 py-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        {" "}
                                        <FormLabel>
                                            {t("amount")}
                                        </FormLabel>{" "}
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder={t("amount")}
                                                {...field}
                                                onChange={(e) => field.onChange(e.target.value === "" ? undefined : Number(e.target.value))}
                                            />
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
                                    type="submit"
                                    className="w-full sm:w-auto"
                                >
                                    {t("reduce")}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
