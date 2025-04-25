import { FC } from "react";
import './style.css'
import { useTranslations } from "next-intl";

interface WalletLogProp {
    type: string
    amount: number
}

export const WalletLog: FC<WalletLogProp> = ({ type, amount }: WalletLogProp) => {
    const t = useTranslations('i18n');

    return (
        <div className='wallet-log-cart'>
            <h4 className={type}>{amount} {t('toman')} {t(type)}</h4>
        </div>
    )
}