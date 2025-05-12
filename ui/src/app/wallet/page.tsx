'use client';

import { useTranslations } from 'next-intl';
import './style.css'
import { Page } from '@/components/Page';
import { BalanceDisplay } from '@/components/balance-display/balanceDisplay';
import { WalletLogs } from '@/components/wallet-logs/walletLogs';
import NextLink from 'next/link'
import { Toaster } from 'react-hot-toast';

export default function Home() {
  const t = useTranslations('i18n');

  return (
    <Page back={true}>
      <Toaster position="top-right" reverseOrder={false} />
      <BalanceDisplay />
      <NextLink
        href={'/wallet/top-up'}
        className='add-deposit-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
        {t('top-up')}
      </NextLink>
      <WalletLogs />
    </Page>
  );
}
