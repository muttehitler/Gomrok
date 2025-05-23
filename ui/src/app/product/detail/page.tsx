'use client';

import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import './style.css'
import toast, { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { generateCsrfToken } from '@/lib/utils/csrf.helper';
import { getProduct } from '@/actions/product.action';
import { useSearchParams } from 'next/navigation';
import { getCookieCSRF } from '@/actions/auth.action';
import { BatteryCharging, Bird, Clock, Earth, SaudiRiyal, ShoppingBag, User, Users } from 'lucide-react';
import { getPanel } from '@/actions/panel.action';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { addOrder } from '@/actions/order.action';
import { useRouter } from 'next/navigation';

const schema = z.object({
    name: z.string(),
    product: z.string(),
    csrf: z.string()
})

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

export default function Detail() {
    const t = useTranslations('i18n');

    const [product, setProduct] = useState<Product>()
    const [panel, setPanel] = useState<Panel>()
    const [csrfToken, setCSRF] = useState('')
    const [isReady, setReady] = useState(false)
    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        (async () => {
            const csrf = generateCsrfToken((await getCookieCSRF())!)
            setCSRF(csrf)

            const result = JSON.parse(await getProduct({ id: searchParams.get('product'), csrf: csrf }))

            setProduct(result)

            const panelResult = JSON.parse(await getPanel({ id: result.panel, csrf: csrf }))

            setPanel(panelResult)
        })()
    }, [])

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const addOrderHandler = async (data: any) => {
        const result = JSON.parse(await addOrder(data))

        if (!result.success) {
            toast.error(t('add-unsuccessfully') + ": " + result.message.toString(), {
                duration: 4000,
                className: 'toast'
            })
            return
        }

        toast.success(t('added-successfully'), {
            duration: 2000,
            className: 'toast'
        })

        setTimeout(() => {
            router.push('/order/detail?order=' + result.data)
        }, 2000)
    }

    return (
        <Page back={true}>
            <Toaster position="top-right" reverseOrder={false} />
            <div className='container'>
                {(product && panel) ? (<div>
                    <div className='flex'><Earth size={32} />&ensp;<h4 className='name-header'>{panel.name}</h4></div>
                    <div className='flex'><ShoppingBag size={32} />&ensp;<h4 className='name-header'>{product.name}</h4></div>
                    <br />
                    {product.payAsYouGo ? (<div>
                        <span className="description flex"><Bird size={20} />&ensp;{t('free-triff')}</span>
                    </div>) : (<div>
                        <span className="description flex"><Clock size={20} />&ensp;{product.usageDuration} {t('days')}</span>
                        <span className="description flex"><BatteryCharging size={20} />&ensp;{product.dataLimit} {t('gb')}</span>
                        <span className="description flex">{product.userLimit == 1 ? <User size={20} /> : <Users size={20} />}&ensp;{product.dataLimit} {t('user')}</span>
                    </div>)}
                    <br />
                    <span className="description flex"><SaudiRiyal size={20} />&ensp;{product.price * 10}</span>
                    <br />
                    <form onSubmit={handleSubmit(addOrderHandler)}>
                        <div className='add-panel-field-div'>
                            <div className='panel-field'>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product-name')}</label>
                                <input {...register('name')} name='name' type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('product-name')} required />
                                {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
                            </div>
                            <input {...register('csrf')} name="csrf" type="hidden" value={csrfToken} />
                            <input {...register('product')} name="csrf" type="hidden" value={product.id} />
                        </div>
                        <br />
                        <div className='flex'>
                            <button className='add-button ml-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full'>
                                {t('order')}
                            </button>
                        </div>
                    </form>
                </div>) :
                    (<div role="status">
                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                        </svg>
                        <span className="sr-only">Loading...</span>
                    </div>)
                }
            </div>
        </Page>
    );
}
