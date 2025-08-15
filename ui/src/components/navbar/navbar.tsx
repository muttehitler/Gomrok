"use client";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Home, Package, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, ReactNode } from "react";

interface NavItemProps {
    href: string;
    label: string;
    icon: ReactNode;
    isCenter?: boolean;
}

const NavItem: FC<NavItemProps> = ({ href, label, icon, isCenter }) => {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <TooltipProvider delayDuration={100}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link
                        href={href}
                        className={cn(
                            "group relative flex h-14 w-14 flex-col items-center justify-center transition-all duration-200 ease-in-out",
                            isCenter
                                ? "rounded-full bg-primary text-primary-foreground shadow-lg -translate-y-4"
                                : "text-muted-foreground",
                            isActive && !isCenter && "text-primary"
                        )}
                    >
                        {icon}
                        <span className="sr-only">{label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export const Navbar: FC = () => {
    const navItems = [
        { href: "/", label: "Home", icon: <Home size={24} /> },
        { href: "/order", label: "My Orders", icon: <Package size={24} /> },
        {
            href: "/panel",
            label: "Shop",
            icon: <ShoppingBag size={28} />,
            isCenter: true,
        },
        { href: "/profile", label: "Profile", icon: <User size={24} /> },
    ];

    const orderedNavItems = [
        navItems[0],
        navItems[1],
        navItems[2],
        navItems[3],
    ];

    return (
        <div className="fixed bottom-4 inset-x-0 mx-auto w-full max-w-sm h-16">
            <div className="relative flex items-center justify-around rounded-full border bg-background/80 shadow-md backdrop-blur-sm">
                {orderedNavItems.map((item) => (
                    <NavItem key={item.href} {...item} />
                ))}
            </div>
        </div>
    );
};
