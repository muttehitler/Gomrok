"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { useEffect, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";

import { getCookieCSRF } from "@/actions/auth.action";
import { createInvoice } from "@/actions/payment.action";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Page } from "@/components/Page";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";

const formSchema = z.object({
    amount: z.coerce.number().min(1000, "Amount must be at least 1,000"),
});

export default function TRXWalletPage() {
    const t = useTranslations("i18n");
    const router = useRouter();
    const [csrfToken, setCsrfToken] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchCsrf = async () => {
            const token = await getCookieCSRF();
            setCsrfToken(generateCsrfToken(token ?? ""));
        };
        fetchCsrf();
    }, []);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const createInvoiceHandler = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const payload = {
                paymentMethod: "trx-wallet",
                paymentOptions: data,
                csrf: csrfToken,
            };
            const resultStr = await createInvoice(payload);
            const result = JSON.parse(resultStr);

            if (!result.success) {
                throw new Error(result.message);
            }
            router.push(
                `/wallet/top-up/trx-wallet/verify?invoice=${result.data.id}`
            );
        } catch (error: any) {
            toast.error(`${t("create-unsuccessfully")}: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Page back={true}>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container mx-auto p-4 md:p-6">
                <Card className="max-w-lg mx-auto">
                    <CardHeader>
                        <CardTitle>{t("top-up-with-trx")}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Alert variant="destructive">
                            <TriangleAlert className="h-4 w-4" />
                            <AlertTitle>{t("important-notes")}</AlertTitle>
                            <AlertDescription className="space-y-1">
                                <p>{t("amount-alert")}</p>
                                <p>{t("date-alert")}</p>
                            </AlertDescription>
                        </Alert>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(
                                    createInvoiceHandler
                                )}
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("amount-in-toman")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g., 50000"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex justify-end pt-2">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting && (
                                            <Loader2 className="me-2 h-4 w-4 animate-spin" />
                                        )}
                                        {t("create-invoice")}
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </Page>
    );
}
