import { useTranslations } from "next-intl";
import { FC, useEffect, useRef, useState } from "react";
import './style.css'
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { getPanelList } from "@/actions/panel.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";

type Panel = {
    name: string
    type: string
    url: string
    weight: number
}

export const PanelList: FC = () => {
    const t = useTranslations('i18n');

    const [panels, setPanels] = useState<Panel[]>([])

    useEffect(() => {
        (async () => {
            const panels = await getPanelList(generateCsrfToken(getCookie('csrf') ?? ''))

            setPanels(JSON.parse(panels))
        })()
    })

    return (
        <div className='container'>
            <h4>{t('panels')}:</h4>
            <br />
            <div className='section'>
                {panels.length > 0 ? panels.map(x =>
                (<div className='flex' key={x.name}>
                    <div>
                        <p>{x.name}</p>
                        <span>{x.url}</span>
                    </div>
                    <Menu as="div" className="relative ml-auto inline-block text-left">
                        <div>
                            <MenuButton className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                </svg>
                            </MenuButton>
                        </div>

                        <MenuItems transition className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44 dark:bg-gray-700 dark:divide-gray-600">
                            <div className="py-1">
                                <MenuItem>
                                    <a href="#" className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                        Account settings
                                    </a>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </Menu>
                </div>)
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
        </div>
    )
}