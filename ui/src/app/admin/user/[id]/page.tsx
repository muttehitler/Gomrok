'use client';

import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import './style.css'
import toast, { Toaster } from 'react-hot-toast';
import { use, useEffect, useState } from 'react';
import { generateCsrfToken } from '@/lib/utils/csrf.helper';
import { getOrderWithPanelUser } from '@/actions/order.action';
import { getCookieCSRF } from '@/actions/auth.action';
import { Copy, Earth, QrCode } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { themeParams, useSignal } from '@telegram-apps/sdk-react';
import moment from 'moment';
import jmoment from 'moment-jalaali'
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    ChartData
} from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { RevokeSubscription } from '@/components/revokeSubscription/revokeSubscription';
import { RenewOrder } from '@/components/renewOrder/renewOrder';
import { getUser } from '@/actions/user.action';

type Props = {
    params: Promise<{ id: string }>
}

type User = {
    id: string
    firstName: string
    lastName: string
    username: string
    chatId: number
    photoUrl: string
}


ChartJS.register(ArcElement, Tooltip, Legend)

export default function UserDetail({ params }: Props) {
    const t = useTranslations('i18n');

    moment.locale('tr')
    jmoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true })

    const { id } = use(params)

    const [user, setUser] = useState<User>()

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    useEffect(() => {
        (async () => {
            const result = JSON.parse(await getUser({ id: id, csrf: generateCsrfToken(await getCookieCSRF() ?? '') }))

            if (!result.success) {
                toast.error(t('get-unsuccessfully') + ": " + result.message.toString(), {
                    duration: 4000,
                    className: 'toast'
                })
                return
            }

            setUser(result.data)
        })()
    }, [])

    return (
        <Page back={true}>
            <Toaster position="top-right" reverseOrder={false} />

            {(user) ? (<div>
                <div className='profile-container'>
                    <div className='p-data'>
                        <img src={user.photoUrl}
                            alt="Profile Photo"
                            width={50}
                            className='p-img' />
                        <p className='name'>{user.firstName + ' ' + user.lastName}</p>
                        <div className='id-div'>
                            <p className='id'>{t('chat-id')}: {user.chatId} &ensp;</p><Copy size={15} onClick={() => { handleCopy(user.chatId.toString()!) }} />
                        </div>
                    </div>
                </div>
                <div className='container no-pad'>
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <tbody>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                        {t('username')}
                                    </th>
                                    <td className="px-6 py-4">
                                        <p className='id'>@{user.username} &ensp;</p><Copy size={15} onClick={() => { handleCopy(user.chatId.toString()!) }} />
                                    </td>
                                </tr>
                                <tr className="border-b border-gray-200 dark:border-gray-700">
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap bg-gray-50 dark:text-white dark:bg-gray-800">
                                        {t('id')}
                                    </th>
                                    <td className="px-6 py-4">
                                        <p className='id'>{user.id} &ensp;</p><Copy size={15} onClick={() => { handleCopy(user.chatId.toString()!) }} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>) :
                (<div role="status">
                    <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>)
            }
        </Page>
    )
}
