'use server'
import { USER_PATTERNS } from '@/patterns/user.pattern'
import axios from 'axios'
import { cookies } from 'next/headers'

export async function login(raw: string) {
    const response = await axios.post(process.env.API_ADDRESS + USER_PATTERNS.AUTH.LOGIN, {
        raw: raw,
        botId: process.env.BOT_ID
    })
    console.log(response.data)
    return response.data
}

export async function verify(raw: string) {
    const response = await axios.post(process.env.API_ADDRESS + USER_PATTERNS.AUTH.VERIFY, {
        raw: raw,
        botId: process.env.BOT_ID
    }, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return response.data
}

export async function getCookieCSRF() {
    return (await cookies()).get('csrf')?.value
}
