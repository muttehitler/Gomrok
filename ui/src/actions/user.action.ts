'use server'
import { validateCsrfTokenWithEx } from '@/lib/utils/csrf.helper'
import { USER_PATTERNS } from '@/patterns/user.pattern'
import axios from 'axios'
import { cookies } from 'next/headers'

export async function getUserBalance(formData: any) {
    validateCsrfTokenWithEx(formData.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.get(process.env.API_ADDRESS + USER_PATTERNS.GET_USER_BALANCE, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function getUserList(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.get(process.env.API_ADDRESS + USER_PATTERNS.GET_LIST +
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

export async function getUser(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.get(process.env.API_ADDRESS + USER_PATTERNS.GET + data.id, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function me(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.get(process.env.API_ADDRESS + USER_PATTERNS.ME, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}