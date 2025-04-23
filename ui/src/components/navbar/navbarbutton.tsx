import { FC, ReactNode } from "react";
import './style.css'

type NavbarButtonProps = {
    href: string;
    text: string;
    children?: ReactNode;
};

export const NavbarButton: FC<NavbarButtonProps> = ({ children, href, text }: NavbarButtonProps) => {
    return (
        <a href={href} data-tooltip-target="tooltip-profile" type="button" className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 dark:hover:bg-gray-800 group">
            {children}
            <span className="sr-only">{text}</span>
        </a>
    )
}