'use client';

import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import './style.css'
import { useState } from 'react';

export default function Panel() {
    const t = useTranslations('i18n');

    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);

    return (
        <Page back={true}>
            <div>
                <button onClick={() => { setIsAddPanelOpen(true) }} className='add-panel-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                    {t('add-panel')}
                </button>
                {isAddPanelOpen && (
                    <div className='container add-panel-container flex'>
                        <button onClick={() => { setIsAddPanelOpen(false) }} className='cancel-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'>
                            {t('cancel')}
                        </button>
                        <button className='add-button ml-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full'>
                            {t('add')}
                        </button>
                    </div>
                )}

            </div>
        </Page>
    );
}
