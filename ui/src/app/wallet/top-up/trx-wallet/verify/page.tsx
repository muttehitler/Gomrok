"use client";

import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast, { Toaster } from "react-hot-toast";
import { QRCodeSVG } from "qrcode.react";
import { themeParams, useSignal } from "@telegram-apps/sdk-react";
import { Loader2 } from "lucide-react";

import { getCookieCSRF } from "@/actions/auth.action";
import { getInvoice, verifyInvoice } from "@/actions/payment.action";
import { Clipboard } from "@/components/clipboard/clipboard";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";

const formSchema = z.object({
    hash: z.string().min(10, "Transaction hash is required"),
});

const VerifySkeleton = () => (
    <Card className="max-w-md mx-auto">
        <CardHeader className="items-center">
            <Skeleton className="h-8 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-6">
            <Skeleton className="h-64 w-64 mx-auto" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
            </div>
        </CardContent>
    </Card>
);

const VerifyView = () => {
    const t = useTranslations("i18n");
    const router = useRouter();
    const searchParams = useSearchParams();
    const invoiceId = searchParams.get("invoice");
    const tp = useSignal(themeParams.state);

    const [csrfToken, setCsrfToken] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (!invoiceId) {
            toast.error(t("invoice-id-is-missing"));
            router.push("/wallet");
            return;
        }

        const fetchInvoice = async () => {
            setIsLoading(true);
            try {
                const token = await getCookieCSRF();
                if (!token) throw new Error("Session not found");
                const csrf = generateCsrfToken(token);
                setCsrfToken(csrf);

                const resultStr = await getInvoice({ id: invoiceId, csrf });
                const result = JSON.parse(resultStr);

                if (!result.success) throw new Error(result.message);
                setWalletAddress(result.data.walletAddress);
            } catch (error: any) {
                toast.error(`${t("get-unsuccessfully")}: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInvoice();
    }, [invoiceId, router, t]);

    const verifyInvoiceHandler = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true);
        try {
            const payload = {
                csrf: csrfToken,
                paymentMethod: "trx-wallet",
                paymentData: { ...data, invoiceId },
            };
            const resultStr = await verifyInvoice(payload);
            const result = JSON.parse(resultStr);

            if (!result.success) throw new Error(result.message);

            toast.success(t("payment-verified-successfully"));
            setTimeout(() => router.push("/wallet"), 2000);
        } catch (error: any) {
            toast.error(`${t("verification-failed")}: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <VerifySkeleton />;

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader className="items-center text-center">
                <CardTitle>{t("complete-the-payment")}</CardTitle>
                <CardDescription>
                    {t("send-trx-to-this-address")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-center">
                    <QRCodeSVG
                        value={walletAddress}
                        size={256}
                        bgColor={tp.bgColor || "#ffffff"}
                        fgColor={tp.buttonTextColor || "#000000"}
                        imageSettings={{
                            src: "https://cdn-icons-png.flaticon.com/512/12114/12114250.png",
                            height: 64,
                            width: 64,
                            opacity: 1,
                            excavate: true,
                        }}
                    />
                </div>

                <Clipboard text={walletAddress} title={t("wallet-address")} />

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(verifyInvoiceHandler)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="hash"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        {t("transaction-hash")}
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter the transaction hash (TxID)"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end pt-2">
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="me-2 h-4 w-4 animate-spin" />
                                )}
                                {t("verify-payment")}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default function VerifyPage() {
    return (
        <Page back={true}>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container mx-auto p-4 md:p-6">
                <Suspense fallback={<VerifySkeleton />}>
                    <VerifyView />
                </Suspense>
            </div>
        </Page>
    );
}
