'use client';

import { useTranslations } from 'next-intl';
import './style.css'
import { Page } from '@/components/Page';
import { useRouter } from 'next/navigation';

export default function TopUp() {
    const t = useTranslations('i18n');

    const router = useRouter();

    return (
        <Page back={true}>
            <div className='container'>
                <h4>{t('select-top-up-method')}:</h4>
                <br />
                <div className='section'>
                    <a href='#' onClick={() => { router.push('/wallet/top-up/trx-wallet') }}>{t('trx-wallet')}</a>
                </div>
            </div>
        </Page>
    );
}
