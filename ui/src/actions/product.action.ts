'use server'

import { validateCsrfTokenWithEx } from "@/lib/utils/csrf.helper"
import { PRODUCT_PATTERNS } from "@/patterns/product.pattern"
import axios from "axios"
import { cookies } from "next/headers"

export async function addProduct(formData: any) {
    validateCsrfTokenWithEx(formData.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.post(process.env.API_ADDRESS + PRODUCT_PATTERNS.ADD, formData, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function getProductList(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.get(process.env.API_ADDRESS + PRODUCT_PATTERNS.GET_LIST +
        `?startIndex=${data.startIndex}&&limit=${data.limit}&&order=${data.order}`, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function deleteProduct(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.delete(process.env.API_ADDRESS + PRODUCT_PATTERNS.DELETE + data.id, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function updateProduct(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.put(process.env.API_ADDRESS + PRODUCT_PATTERNS.UPDATE + data.id, data, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function getProduct(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.get(process.env.API_ADDRESS + PRODUCT_PATTERNS.GET + data.id, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}