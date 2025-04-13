'use client'

import { login } from "@/actions/auth.action"
import { init } from "@/core/init"
import { getCookie, setCookie } from "@/lib/utils/cookie.helper"
import { initData, useSignal } from "@telegram-apps/sdk-react"
import { useEffect } from "react"

export default function CheckAuth() {
    let token = getCookie('token')
    
    if (!token) {
        const raw = useSignal(initData.raw)

        useEffect(() => {
            (async () => {
                const data = await login(raw ?? '')

                setCookie('token', data.token, new Date(data.expiration).getDate())
            })()
        }, []);
    }

    return (<div></div>)
}