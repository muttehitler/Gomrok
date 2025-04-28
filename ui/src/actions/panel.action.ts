'use server'

import { validateCsrfToken, validateCsrfTokenWithEx } from "@/lib/utils/csrf.helper"
import { PANEL_PATTERNS } from "@/patterns/panel.pattern"
import axios from "axios"
import { cookies } from "next/headers"

export async function testConnection(formData: any) {
    console.log(validateCsrfTokenWithEx(formData.csrf, (await cookies()).get('csrf')?.value ?? ''))
    const response = await axios.post(process.env.API_ADDRESS + PANEL_PATTERNS.TEST_CONNECTION, formData, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    return response.data
}

export async function addPanel(formData: any) {
    console.log(validateCsrfTokenWithEx(formData.csrf, (await cookies()).get('csrf')?.value ?? ''))
    const response = await axios.post(process.env.API_ADDRESS + PANEL_PATTERNS.ADD, formData, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function getPanelList(data: any) {
    // console.log(validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? ''))
    const response = await axios.get(process.env.API_ADDRESS + PANEL_PATTERNS.GET_LIST, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}
