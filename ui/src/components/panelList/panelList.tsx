import { useTranslations } from "next-intl";
import { FC } from "react";
import './style.css'
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

export const PanelList: FC = () => {
    const t = useTranslations('i18n');

    return (
        <div className='container'>
            <h4>{t('panels')}:</h4>
            <br />
            <div className='section'>
                <div className='flex'>
                    <div>
                        <p>Panel Name</p>
                        <span>https://address.com</span>
                    </div>
                    <Menu as="div" className="relative ml-auto inline-block text-left">
                        <div>
                            <MenuButton className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-900 bg-white rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none dark:text-white focus:ring-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 4 15">
                                    <path d="M3.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 6.041a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm0 5.959a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z" />
                                </svg>
                            </MenuButton>
                        </div>

                        <MenuItems
                            transition
                            className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                        >
                            <div className="py-1">
                                <MenuItem>
                                    <a
                                        href="#"
                                        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
                                    >
                                        Account settings
                                    </a>
                                </MenuItem>
                            </div>
                        </MenuItems>
                    </Menu>
                </div>
            </div>
        </div>
    )
}