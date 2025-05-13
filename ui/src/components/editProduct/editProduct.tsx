'use client'

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import './style.css'
import { getPanelList } from "@/actions/panel.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import emitter from "@/lib/utils/eventEmitter";
import { getProduct, updateProduct } from "@/actions/product.action";

type Panel = {
    id: string
    name: string
    type: string
    url: string
    weight: number
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

type EditProductProp = {
    id: string,
    visableState: [boolean, Dispatch<SetStateAction<boolean>>]
}

const schema = z.object({
    name: z.string(),
    panel: z.string(),
    payAsYouGo: z.boolean(),
    usageDuration: z.string(),
    dataLimit: z.string(),
    userLimit: z.string(),
    onHold: z.boolean(),
    price: z.string(),
    weight: z.string(),
    csrf: z.string(),
})

export const EditProduct: FC<EditProductProp> = ({ id, visableState }: EditProductProp) => {
    const t = useTranslations('i18n');

    const formRef = useRef<HTMLFormElement>(null)

    const [testConnectionText, setTestConnectionText] = useState(t('test'))

    const [panels, setPanels] = useState<Panel[]>([])
    const [csrfToken, setCsrfToken] = useState('')
    const [productName, setProductName] = useState('')
    const [productPanel, setProductPanel] = useState('')
    const [productPayAsYouGo, setProductPayAsYouGo] = useState(false)
    const [productUsageDuration, setProductUsageDuration] = useState(0)
    const [productDataLimit, setProductDataLimit] = useState(0)
    const [productUserLimit, setProductUserLimit] = useState(0)
    const [productOnHold, setProductOnHold] = useState(false)
    const [productPrice, setProductPrice] = useState(0)
    const [productWeight, setProductWeight] = useState(0)
    const [productCode, setProductCode] = useState('')

    const [isReady, setReady] = useState(false)
    const [isVisable, setVisablity] = visableState

    useEffect(() => {
        (async () => {
            setCsrfToken(generateCsrfToken(getCookie('csrf') ?? ''))

            setPanels([])

            const result = JSON.parse(await getPanelList({ csrf: generateCsrfToken(getCookie('csrf')!), startIndex: 0, limit: 100, order: -1 }))

            if (!result.success) {
                toast.error(t('list-unsuccessfully') + ": " + result.message.toString(), {
                    duration: 4000,
                    className: 'toast'
                })
                return
            }

            setPanels(result.data.items)

            const product: Product = JSON.parse(await getProduct({ id: id, csrf: generateCsrfToken(getCookie('csrf') ?? '') }))

            setProductName(product.name)
            setProductPanel(product.panel)
            setProductPayAsYouGo(product.payAsYouGo)
            setProductUsageDuration(product.usageDuration)
            setProductDataLimit(product.dataLimit)
            setProductUserLimit(product.userLimit)
            setProductOnHold(product.onHold)
            setProductPrice(product.price)
            setProductWeight(product.weight)
            setProductCode(product.code)

            setReady(true)
        })()
    }, [])


    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const updateProductHandler = async (data: any) => {
        console.log(data)

        data.id = id

        const result = JSON.parse(await updateProduct(data))

        if (!result.success) {
            toast.error(t('update-unsuccessfully') + ": " + result.message.toString(), {
                duration: 4000,
                className: 'toast'
            })
            return
        }

        toast.success(t('updated-successfully'), {
            duration: 2000,
            className: 'toast'
        })

        setVisablity(false)

        emitter.emit('listProducts')
    }

    return (
        <div>
            {isReady && (
                <div className='container add-product-container'>
                    <form ref={formRef} onSubmit={handleSubmit(updateProductHandler)}>
                        <div className='add-product-field-div'>
                            <div className='product-field'>
                                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product-name')}</label>
                                <input defaultValue={productName} {...register('name')} name='name' type="text" id="name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('product-name')} required />
                                {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
                            </div>
                            <div className='product-field'>
                                <label htmlFor="panels" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-type')}</label>
                                <select defaultValue={productPanel} {...register('panel')} name='panel' id="panels" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option>{t('choose-a-panel-type')}</option>
                                    {panels.length > 0 ? panels.sort((a, b) => a.weight - b.weight).map(x =>
                                        (<option key={x.id} value={x.id}>{x.name}</option>)
                                    ) :
                                        (<option>Loading...</option>)
                                    }
                                </select>
                                {errors.panel && <p style={{ color: 'red' }}>{errors.panel.message}</p>}
                            </div>
                            <div className='product-field flex'>
                                <div className="check-box flex items-center ps-4 border border-gray-200 rounded-sm dark:border-gray-700">
                                    <input defaultChecked={productPayAsYouGo} {...register('payAsYouGo')} id="pay-as-you-go" type="checkbox" name="payAsYouGo" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="pay-as-you-go" className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{t('pay-as-you-go')}</label>
                                </div>
                                {errors.payAsYouGo && <p style={{ color: 'red' }}>{errors.payAsYouGo.message}</p>}
                            </div>
                            <div className='product-field'>
                                <label htmlFor="usage-duration" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product-usage-duration')}</label>
                                <input defaultValue={productUsageDuration} {...register('usageDuration')} name="usageDuration" type="number" id="usage-duration" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('product-usage-duration')} required />
                                {errors.usageDuration && <p style={{ color: 'red' }}>{errors.usageDuration.message}</p>}
                            </div>
                            <div className='product-field'>
                                <label htmlFor="data-limit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product-data-limit')}</label>
                                <input defaultValue={productDataLimit} {...register('dataLimit')} name="dataLimit" type="number" id="data-limit" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('product-data-limit')} required />
                                {errors.dataLimit && <p style={{ color: 'red' }}>{errors.dataLimit.message}</p>}
                            </div>
                            <div className='product-field'>
                                <label htmlFor="user-limit" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product-user-limit')}</label>
                                <input defaultValue={productUserLimit} {...register('userLimit')} name="userLimit" type="number" id="user-limit" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('product-user-limit')} required />
                                {errors.userLimit && <p style={{ color: 'red' }}>{errors.userLimit.message}</p>}
                            </div>
                            <div className='product-field flex'>
                                <div className="check-box flex items-center ps-4 border border-gray-200 rounded-sm dark:border-gray-700">
                                    <input defaultChecked={productOnHold} {...register('onHold')} id="on-hold" type="checkbox" name="onHold" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                    <label htmlFor="on-hold" className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">{t('on-hold')}</label>
                                </div>
                                {errors.onHold && <p style={{ color: 'red' }}>{errors.onHold.message}</p>}
                            </div>
                            <div className='product-field'>
                                <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product-price')}</label>
                                <input defaultValue={productPrice} {...register('price')} name="price" type="number" id="price" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('product-price')} required />
                                {errors.price && <p style={{ color: 'red' }}>{errors.price.message}</p>}
                            </div>
                            <div className='product-field'>
                                <label htmlFor="weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product-weight')}</label>
                                <input defaultValue={productWeight} {...register('weight')} name="weight" type="number" id="weight" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('product-weight')} required />
                                {errors.weight && <p style={{ color: 'red' }}>{errors.weight.message}</p>}
                            </div>
                            <div className='product-field'>
                                <label htmlFor="code" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('product-code')}</label>
                                <input disabled value={productCode} type="text" id="code" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                            </div>
                            <input {...register('csrf')} name="csrf" type="hidden" value={csrfToken} />
                        </div>
                        <div className='flex'>
                            <button onClick={() => { setVisablity(false) }} type="button" className='cancel-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'>
                                {t('cancel')}
                            </button>
                            <button className='add-button ml-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full'>
                                {t('update')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    )
}