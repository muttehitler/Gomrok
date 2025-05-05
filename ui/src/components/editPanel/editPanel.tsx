'use client'

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useRef, useState } from "react";
import './style.css'
import { getPanel, testConnection, updatePanel } from "@/actions/panel.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";

type Panel = {
    id: string
    name: string
    type: string
    url: string
    username: string
    password: string
    weight: number
}

type EditPanelProp = {
    id: string,
    visableState: [boolean, Dispatch<SetStateAction<boolean>>]
}

export const EditPanel: FC<EditPanelProp> = ({ id, visableState }: EditPanelProp) => {
    const t = useTranslations('i18n');

    const formRef = useRef<HTMLFormElement>(null)

    const [testConnectionText, setTestConnectionText] = useState(t('test'))

    const [csrfToken, setCsrfToken] = useState('')
    const [panelName, setPanelName] = useState('')
    const [panelType, setPanelType] = useState('')
    const [panelUrl, setPanelUrl] = useState('')
    const [panelUsername, setPanelUsername] = useState('')
    const [panelPassword, setPanelPassword] = useState('')
    const [panelWeight, setPanelWeight] = useState(0)
    const [isReady, setReady] = useState(false)
    const [isVisable, setVisablity] = visableState

    useEffect(() => {
        (async () => {
            setCsrfToken(generateCsrfToken(getCookie('csrf') ?? ''))

            const panel: Panel = JSON.parse(await getPanel({ id: id, csrf: generateCsrfToken(getCookie('csrf') ?? '') }))

            setPanelName(panel.name)
            setPanelType(panel.type)
            setPanelUrl(panel.url)
            setPanelUsername(panel.username)
            setPanelPassword(panel.password)
            setPanelWeight(panel.weight)

            setReady(true)
        })()
    }, [])

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

        const formData = new FormData(e.currentTarget)

        formData.append('id', id)

        const dataAsJson = Object.fromEntries(formData.entries())

        const result = await updatePanel(dataAsJson)

        alert(result)
    }

    return (
        <div>
            {isReady && (
                <div className='container add-panel-container'>
                    <form ref={formRef} onSubmit={addPanelHandler}>
                        <div className='add-panel-field-div'>
                            <div className='panel-field'>
                                <label htmlFor="panel_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-name')}</label>
                                <input defaultValue={panelName} name='name' type="text" id="panel_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-name')} required />
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_types" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-type')}</label>
                                <select defaultValue={panelType} name='type' id="panel_types" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option>{t('choose-a-panel-type')}</option>
                                    <option value="marzneshin">{t('marzneshin')}</option>
                                </select>
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-url')}</label>
                                <input defaultValue={panelUrl} name="url" type="text" id="panel_url" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-url')} required />
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-username')}</label>
                                <input defaultValue={panelUsername} name="username" type="text" id="panel_username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-username')} required />
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-password')}</label>
                                <input defaultValue={panelPassword} name="password" type="password" id="panel_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-password')} required />
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-weight')}</label>
                                <input defaultValue={panelWeight} name="weight" type="number" id="panel_weight" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-weight')} required />
                            </div>
                            <input name="csrf" type="hidden" value={csrfToken} />
                        </div>
                        <div className='flex'>
                            <button onClick={() => { setVisablity(false) }} type="button" className='cancel-button bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full'>
                                {t('cancel')}
                            </button>
                            <button onClick={testConnectionHandler} type="button" className='add-button ml-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                                {testConnectionText}
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