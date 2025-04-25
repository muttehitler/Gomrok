'use client';

import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';

export default function Admin() {
    const t = useTranslations('i18n');

    return (
        <Page back={true}>
        </Page>
    );
}
