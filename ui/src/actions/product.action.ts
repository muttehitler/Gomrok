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