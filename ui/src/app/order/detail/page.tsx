'use client';

import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import './style.css'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { generateCsrfToken } from '@/lib/utils/csrf.helper';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCookieCSRF } from '@/actions/auth.action';
import { buyOrder, getOrder } from '@/actions/order.action';
import { getProduct } from '@/actions/product.action';
import { getPanel } from '@/actions/panel.action';
import { BatteryCharging, Bird, Clock, Earth, SaudiRiyal, ShoppingBag, User, Users } from 'lucide-react';

type Order = {
    id: string
    name: string
    product: string
    price: number
    finalPrice: number
    payed: boolean
}

type Product = {
    id: string
    name: string
    panel: string
    payAsYouGo: boolean
    usageDuration: number
    dataLimit: number
    userLimit: number
    onHold: boolean
    price: number
    weight: number
    code: string
}

type Panel = {
    id: string
    name: string
    type: string
    url: string
    weight: number
}

export default function Product() {
    const t = useTranslations('i18n');

    const searchParams = useSearchParams()
    const router = useRouter()
    const [order, setOrder] = useState<Order>()
    const [product, setProduct] = useState<Product>()
    const [panel, setPanel] = useState<Panel>()
    const [csrf, setCSRF] = useState('')

    useEffect(() => {
        (async () => {
            const csrfToken = generateCsrfToken((await getCookieCSRF())!)

            setCSRF(csrfToken)

            const result = JSON.parse(await getOrder({ id: searchParams.get('order'), csrf: csrfToken }))

            if (!result.success) {
                toast.error(t('get-unsuccessfully') + ": " + result.message.toString(), {
                    duration: 4000,
                    className: 'toast'
                })
                return
            }

            if (result.data.payed)
                router.push('/order/' + result.data.id)

            const data = result.data

            const product = JSON.parse(await getProduct({ id: data.product, csrf: csrfToken }))

            const panel = JSON.parse(await getPanel({ id: product.panel, csrf: csrfToken }))

            setOrder(data)
            setProduct(product)
            setPanel(panel)
        })()
    }, [])

    const buy = async () => {
        const result = JSON.parse(await buyOrder({ id: searchParams.get('order'), csrf: csrf }))

        if (!result.success) {
            toast.error(t('purchase-unsuccessfully') + ": " + result.message.toString(), {
                duration: 4000,
                className: 'toast'
            })
            return
        }

        toast.success(t('purchased-successfully'), {
            duration: 2000,
            className: 'toast'
        })

        setTimeout(() => {
            router.push('/order/' + searchParams.get('order'))
        }, 2000)
    }

    return (
        <Page back={true}>
            <Toaster position="top-right" reverseOrder={false} />
            {(order && product && panel) && (
                <div className='container'>
                    <div className='flex'><Earth size={32} />&ensp;<h4 className='name-header'>{panel.name}</h4></div>
                    <div className='flex'><ShoppingBag size={32} />&ensp;<h4 className='name-header'>{product.name}</h4></div>
                    {product.payAsYouGo ? (<div>
                        <span className="description flex"><Bird size={20} />&ensp;{t('free-triff')}</span>
                    </div>) : (<div>
                        <span className="description flex"><Clock size={20} />&ensp;{product.usageDuration / 60 / 60 / 24} {t('days')}</span>
                        <span className="description flex"><BatteryCharging size={20} />&ensp;{product.dataLimit / 1024 / 1024 / 1024} {t('gb')}</span>
                        <span className="description flex">{product.userLimit == 1 ? <User size={20} /> : <Users size={20} />}&ensp;{product.dataLimit} {t('user')}</span>
                    </div>)}
                    <br />
                    <br />
                    <span className="description flex"><SaudiRiyal size={20} />&ensp;{order.price == order.finalPrice ?
                        order.price * 10
                        : <div><i>{order.price * 10}</i>{order.finalPrice * 10}</div>}</span>
                    <div className='flex'>
                        <button onClick={buy} className='add-button ml-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full'>
                            {t('buy')}
                        </button>
                    </div>
                </div>
            )}
        </Page>
    );
}
