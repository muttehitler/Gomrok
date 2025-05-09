'use client';

import { useTranslations } from 'next-intl';
import './style.css'
import { Page } from '@/components/Page';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { generateCsrfToken } from '@/lib/utils/csrf.helper';
import { useEffect, useState } from 'react';
import { getCookie } from '@/lib/utils/cookie.helper';
import { createInvoice } from '@/actions/payment.action';
import { TriangleAlert } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const schema = z.object({
    amount: z.string(),
    csrf: z.string(),
});

export default function TRXWallet() {
    const t = useTranslations('i18n');

    const [csrfToken, setCsrfToken] = useState(generateCsrfToken(getCookie('csrf') ?? ''))

    const router = useRouter();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const createInvoiceHandler = async (data: any) => {
        const result = JSON.parse(await createInvoice({ paymentMethod: 'trx-wallet', paymentOptions: data, csrf: data.csrf }))

        if (!result.success) {
            toast.error(t('create-unsuccessfully') + ": " + result.message.toString(), {
                duration: 4000,
                className: 'toast'
            })
            return
        }

        router.push('/wallet/top-up/trx-wallet/verify?invoice=' + result.data.id)
    }

    return (
        <Page back={true}>
            <Toaster position="top-right" reverseOrder={false} />
            <div className='container'>
                <h4>TRX Wallet</h4>
                <br />
                <form onSubmit={handleSubmit(createInvoiceHandler)}>
                    <h4><TriangleAlert />&ensp;Notes:</h4>
                    <p>"date alert"</p>
                    <p>"amount alert"</p>
                    <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('amount')}</label>
                    <input {...register('amount')} name='amount' type="number" id="amount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('amount')} required />
                    {errors.amount && <p style={{ color: 'red' }}>{errors.amount.message}</p>}
                    <br />
                    <input {...register('csrf')} name="csrf" type="hidden" value={csrfToken} />

                    <div className='flex'>
                        <button className='add-button ml-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full'>
                            {t('top-up')}
                        </button>
                    </div>
                </form>
            </div>
        </Page>
    );
}
