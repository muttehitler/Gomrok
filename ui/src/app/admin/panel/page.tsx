"use client";

import { useTranslations } from "next-intl";
import { Page } from "@/components/Page";
import { AddPanel } from "@/components/addPanel/addPanel";
import { PanelList } from "@/components/panelList/panelList";

export default function PanelPage() {
    const t = useTranslations("i18n");

    return (
        <Page back={true}>
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {t("panels")}
                    </h2>
                    <AddPanel />
                </div>
                <PanelList />
            </div>
        </Page>
    );
}
