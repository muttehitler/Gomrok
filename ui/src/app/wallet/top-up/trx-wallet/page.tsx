'use client';

import { useTranslations } from 'next-intl';
import './style.css'
import { Page } from '@/components/Page';
import { useRouter } from 'next/navigation';

export default function TRXWallet() {
    const t = useTranslations('i18n');

    const router = useRouter();

    return (
        <Page back={true}>
            <div className='container'>
                <h4>TRX Wallet</h4>
                <br />
                <label htmlFor="amount" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('amount')}</label>
                <input name='amount' type="number" id="amount" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('amount')} required />
                <br />

                <div className='flex'>
                    <button className='add-button ml-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full'>
                        {t('top-up')}
                    </button>
                </div>
            </div>
        </Page>
    );
}
