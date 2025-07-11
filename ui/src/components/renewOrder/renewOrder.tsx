'use client'

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import './style.css'
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import toast from "react-hot-toast";
import { getCookieCSRF } from "@/actions/auth.action";
import { getProduct, getProductsByPanel } from "@/actions/product.action";
import { ProductBoxItemForModal } from "../productItem/productBoxItemForModal";
import { RefreshCw } from "lucide-react";
import { renewOrder } from "@/actions/order.action";

type RenewOrder = {
    id: string,
    product: string,
    visableState: [boolean, Dispatch<SetStateAction<boolean>>]
    subscriptionUrl: [string, Dispatch<SetStateAction<string>>]
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

export const RenewOrder: FC<RenewOrder> = ({ id, product, visableState, subscriptionUrl }: RenewOrder) => {
    const t = useTranslations('i18n');

    const [products, setProducts] = useState<Product[]>([])
    const [selectedProduct, setSelectedProduct] = useState<string>('')

    const [csrfToken, setCsrfToken] = useState('')
    const [isVisable, setVisablity] = visableState

    useEffect(() => {
        (async () => {
            setProducts([])

            const csrf=generateCsrfToken((await getCookieCSRF())!)
            setCsrfToken(csrf);

            const thisOrderProduc = JSON.parse(await getProduct({ id: product, csrf: csrf }))

            const result = JSON.parse(await getProductsByPanel({ id: thisOrderProduc.panel, csrf: generateCsrfToken((await getCookieCSRF())!), startIndex: 0, limit: 1000, order: -1 }))

            if (!result.success) {
                toast.error(t('list-unsuccessfully') + ": " + result.message.toString(), {
                    duration: 4000,
                    className: 'toast'
                })
                return
            }

            setProducts(result.data.items)
        })()
    }, [])

    const renewOrderHandler = async () => {
        const dataAsJson = {
            id: id,
            csrf: csrfToken,
            product: selectedProduct
        }
        
        const result = JSON.parse(await renewOrder(dataAsJson))
        
        if (!result.success) {
            toast.error(t('renew-unsuccessfully') + ": " + result.message.toString(), {
                duration: 4000,
                className: 'toast'
            })
            return
        }

        toast.success(t('renewed-successfully'), {
            duration: 2000,
            className: 'toast'
        })

        setVisablity(false)
    }

    return (
        <div className="">
            <div id="popup-modal" tabIndex={-1} className={'modal ' + (isVisable ? '' : 'hidden') + " overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"}>
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                        <button onClick={() => { setVisablity(false) }} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <RefreshCw className='mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200' />
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{t('witch-plan-you-want-to-renew')}</h3>
                            <br />
                            <div className='container grid grid-cols-1 gap-4'>
                                {products.length > 0 ? products.sort((a, b) => a.weight - b.weight).map(x =>
                                    (<ProductBoxItemForModal product={x} selectedProductString={[selectedProduct, setSelectedProduct]} key={x.name} />)
                                ) :
                                    (<div role="status">
                                        <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg>
                                        <span className="sr-only">Loading...</span>
                                    </div>)
                                }
                            </div>
                            <br />
                            {selectedProduct != '' && (
                                <button onClick={renewOrderHandler} type="button" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                                    {t('renew')}
                                </button>)
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
