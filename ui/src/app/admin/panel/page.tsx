'use client';

import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import './style.css'
import { AddPanel } from '@/components/addPanel/addPanel';
import { PanelList } from '@/components/panelList/panelList';
import { Toaster } from 'react-hot-toast';

export default function Panel() {
    const t = useTranslations('i18n');

    return (
        <Page back={true}>
            <Toaster position="top-right" reverseOrder={false} />
            <AddPanel />
            <PanelList />
        </Page>
    );
}
