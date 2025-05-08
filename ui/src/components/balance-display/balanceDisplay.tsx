import { FC } from "react";
import './style.css'
import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";

export const BalanceDisplay: FC = () => {
    const t = useTranslations('i18n');

    return (
        <div className='balance-div' >
            <p className='balance-amount flex' ><Wallet size={32} className="wallet-ico" />&ensp;5&ensp;{t('toman')} </p>
        </div>
    )
}