"use server";

import { validateCsrfTokenWithEx } from "@/lib/utils/csrf.helper";
import { PAYMENT_PATTERNS } from "@/patterns/payment.pattern";
import axios from "axios";
import { cookies } from "next/headers";

export async function createInvoice(data: any) {
    data.amount = parseFloat(data.amount);
    validateCsrfTokenWithEx(
        data.csrf,
        (await cookies()).get("csrf")?.value ?? ""
    );
    const response = await axios.post(
        process.env.API_ADDRESS + PAYMENT_PATTERNS.CREATE_INVOICE,
        data,
        {
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                authorization:
                    "Bearer " + (await cookies()).get("token")?.value,
            },
            validateStatus: () => true,
        }
    );
    return JSON.stringify(response.data);
}

export async function getInvoice(data: any) {
    validateCsrfTokenWithEx(
        data.csrf,
        (await cookies()).get("csrf")?.value ?? ""
    );
    const response = await axios.get(
        process.env.API_ADDRESS + PAYMENT_PATTERNS.GET + data.id,
        {
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                authorization:
                    "Bearer " + (await cookies()).get("token")?.value,
            },
            validateStatus: () => true,
        }
    );
    return JSON.stringify(response.data);
}

export async function verifyInvoice(data: any) {
    validateCsrfTokenWithEx(
        data.csrf,
        (await cookies()).get("csrf")?.value ?? ""
    );
    const response = await axios.post(
        process.env.API_ADDRESS + PAYMENT_PATTERNS.VERIFY,
        data,
        {
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                authorization:
                    "Bearer " + (await cookies()).get("token")?.value,
            },
            validateStatus: () => true,
        }
    );
    return JSON.stringify(response.data);
}

export async function getBalanceLogsList(data: any) {
    validateCsrfTokenWithEx(
        data.csrf,
        (await cookies()).get("csrf")?.value ?? ""
    );
    const response = await axios.get(
        process.env.API_ADDRESS +
            PAYMENT_PATTERNS.BALANCE_LOG.GET_LIST +
            `?startIndex=${data.startIndex}&&limit=${data.limit}`,
        {
            headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                authorization:
                    "Bearer " + (await cookies()).get("token")?.value,
            },
            validateStatus: () => true,
        }
    );
    return JSON.stringify(response.data);
}

export async function getPayments(data: {
    csrf: string;
    startIndex: number;
    limit: number;
    order: number;
}) {
    validateCsrfTokenWithEx(
        data.csrf,
        (await cookies()).get("csrf")?.value ?? ""
    );

    const url =
        process.env.API_ADDRESS +
        PAYMENT_PATTERNS.GET_LIST + // <- از پترن جدید استفاده شد
        `?startIndex=${data.startIndex}&limit=${data.limit}&order=${data.order}`;

    const response = await axios.get(url, {
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        validateStatus: () => true,
    });
    return JSON.stringify(response.data);
}
