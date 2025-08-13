"use server";

import { validateCsrfTokenWithEx } from "@/lib/utils/csrf.helper";
import { PANEL_PATTERNS } from "@/patterns/panel.pattern";
import axios from "axios";
import { cookies } from "next/headers";

// Helper function to create a standardized error response
const createErrorResponse = (message: string, status: number = 500) => {
    // Note: Here we return a stringified JSON, so client always gets a parsable string
    return JSON.stringify({ success: false, message, status });
};

// A robust fetcher function to handle API calls
async function safeApiCall(
    config: any,
    csrf: string,
    isTestConnection: boolean = false
) {
    try {
        validateCsrfTokenWithEx(
            csrf,
            (await cookies()).get("csrf")?.value ?? ""
        );
        const response = await axios(config);

        if (response.status >= 200 && response.status < 300) {
            // testConnection returns data directly, not stringified JSON
            if (isTestConnection) {
                return response.data;
            }
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

export async function testConnection(formData: any) {
    const config = {
        method: "post",
        url: process.env.API_ADDRESS + PANEL_PATTERNS.TEST_CONNECTION,
        data: formData,
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        // For testConnection, we let axios handle error status
    };
    // This action is an exception and does not use the standard safeApiCall flow
    // because it's expected to throw on failure.
    try {
        validateCsrfTokenWithEx(
            formData.csrf,
            (await cookies()).get("csrf")?.value ?? ""
        );
        const response = await axios(config);
        return response.data;
    } catch (error: any) {
        // You might want to handle this differently depending on expected behavior
        return { success: false, message: error.message };
    }
}

export async function addPanel(formData: any) {
    const config = {
        method: "post",
        url: process.env.API_ADDRESS + PANEL_PATTERNS.ADD,
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

export async function getPanelList(data: any) {
    const config = {
        method: "get",
        url: `${process.env.API_ADDRESS}${PANEL_PATTERNS.GET_LIST}?startIndex=${data.startIndex}&&limit=${data.limit}&&order=${data.order}`,
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        validateStatus: () => true,
    };
    return await safeApiCall(config, data.csrf);
}

export async function getPanel(data: any) {
    const config = {
        method: "get",
        url: process.env.API_ADDRESS + PANEL_PATTERNS.GET + data.id,
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        validateStatus: () => true,
    };
    return await safeApiCall(config, data.csrf);
}

export async function updatePanel(data: any) {
    const config = {
        method: "put",
        url: process.env.API_ADDRESS + PANEL_PATTERNS.UPDATE + data.id,
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

export async function deletePanel(data: any) {
    const config = {
        method: "delete",
        url: process.env.API_ADDRESS + PANEL_PATTERNS.DELETE + data.id,
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        validateStatus: () => true,
    };
    return await safeApiCall(config, data.csrf);
}

export async function getLocations(data: any) {
    const config = {
        method: "get",
        url: `${process.env.API_ADDRESS}${PANEL_PATTERNS.GET_LOCATIONS}?startIndex=${data.startIndex}&&limit=${data.limit}&&order=${data.order}`,
        headers: {
            accept: "application/json",
            "Content-Type": "application/json",
            authorization: "Bearer " + (await cookies()).get("token")?.value,
        },
        validateStatus: () => true,
    };
    return await safeApiCall(config, data.csrf);
}
