'use client'

import { FC, ReactNode } from "react";
import './style.css'
import { useRouter } from "next/navigation";

type NavbarButtonProps = {
    href: string;
    text: string;
    children?: ReactNode;
};

export const NavbarButton: FC<NavbarButtonProps> = ({ children, href, text }: NavbarButtonProps) => {
    const router = useRouter();

    return (
        <a onClick={() => { router.push(href) }} href='#' data-tooltip-target="tooltip-profile" type="button" className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
            {children}
            <span className="sr-only">{text}</span>
        </a>
    )
}