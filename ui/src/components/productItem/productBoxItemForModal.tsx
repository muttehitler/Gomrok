import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import './style.css'
import { useRouter } from "next/navigation";
import { BatteryCharging, Bird, Clock, SaudiRiyal, User, Users } from "lucide-react";

type Args = {
    product: Product
    selectedProductString: [string, Dispatch<SetStateAction<string>>]
}

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

export const ProductBoxItemForModal: FC<Args> = ({ product, selectedProductString }: Args) => {
    const t = useTranslations('i18n');

    const [selected, setSelected] = useState(false)
    const [selectedProduct, setSelectedProduct] = selectedProductString;
    const { id, name, usageDuration, dataLimit, userLimit, price, payAsYouGo, weight } = product;

    useEffect(() => {
        if (selected)
            setSelectedProduct(id)
    }, [selected])

    useEffect(() => {
        if (selectedProduct != id) {
            setSelected(false)
        }
    }, [selectedProduct])

    return (
        <div onClick={() => { setSelected(true); }} className={(selected ? 'border border-blue-500' : '') + ' yarim-section'}>
            <div>
                <div className='' key={id}>
                    <div>
                        <p>{name}</p>
                        <br />
                        {payAsYouGo ? (<div>
                            <span className="description flex"><Bird size={20} />&ensp;{t('free-triff')}</span>
                        </div>) : (<div>
                            <span className="description flex"><Clock size={20} />&ensp;{usageDuration / 60 / 60 / 24} {t('days')}</span>
                            <span className="description flex"><BatteryCharging size={20} />&ensp;{dataLimit / 1024 / 1024 / 1024} {t('gb')}</span>
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