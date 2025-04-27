'use server'

import axios from "axios"

export async function testConnection(formData: any) {
    const response = await axios.post(process.env.API_ADDRESS + '/panel/test_connection', formData, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        }
    })
    return response.data
}

export async function addPanel(formData: any) {
    const response = await axios.post(process.env.API_ADDRESS + '/panel/add', formData, {
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        validateStatus: () => true
    })
    return JSON.stringify(response.data)
}
