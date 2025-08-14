'use client';

import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import './style.css'
import toast, { Toaster } from 'react-hot-toast';
import { use, useEffect, useState } from 'react';
import { generateCsrfToken } from '@/lib/utils/csrf.helper';
import { getCookie } from '@/lib/utils/cookie.helper';
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

type Props = {
    params: Promise<{ id: string }>
}

type Order = {
    id: string
    name: string
    payed: boolean
    product: string
    price: number
    finalPrice: number
}

type PanelUser = {
    id: string
    username: string
    expireStrategy: string
    expireDate?: string
    usageDuration?: number
    activationDeadline: string
    key: string
    dataLimit: number
    dataLimitResetStrategy: string
    note: string
    subUpdatedAt: string
    subLastUserAgent: string
    onlineAt: string
    activated: boolean
    isActive: boolean
    expired: boolean
    dataLimitReached: boolean
    enabled: boolean
    usedTraffic: number
    lifetimeUsedTraffic: number
    subRevokedAt: string
    createdAt: string
    serviceIds: number[]
    subscriptionUrl: string
    ownerUsername: string
    trafficResetAt: string
}

ChartJS.register(ArcElement, Tooltip, Legend)

export default function OrderDetail({ params }: Props) {
    const t = useTranslations('i18n');

    moment.locale('tr')
    jmoment.loadPersian({ dialect: 'persian-modern', usePersianDigits: true })

    const { id } = use(params)

    const [order, setOrder] = useState<Order>()
    const [panelUser, setPanelUser] = useState<PanelUser>()
    const [proxies, setProxies] = useState<string[]>([])
    const [accor, setAccor] = useState(false)
    const [subAccor, setSubAccor] = useState(false)
    const [qrModal, setQRModal] = useState(false)
    const [qrUrl, setQRUrl] = useState('')
    const [qrName, setQRName] = useState('')
    const [isRevokeSubVisable, setRevokeSubVisablity] = useState(false)
    const [subUrl, setSubUrl] = useState('')
    const [pieData, setPieData] = useState<ChartData<"doughnut", number[], unknown>>({
        labels: [t('loading')],
        datasets: [
            {
                label: 'حجم',
                data: [50],
                backgroundColor: ['#ef4444', '#3b82f6'],
                borderWidth: 1,
            },
        ]
    })
    const [pieOptions, setPieOptions] = useState({})
    const [isRenewOrderVisable, setRenewOrderVisablity] = useState(false)

    const tp = useSignal(themeParams.state);

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    useEffect(() => {
        (async () => {
            const result = JSON.parse(await getOrderWithPanelUser({ id: id, csrf: generateCsrfToken(await getCookieCSRF() ?? '') }))

            if (!result.success) {
                toast.error(t('list-unsuccessfully') + ": " + result.message.toString(), {
                    duration: 4000,
                    className: 'toast'
                })
                return
            }

            setOrder(result.data.order)
            setPanelUser(result.data.panelUser)

            setSubUrl(result.data.panelUser.subscriptionUrl)

            setPieData({
                labels: [t('used'), t('remaining')],
                datasets: [
                    {
                        data: [(result.data.panelUser.lifetimeUsedTraffic / 1024 / 1024 / 1024.0), ((result.data.panelUser.dataLimit - result.data.panelUser.lifetimeUsedTraffic) / 1024 / 1024 / 1024.0)],
                        backgroundColor: ['#ef4444', '#3b82f6'],
                        borderWidth: 1,
                    },
                ]
            })
            setPieOptions({
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom' as const,
                    },
                }
            })
        })()
    }, [])

    useEffect(() => {
        (async () => {
            if (!panelUser?.subscriptionUrl)
                return

            panelUser.subscriptionUrl = subUrl

            const proxiesDecode = atob(await (await fetch(panelUser?.subscriptionUrl)).text()).split('\n')

            setProxies(proxiesDecode)
        })()
    }, [panelUser, subUrl])

    return (
        <Page back={true}>
            <Toaster position="top-right" reverseOrder={false} />
            {(order && panelUser) ? (<div>
                <div className='container'>
                    <div className='flex'>
                        <h4 className='username'>{panelUser?.username}</h4>&ensp;
                        {
                            (panelUser?.onlineAt == null ? (<span className="online-bg bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">{t('not-connected-yet')}</span>) : (new Date().getTime() - new Date(panelUser?.onlineAt + 'Z').getTime()) < 60000 ?
                                (<span className="online-bg bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Online</span>)
                                :
                                (<span>{panelUser?.onlineAt && moment(new Date(panelUser?.onlineAt + 'Z').toString()).fromNow()}</span>))
                        }
                    </div>
                    <div>
                        {
                            panelUser?.isActive ?
                                (<span className="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-blue-900 dark:text-blue-300">{t('active')}</span>)
                                :
                                (<span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-sm dark:bg-red-900 dark:text-red-300">{t('inactive')}</span>)
                        }
                    </div>
                </div>

                <div className='container'>
                    <Doughnut data={pieData} options={pieOptions} />
                </div>

                <div className='container'>
                    <div>
                        {t('time-left')}: {panelUser?.expireStrategy == "start_on_first_use" ? t('not-started-yet') : moment(panelUser?.expireDate).fromNow()}
                    </div>
                    <div>
                        {t('expires-in')}: {panelUser?.expireStrategy == "start_on_first_use" ? ((panelUser?.usageDuration ?? 0) / 60 / 60 / 24) + (t('days')) : jmoment(panelUser?.expireDate).format('dddd jD jMMMM jYYYY | hh:mm')}
                    </div>
                </div>
                <div className='container'>

                    <div id="accordion-flush" data-accordion="collapse" data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white" data-inactive-classes="text-gray-500 dark:text-gray-400">
                        <h2 id="accordion-flush-heading-1">
                            <button onClick={() => { setSubAccor(!subAccor) }} type="button" className="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3" data-accordion-target="#accordion-flush-body-1" aria-expanded="true" aria-controls="accordion-flush-body-1">
                                <span className="flex items-center">
                                    <Earth size={24} />&ensp;
                                    {t('subscription-link')}
                                </span>
                                <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                                </svg>
                            </button>
                        </h2>
                        <div id="accordion-flush-body-1" className={subAccor ? '' : 'hidden'} aria-labelledby="accordion-flush-heading-1">
                            <div className="proxy-field py-5 border-b border-gray-200 dark:border-gray-700">
                                <div>
                                    <QRCodeSVG value={subUrl ?? ''} size={256} className='qr-code' bgColor={Object.entries(tp).filter(([title, value]) => title == 'bgColor')[0][1]} fgColor={Object.entries(tp).filter(([title, value]) => title == 'buttonTextColor')[0][1]} /*imageSettings={{ src: "https://cdn-icons-png.flaticon.com/512/12114/12114250.png", height: 64, width: 64, opacity: 1, excavate: true, }}*/ />
                                    <br />
                                    <label htmlFor="subscription-url-textarea" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('subscription-link')}</label>
                                    <textarea readOnly value={subUrl} id="subscription-url-textarea" className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Write your thoughts here..." />
                                    <button onClick={() => { handleCopy(subUrl ?? '') }} type="button" className='subscription-url-copy bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                                        {t('copy-link')}
                                    </button>
                                    <br />
                                    <br />
                                    <button onClick={() => { setRevokeSubVisablity(true) }} type="button" className='subscription-url-copy bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'>
                                        {t('revoke-sub')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="accordion-flush" data-accordion="collapse" data-active-classes="bg-white dark:bg-gray-900 text-gray-900 dark:text-white" data-inactive-classes="text-gray-500 dark:text-gray-400">
                        <h2 id="accordion-flush-heading-1">
                            <button onClick={() => { setAccor(!accor) }} type="button" className="flex items-center justify-between w-full py-5 font-medium rtl:text-right text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400 gap-3" data-accordion-target="#accordion-flush-body-1" aria-expanded="true" aria-controls="accordion-flush-body-1">
                                <span className="flex items-center">
                                    <Earth size={24} />&ensp;
                                    {t('proxies')}
                                </span>
                                <svg data-accordion-icon className="w-3 h-3 rotate-180 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5 5 1 1 5" />
                                </svg>
                            </button>
                        </h2>
                        <div id="accordion-flush-body-1" className={accor ? '' : 'hidden'} aria-labelledby="accordion-flush-heading-1">
                            {proxies && (
                                proxies.map(x => {
                                    const name = decodeURIComponent(x.split('#')[1])
                                    return (
                                        <div className="proxy-field py-5 border-b border-gray-200 dark:border-gray-700" key={name + Math.random()}>
                                            <div className='flex'>
                                                <p>{name}</p>
                                                <div className='ml-auto flex'>
                                                    <button onClick={() => {
                                                        setQRUrl(x)
                                                        setQRName(name)
                                                        setQRModal(true)
                                                    }} className='text-white font-bold py-2 px-2 rounded-full'>
                                                        <QrCode size={24} />
                                                    </button>
                                                    <button onClick={() => { handleCopy(x) }} className='text-white font-bold py-2 px-2 rounded-full'>
                                                        <Copy size={24} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                        </div>
                    </div>

                    <div id="static-modal" data-modal-backdrop="static" tabIndex={-1} aria-hidden="true" className={(qrModal ? '' : 'hidden ') + "overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"}>
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {qrName}
                                    </h3>
                                    <button onClick={() => { setQRModal(false) }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="static-modal">
                                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                        </svg>
                                        <span className="sr-only">Close modal</span>
                                    </button>
                                </div>
                                <div className="p-4 md:p-5 space-y-4">
                                    <QRCodeSVG value={qrUrl} size={256} className='qr-code' bgColor={Object.entries(tp).filter(([title, value]) => title == 'bgColor')[0][1]} fgColor={Object.entries(tp).filter(([title, value]) => title == 'buttonTextColor')[0][1]} /*imageSettings={{ src: "https://cdn-icons-png.flaticon.com/512/12114/12114250.png", height: 64, width: 64, opacity: 1, excavate: true, }}*/ />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <RevokeSubscription id={id} visableState={[isRevokeSubVisable, setRevokeSubVisablity]} subscriptionUrl={[subUrl, setSubUrl]} key={order.name} /> */}
                </div>
                <div className='container'>
                    <button onClick={() => { setRenewOrderVisablity(true) }} type="button" className='renew bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                        {t('renew-order')}
                    </button>
                    <RenewOrder id={id} product={order.product} visableState={[isRenewOrderVisable, setRenewOrderVisablity]} subscriptionUrl={[subUrl, setSubUrl]} key={order.name} />
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
