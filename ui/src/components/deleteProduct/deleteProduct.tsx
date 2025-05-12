'use client'

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import './style.css'
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import { sprintf } from "sprintf-js";
import emitter from "@/lib/utils/eventEmitter";
import toast from "react-hot-toast";
import { deleteProduct } from "@/actions/product.action";

type DeleteProductProp = {
    id: string,
    visableState: [boolean, Dispatch<SetStateAction<boolean>>]
    name: string
}

export const DeleteProduct: FC<DeleteProductProp> = ({ id, visableState, name }: DeleteProductProp) => {
    const t = useTranslations('i18n');

    const [csrfToken, setCsrfToken] = useState('')
    const [isButtonVisable, setButtonVisablity] = useState(false)
    const [isVisable, setVisablity] = visableState

    useEffect(() => {
        (async () => {
            setCsrfToken(generateCsrfToken(getCookie('csrf') ?? ''))
        })()
    }, [])

    const deleteProductHandler = async () => {
        const dataAsJson = {
            id: id,
            csrf: csrfToken
        }

        const result = JSON.parse(await deleteProduct(dataAsJson))

        emitter.emit('listProducts')

        if (!result.success) {
            toast.error(t('delete-unsuccessfully') + ": " + result.message.toString(), {
                duration: 4000,
                className: 'toast'
            })
            return
        }

        toast.success(t('deleted-successfully'), {
            duration: 2000,
            className: 'toast'
        })

        setVisablity(false)
    }

    return (
        <div>
            <div id="popup-modal" tabIndex={-1} className={(isVisable ? '' : 'hidden') + " overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"}>
                <div className="relative p-4 w-full max-w-md max-h-full">
                    <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
                        <button onClick={() => { setVisablity(false) }} type="button" className="absolute top-3 end-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="popup-modal">
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                            <span className="sr-only">Close</span>
                        </button>
                        <div className="p-4 md:p-5 text-center">
                            <svg className="mx-auto mb-4 text-gray-400 w-12 h-12 dark:text-gray-200" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">{sprintf(t('if-you-are-sure-delete-product'), '"' + name + '"')}</h3>

                            <input onChange={(e) => { if (e.currentTarget.value == name) setButtonVisablity(true); else setButtonVisablity(false) }} type="text" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />

                            <br />

                            <button onClick={deleteProductHandler} data-modal-hide="popup-modal" type="button" className={(isButtonVisable ? "inline-flex" : "hidden") + " text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm items-center px-5 py-2.5 text-center"}>
                                {t('yes-im-sure')}
                            </button>
                            <button onClick={() => { setVisablity(false) }} data-modal-hide="popup-modal" type="button" className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">
                                {t('no-cancel')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}