"use client";

import { getCookieCSRF } from "@/actions/auth.action";
import { getPayments } from "@/actions/payment.action";
import { PaymentItem } from "@/components/admin/payment/PaymentItem";
import { Page } from "@/components/Page";
import { Pagination } from "@/components/pagination/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { Payment } from "@/types/payment";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const PaymentListSkeleton = () => (
    <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
            <Card key={i}>
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-x-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-5 w-32" />
                            <Skeleton className="h-4 w-24" />
                        </div>
                    </div>
                    <div className="flex items-center gap-x-4">
                        <div className="space-y-2 text-end">
                            <Skeleton className="h-6 w-20 ml-auto" />
                            <Skeleton className="h-5 w-16 ml-auto" />
                        </div>
                        <Skeleton className="h-5 w-5" />
                    </div>
                </CardContent>
            </Card>
        ))}
    </div>
);

export default function AdminPaymentsPage() {
    const t = useTranslations("i18n");
    const [isLoading, setIsLoading] = useState(true);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [paymentsLength, setPaymentsLength] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        const fetchPayments = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken((await getCookieCSRF()) ?? "");
                const resultStr = await getPayments({
                    csrf,
                    startIndex: (currentPage - 1) * pageSize,
                    limit: pageSize,
                    order: -1, // Sort by newest first
                });
                const result = JSON.parse(resultStr);

                if (!result.success) {
                    throw new Error(result.message);
                }

                setPaymentsLength(result.data.length);
                setPayments(result.data.items);
            } catch (error: any) {
                toast.error(`${t("list-unsuccessfully")}: ${error.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPayments();
    }, [currentPage, pageSize, t]);

    return (
        <Page back={true}>
            <Toaster position="top-center" />
            <div className="container mx-auto max-w-4xl space-y-6 p-4 pb-28">
                <header>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {t("manage-payments")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("view-all-user-transactions")}
                    </p>
                </header>

                <div>
                    {isLoading ? (
                        <PaymentListSkeleton />
                    ) : payments.length > 0 ? (
                        <div className="space-y-4">
                            {payments.map((payment) => (
                                <PaymentItem {...payment} key={payment.id} />
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center">
                            <p className="text-muted-foreground">
                                {t("no-payments-found")}
                            </p>
                        </div>
                    )}
                </div>

                {paymentsLength > pageSize && (
                    <div className="mt-6 flex justify-center">
                        <Pagination
                            currentPageState={[currentPage, setCurrentPage]}
                            pageCount={Math.ceil(paymentsLength / pageSize)}
                        />
                    </div>
                )}
            </div>
        </Page>
    );
}
