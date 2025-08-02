import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import './style.css'
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { Pencil, Trash2 } from "lucide-react";
import { getCookie } from "@/lib/utils/cookie.helper";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getPanel } from "@/actions/panel.action";
import { DeleteProduct } from "../deleteProduct/deleteProduct";
import { EditProduct } from "../editProduct/editProduct";
import { useRouter } from "next/navigation";

type Product = {
    id: string
    name: string
    product: string
    payed: boolean
    price: number
    finalPrice: number
    orderDetailUrl?: string
}

export const OrderItem: FC<Product> = ({ id, name, product, payed, price, finalPrice, orderDetailUrl }: Product) => {
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