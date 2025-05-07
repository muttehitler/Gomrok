'use server'

import { validateCsrfToken, validateCsrfTokenWithEx } from "@/lib/utils/csrf.helper"
import { PANEL_PATTERNS } from "@/patterns/panel.pattern"
import axios from "axios"
import { cookies } from "next/headers"

export async function testConnection(formData: any) {
    validateCsrfTokenWithEx(formData.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.post(process.env.API_ADDRESS + PANEL_PATTERNS.TEST_CONNECTION, formData, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        }
    })
    return response.data
}

export async function addPanel(formData: any) {
    validateCsrfTokenWithEx(formData.csrf, (await cookies()).get('csrf')?.value ?? '')
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
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
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

export async function getPanel(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.get(process.env.API_ADDRESS + PANEL_PATTERNS.GET + data.id, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function updatePanel(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.put(process.env.API_ADDRESS + PANEL_PATTERNS.UPDATE + data.id, data, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}

export async function deletePanel(data: any) {
    validateCsrfTokenWithEx(data.csrf, (await cookies()).get('csrf')?.value ?? '')
    const response = await axios.delete(process.env.API_ADDRESS + PANEL_PATTERNS.DELETE + data.id, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + (await cookies()).get('token')?.value
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}
