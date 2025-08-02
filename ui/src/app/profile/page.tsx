'use client';

import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import './style.css'
import { Copy} from 'lucide-react';
import { initData, useSignal } from '@telegram-apps/sdk-react';

export default function OrderDetail() {
    const t = useTranslations('i18n');

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    const data = useSignal(initData.state)

    return (
        <Page back={true}>
            <div className='profile-container'>
                <div className='p-data'>
                    <img src={data?.user?.photoUrl}
                        alt="Profile Photo"
                        width={50}
                        className='p-img' />
                    <p className='name'>{data?.user?.firstName + ' ' + data?.user?.lastName}</p>
                    <div className='id-div'>
                        <p className='id'>{t('id')}: {data?.user?.id} &ensp;</p><Copy size={15} onClick={() => { handleCopy(data?.user?.id.toString()!) }} />
                    </div>
                </div>
            </div>
        </Page>
    )
}
