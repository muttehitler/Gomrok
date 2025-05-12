import { FC, useEffect, useState } from "react";
import './style.css'
import { useTranslations } from "next-intl";
import { Wallet } from "lucide-react";
import { getCookie } from "@/lib/utils/cookie.helper";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getUserBalance } from "@/actions/user.action";
import toast from "react-hot-toast";

export const BalanceDisplay: FC = () => {
    const t = useTranslations('i18n');

    const [userBalance, setUserBalance] = useState('_')

    useEffect(() => {
        (async () => {
            const result = JSON.parse(await getUserBalance({ csrf: generateCsrfToken(getCookie('csrf') ?? '') }))

            if (!result.success) {
                toast.error(t('get-balance-unsuccessfully') + ": " + result.message.toString(), {
                    duration: 4000,
                    className: 'toast'
                })
                return
            }

            setUserBalance(result.data)
        })()
    }, [])

    return (
        <div className='balance-div' >
            <p className='balance-amount flex' ><Wallet size={32} className="wallet-ico" />&ensp;{userBalance}&ensp;{t('toman')} </p>
        </div>
    )
}