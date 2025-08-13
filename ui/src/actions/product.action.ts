"use server";

import { validateCsrfTokenWithEx } from "@/lib/utils/csrf.helper";
import { PRODUCT_PATTERNS } from "@/patterns/product.pattern";
import axios from "axios";
import { cookies } from "next/headers";

// Helper function to create a standardized error response
const createErrorResponse = (message: string, status: number = 500) => {
    return JSON.stringify({ success: false, message, status });
};

// A robust fetcher function to handle API calls
async function safeApiCall(config: any, csrf: string) {
    try {
        validateCsrfTokenWithEx(
            csrf,
            (await cookies()).get("csrf")?.value ?? ""
        );
        const response = await axios(config);

        if (response.status >= 200 && response.status < 300) {
            return JSON.stringify(response.data);
        } else {
            const errorMessage =
                response.data?.message || `API Error: ${response.status}`;
            return createErrorResponse(errorMessage, response.status);
        }
    } catch (error: any) {
        console.error("API call failed:", error);
        const message =
            error.response?.data?.message ||
            "An unexpected server error occurred.";
        return createErrorResponse(message);
    }
}

export async function addProduct(formData: any) {
    const config = {
        method: "post",
        url: process.env.API_ADDRESS + PRODUCT_PATTERNS.ADD,
        data: formData,
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        validateStatus: () => true,
    };
    return await safeApiCall(config, formData.csrf);
}

export async function getProductList(data: any) {
    const config = {
        method: "get",
        url: `${process.env.API_ADDRESS}${PRODUCT_PATTERNS.GET_LIST}?startIndex=${data.startIndex}&&limit=${data.limit}&&order=${data.order}`,
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        validateStatus: () => true,
    };
    return await safeApiCall(config, data.csrf);
}

export async function deleteProduct(data: any) {
    const config = {
        method: "delete",
        url: process.env.API_ADDRESS + PRODUCT_PATTERNS.DELETE + data.id,
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        validateStatus: () => true,
    };
    return await safeApiCall(config, data.csrf);
}

export async function updateProduct(data: any) {
    const config = {
        method: "put",
        url: process.env.API_ADDRESS + PRODUCT_PATTERNS.UPDATE + data.id,
        data: data,
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        validateStatus: () => true,
    };
    return await safeApiCall(config, data.csrf);
}

export async function getProduct(data: any) {
    const config = {
        method: "get",
        url: process.env.API_ADDRESS + PRODUCT_PATTERNS.GET + data.id,
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        validateStatus: () => true,
    };
    return await safeApiCall(config, data.csrf);
}

export async function getProductsByPanel(data: any) {
    const config = {
        method: "get",
        url:
            process.env.API_ADDRESS +
            PRODUCT_PATTERNS.GET_BY_PANEL +
            data.id +
            `?startIndex=${data.startIndex}&&limit=${data.limit}&&order=${data.order}`,
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        validateStatus: () => true,
    };
    return await safeApiCall(config, data.csrf);
}

export async function getTestProductByPanel(data: any) {
    const config = {
        method: "get",
        url:
            process.env.API_ADDRESS +
            PRODUCT_PATTERNS.GET_TEST_BY_PANEL.replace(":panel", data.id),
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        validateStatus: () => true,
    };
    return await safeApiCall(config, data.csrf);
}
