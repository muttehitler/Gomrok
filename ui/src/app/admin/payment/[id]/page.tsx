
"use client";

import { Page } from "@/components/Page";
import { use, useEffect, useState } from "react";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import toast from "react-hot-toast";
import emitter from "@/lib/utils/eventEmitter";
import { PaymentDetailSkeleton, PaymentDetailView } from "@/components/paymentDetailView.tsx/paymentDetailView";
import { getPayment } from "@/actions/payment.action";
import { Payment } from "@/types/payment";

type Props = {
    params: Promise<{ id: string }>;
};

export default function UserDetailPage({ params }: Props) {
    const { id } = use(params);

    const [payment, setPayment] = useState<Payment | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken(getCookie("csrf") ?? "");
                const result = JSON.parse(await getPayment({ id, csrf }));

                if (result.success) {
                    setPayment(result.data);
                } else {
                    toast.error(`Failed to get payment: ${result.message}`);
                    setPayment(null);
                }
            } catch (error) {
                toast.error("An unexpected error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        emitter.on("reload-user", fetchUser);

        fetchUser();
    }, [id]);

    return (
        <Page back={true}>
            <div className="p-4 md:p-6">
                {isLoading ? (
                    <PaymentDetailSkeleton />
                ) : (
                    <PaymentDetailView payment={payment} />
                )}
            </div>
        </Page>
    );
}
