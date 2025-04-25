'use client';

import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import './style.css'
import { useState } from 'react';
import { AddPanel } from '@/components/addPanel/addPanel';

export default function Panel() {
    const t = useTranslations('i18n');

    return (
        <Page back={true}>
            <AddPanel />
        </Page>
    );
}
