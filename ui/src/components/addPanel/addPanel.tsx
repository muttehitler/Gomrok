'use client'

import { useTranslations } from "next-intl";
import { FC, useEffect, useRef, useState } from "react";
import './style.css'
import { addPanel, testConnection } from "@/actions/panel.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import toast from "react-hot-toast";
import emitter from "@/lib/utils/eventEmitter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Weight } from "lucide-react";

const schema = z.object({
    name: z.string(),
    type: z.string(),
    url: z.string().url(),
    username: z.string(),
    password: z.string(),
    weight: z.string(),
    csrf: z.string(),
});

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

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema),
    });

    const addPanelHandler = async (data: any) => {
        const result = JSON.parse(await addPanel(data))

        if (!result.success) {
            toast.error(t('add-unsuccessfully') + ": " + result.message.toString(), {
                duration: 4000,
                className: 'toast'
            })
            return
        }

        emitter.emit('listPanels')

        toast.success(t('added-successfully'), {
            duration: 2000,
            className: 'toast'
        })

        setIsAddPanelOpen(false)
    }

    return (
        <div>
            <button onClick={openAddPanel} className='add-panel-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
                {t('add-panel')}
            </button>
            {isAddPanelOpen && (
                <div className='container add-panel-container'>
                    <form ref={formRef} onSubmit={handleSubmit(addPanelHandler)}>
                        <div className='add-panel-field-div'>
                            <div className='panel-field'>
                                <label htmlFor="panel_name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-name')}</label>
                                <input {...register('name')} name='name' type="text" id="panel_name" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-name')} required />
                                {errors.name && <p style={{ color: 'red' }}>{errors.name.message}</p>}
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_types" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-type')}</label>
                                <select {...register('type')} name='type' id="panel_types" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                    <option>{t('choose-a-panel-type')}</option>
                                    <option value="marzneshin">{t('marzneshin')}</option>
                                </select>
                                {errors.type && <p style={{ color: 'red' }}>{errors.type.message}</p>}
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_url" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-url')}</label>
                                <input {...register('url')} name="url" type="text" id="panel_url" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-url')} required />
                                {errors.url && <p style={{ color: 'red' }}>{errors.url.message}</p>}
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-username')}</label>
                                <input {...register('username')} name="username" type="text" id="panel_username" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-username')} required />
                                {errors.username && <p style={{ color: 'red' }}>{errors.username.message}</p>}
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-password')}</label>
                                <input {...register('password')} name="password" type="password" id="panel_password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-password')} required />
                                {errors.password && <p style={{ color: 'red' }}>{errors.password.message}</p>}
                            </div>
                            <div className='panel-field'>
                                <label htmlFor="panel_weight" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('panel-weight')}</label>
                                <input {...register('weight')} name="weight" type="number" id="panel_weight" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder={t('panel-weight')} required />
                                {errors.weight && <p style={{ color: 'red' }}>{errors.weight.message}</p>}
                            </div>
                            <input {...register('csrf')} name="csrf" type="hidden" value={csrfToken} />
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