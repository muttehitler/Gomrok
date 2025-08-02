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

export async function getOrder(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.get(process.env.API_ADDRESS + ORDER_PATTERNS.GET + data.id, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function buyOrder(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.post(process.env.API_ADDRESS + ORDER_PATTERNS.BUY + data.id, {}, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function renewOrder(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.post(process.env.API_ADDRESS + ORDER_PATTERNS.RENEW + data.id, {
        product: data.product
    }, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function getOrderList(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.get(process.env.API_ADDRESS + ORDER_PATTERNS.GET_LIST +
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

export async function getMyOrders(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.get(process.env.API_ADDRESS + ORDER_PATTERNS.MY_ORDERS +
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

export async function getOrderWithPanelUser(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.get(process.env.API_ADDRESS + ORDER_PATTERNS.GET_WITH_PANEL_USER + data.id, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function getOrderWithPanelUserForAdmin(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.get(process.env.API_ADDRESS + ORDER_PATTERNS.GET_WITH_PANEL_USER_FOR_ADMIN + data.id, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function revokeSub(data: any) {
    console.log(data)
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.post(process.env.API_ADDRESS + ORDER_PATTERNS.REVOKE_SUB.replace('{id}', data.id), {}, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}