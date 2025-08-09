import { useTranslations } from "next-intl";
import { FC } from "react";
import './style.css'
import { useRouter } from "next/navigation";

type Order = {
    id: string
    name: string
    product: string
    payed: boolean
    price: number
    finalPrice: number
    orderDetailUrl?: string
}

export const OrderItem: FC<Order> = ({ id, name, product, payed, price, finalPrice, orderDetailUrl }: Order) => {
    const t = useTranslations('i18n');

    const router = useRouter();

    return (
        <div className='section'>
            <div>
                <div className='flex' key={id}>
                    <div>
                        <p>{name}</p>
                    </div>
                    <button onClick={() => { router.push(orderDetailUrl ?? ('/order/' + id)) }} className='detail-button ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                        {t('details')}
                    </button>
                    <br />
                </div>
            </div>
        </div>
    )
}