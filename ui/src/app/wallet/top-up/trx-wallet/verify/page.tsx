'use client';

import { useTranslations } from 'next-intl';
import './style.css'
import { Page } from '@/components/Page';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { generateCsrfToken } from '@/lib/utils/csrf.helper';
import { useEffect, useState } from 'react';
import { getCookie } from '@/lib/utils/cookie.helper';
import { createInvoice, getInvoice } from '@/actions/payment.action';
import toast, { Toaster } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { themeParams, useSignal } from '@telegram-apps/sdk-react';
import { Clipboard } from '@/components/clipboard/clipboard';

const schema = z.object({
    hash: z.string(),
    csrf: z.string(),
});

export default function Verify() {
    const t = useTranslations('i18n');

    const [csrfToken, setCsrfToken] = useState(generateCsrfToken(getCookie('csrf') ?? ''))
    const [isReady, setReady] = useState(false)
    const [walletAddress, setWalletAddress] = useState('')

    const tp = useSignal(themeParams.state);

    const router = useRouter();

    const searchParams = useSearchParams()

    useEffect(() => {
        (async () => {
            const result = JSON.parse(await getInvoice({ id: searchParams.get('invoice'), csrf: csrfToken }))

            if (!result.success) {
                toast.error(t('get-unsuccessfully') + ": " + result.message.toString(), {
                    duration: 4000,
                    className: 'toast'
                })
                return
            }

            setWalletAddress(result.data.walletAddress)
            setReady(true)
        })()
    }, [])

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const verifyInvoiceHandler = async (data: any) => {
        
    }

    return (
        <Page back={true}>
            <Toaster position="top-right" reverseOrder={false} />
            <div className='container'>
                <h4>TRX Wallet Validate</h4>
                <br />
                {isReady ? (<div>
                    <form onSubmit={handleSubmit(verifyInvoiceHandler)}>
                        <QRCodeSVG value={walletAddress} size={256} className='container qr-code' bgColor={Object.entries(tp).filter(([title, value]) => title == 'bgColor')[0][1]} fgColor={Object.entries(tp).filter(([title, value]) => title == 'buttonTextColor')[0][1]} imageSettings={{ src: "https://cdn-icons-png.flaticon.com/512/12114/12114250.png", height: 64, width: 64, opacity: 1, excavate: true, }} />
                        <Clipboard text={walletAddress} title={t('wallet-address')} />
                        <br />
                        <label htmlFor="hash" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('hash-code')}</label>
                        <input {...register('hash')} name='hash' type="text" id="hash" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('hash-code')} required />
                        {errors.hash && <p style={{ color: 'red' }}>{errors.hash.message}</p>}
                        <br />
                        <input {...register('csrf')} name="csrf" type="hidden" value={csrfToken} />

                        <div className='flex'>
                            <button className='add-button ml-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full'>
                                {t('verify')}
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
