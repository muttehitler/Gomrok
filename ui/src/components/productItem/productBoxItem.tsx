import { useTranslations } from "next-intl";
import { FC } from "react";
import './style.css'
import { useRouter } from "next/navigation";
import { BatteryCharging, Bird, Clock, SaudiRiyal, User, Users } from "lucide-react";

type Product = {
    id: string
    name: string
    panel: string
    payAsYouGo: boolean
    usageDuration: number
    dataLimit: number
    userLimit: number
    onHold: boolean
    price: number
    weight: number
    code: string
}

export const ProductBoxItem: FC<Product> = ({ id, name, usageDuration, dataLimit, userLimit, price, payAsYouGo, weight }: Product) => {
    const t = useTranslations('i18n');

    const router = useRouter();

    return (
        <div onClick={() => { router.push('/product/detail?product=' + id) }} className='yarim-section'>
            <div>
                <div className='' key={id}>
                    <div>
                        <p>{name}</p>
                        <br />
                        {payAsYouGo ? (<div>
                            <span className="description flex"><Bird size={20} />&ensp;{t('free-triff')}</span>
                        </div>) : (<div>
                            <span className="description flex"><Clock size={20} />&ensp;{usageDuration} {t('days')}</span>
                            <span className="description flex"><BatteryCharging size={20} />&ensp;{dataLimit} {t('gb')}</span>
                            <span className="description flex">{userLimit == 1 ? <User size={20} /> : <Users size={20} />}&ensp;{dataLimit} {t('user')}</span>
                        </div>)}
                        <br />
                        <span className="description flex justify-end"><SaudiRiyal size={20} />&ensp;{price * 10}</span>
                    </div>
                    <br />
                </div>
            </div>
        </div>
    )
}