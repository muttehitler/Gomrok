'use client'

import { login } from "@/actions/auth.action"
import { init } from "@/core/init"
import { getCookie, setCookie } from "@/lib/utils/cookie.helper"
import { generateCsrfToken } from "@/lib/utils/csrf.helper"
import { initData, useSignal } from "@telegram-apps/sdk-react"
import { useEffect, useState } from "react"
import crypto from 'crypto'

export default function CheckAuth() {
    let token = getCookie('token')

    if (!token) {
        const raw = useSignal(initData.raw)

        useEffect(() => {
            (async () => {
                const data = await login(raw ?? '')

                setCookie('token', data.token, new Date(data.expiration).getDate(), { path: '/', httpOnly: false })

                const csrfSecret = crypto.randomBytes(64).toString('hex')

                setCookie('csrf', csrfSecret ?? 'sdkf', new Date(data.expiration).getDate(), { path: '/', httpOnly: false })
            })()
        }, []);
    }

    return (<div></div>)
}