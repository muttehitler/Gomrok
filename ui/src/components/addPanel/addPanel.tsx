'use client'

import { useTranslations } from "next-intl";
import { FC, useEffect, useRef, useState } from "react";
import './style.css'
import { addPanel, testConnection } from "@/actions/panel.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";

export const AddPanel: FC = () => {
    const t = useTranslations('i18n');

    const formRef = useRef<HTMLFormElement>(null)
    const [testConnectionText, setTestConnectionText] = useState(t('test-panel-connection'))

    const [isAddPanelOpen, setIsAddPanelOpen] = useState(false);
    const [csrfToken, setCsrfToken] = useState('')

    useEffect(() => {
        (async () => {
            setCsrfToken(generateCsrfToken(getCookie('csrf') ?? ''))
        })()
    }, [])

    const openAddPanel = () => { setIsAddPanelOpen(true) }
    const closeAddPanel = () => { setIsAddPanelOpen(false) }

    const testConnectionHandler = async () => {
        if (!formRef.current) return

        const dataAsJson = Object.fromEntries(new FormData(formRef.current).entries())

        setTestConnectionText(t("testing"))

        const result = await testConnection(dataAsJson)

        if (result == 200) {
            setTestConnectionText(t("successed"))
            return;
        }

        setTestConnectionText(t("fail"))
    }

    const addPanelHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const result = await addPanel(new FormData(e.currentTarget))

        alert(result)
    }

    return (
        <div>
            <button onClick={openAddPanel} className='add-panel-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                {t('add-panel')}
            </button>
            {isAddPanelOpen && (
                <div className='container add-panel-container'>
                    <form ref={formRef} onSubmit={addPanelHandler}>
                        <div className='add-panel-field-div'>
                            <div className='panel-field'>
                                <label htmlFor="panel_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-name')}</label>
                                <input name='name' type="text" id="panel_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-name')} required />
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_types" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-type')}</label>
                                <select name='type' id="panel_types" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option>{t('choose-a-panel-type')}</option>
                                    <option value="marzneshin">{t('marzneshin')}</option>
                                </select>
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-url')}</label>
                                <input name="url" type="text" id="panel_url" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-url')} required />
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-username')}</label>
                                <input name="username" type="text" id="panel_username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-username')} required />
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-password')}</label>
                                <input name="password" type="password" id="panel_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-password')} required />
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-weight')}</label>
                                <input name="weight" type="number" id="panel_weight" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-weight')} required />
                            </div>
                            <input name="csrf" type="hidden" value={csrfToken} />
                        </div>
                        <div className='flex'>
                            <button onClick={closeAddPanel} className='cancel-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'>
                                {t('cancel')}
                            </button>
                            <button onClick={testConnectionHandler} type="button" className='add-button ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                                {testConnectionText}
                            </button>
                            <button className='add-button ml-auto bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full'>
                                {t('add')}
                            </button>
                        </div>
                    </form>
                </div>
            )}

        </div>
    )
}