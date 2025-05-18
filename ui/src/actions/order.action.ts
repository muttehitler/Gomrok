'use server'

import { validateCsrfTokenWithEx } from "@/lib/utils/csrf.helper"
import { ORDER_PATTERNS } from "@/patterns/order.pattern"
import axios from "axios"
import { cookies } from "next/headers"

export async function addOrder(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.post(process.env.API_ADDRESS + ORDER_PATTERNS.ADD, data, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}