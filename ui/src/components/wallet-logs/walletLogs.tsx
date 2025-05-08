import { FC } from "react";
import './style.css'
import { useTranslations } from "next-intl";
import { WalletLog } from "./walletLog";

export const WalletLogs: FC = () => {
    const t = useTranslations('i18n');

    return (
        <div className='wallet-logs-div'>
            <h4>{t('wallet-logs-header')}:</h4>
            <br />
            <WalletLog type="top-up" amount={5} />
            <WalletLog type="buy" amount={4} />
        </div>
    )
}