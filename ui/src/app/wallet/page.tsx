'use client';

import { useTranslations } from 'next-intl';
import './style.css'
import { Page } from '@/components/Page';
import { BalanceDisplay } from '@/components/balance-display/balanceDisplay';
import { WalletLogs } from '@/components/wallet-logs/walletLogs';

export default function Home() {
  const t = useTranslations('i18n');

  return (
    <Page back={true}>
      <BalanceDisplay />
      <button className='add-deposit-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
        {t('add-deposit')}
      </button>
      <WalletLogs />
    </Page>
  );
}
