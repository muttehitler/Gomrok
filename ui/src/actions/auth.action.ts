'use server'
import { initData, useSignal } from '@telegram-apps/sdk-react';
import axios from 'axios'

export async function login(raw: string) {
    const response = await axios.post(process.env.API_ADDRESS + '/auth/login', {
        raw: raw,
        botId: process.env.BOT_ID
    })
    console.log(response.data)
    return response.data
}
