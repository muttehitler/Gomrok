"use client";

import { useTranslations } from "next-intl";
import { Page } from "@/components/Page";
import { AdminLinkCard } from "@/components/admin/AdminLinkCard";
import {
    Users,
    Package,
    Server,
    ClipboardList,
    CreditCard, // آیکون جدید
} from "lucide-react";

export default function AdminDashboardPage() {
    const t = useTranslations("i18n");

    const adminLinks = [
        {
            href: "/admin/panel",
            icon: <Server className="h-8 w-8" />,
            title: t("manage-panels"),
            description: t("add-edit-view-server-panels"),
        },
        {
            href: "/admin/product",
            icon: <Package className="h-8 w-8" />,
            title: t("manage-products"),
            description: t("add-edit-view-subscription-plans"),
        },
        {
            href: "/admin/user",
            icon: <Users className="h-8 w-8" />,
            title: t("manage-users"),
            description: t("view-user-details-and-activities"),
        },
        {
            href: "/admin/order",
            icon: <ClipboardList className="h-8 w-8" />,
            title: t("manage-orders"),
            description: t("view-and-manage-all-user-orders"),
        },
        {
            href: "/admin/payment",
            icon: <CreditCard className="h-8 w-8" />,
            title: t("manage-payments"),
            description: t("view-all-user-transactions"),
        },
    ];

    return (
        <Page back={true}>
            <div className="container mx-auto p-4 md:p-6">
                <div className="flex flex-col space-y-6">
                    <header>
                        <h1 className="text-3xl font-bold tracking-tight">
                            {t("admin-dashboard")}
                        </h1>
                        <p className="text-muted-foreground">
                            {t("admin-dashboard-description")}
                        </p>
                    </header>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {adminLinks.map((link) => (
                            <AdminLinkCard {...link} key={link.href} />
                        ))}
                    </div>
                </div>
            </div>
        </Page>
    );
}
