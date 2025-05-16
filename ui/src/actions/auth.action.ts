'use server'
import axios from 'axios'
import { cookies } from 'next/headers'

export async function login(raw: string) {
    const response = await axios.post(process.env.API_ADDRESS + '/auth/login', {
        raw: raw,
        botId: process.env.BOT_ID
    })
    console.log(response.data)
    return response.data
}

export async function getCookieCSRF() {
    return (await cookies()).get('csrf')?.value
}
