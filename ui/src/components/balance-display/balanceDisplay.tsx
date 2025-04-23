import { FC } from "react";
import './style.css'
import { useTranslations } from "next-intl";

export const BalanceDisplay: FC = () => {
    const t = useTranslations('i18n');

    return (
        <div className='balance-div' >
            <p className='balance-amount' > 5&ensp;{t('toman')} </p>
        </div>
    )
}