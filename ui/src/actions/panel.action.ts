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