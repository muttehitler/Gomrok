"use client";

import { useTranslations } from "next-intl";
import { Page } from "@/components/Page";
import { LocationSelector } from "@/components/LocationSelector/LocationSelector";
import { Toaster } from "react-hot-toast";

export default function TestAccountPage() {
    const t = useTranslations("i18n");

    return (
        <Page back={true}>
            <Toaster position="top-center" reverseOrder={false} />
            <LocationSelector
                pageTitle={t("select-location-for-test-account")}
                routeUrlPattern={(panelId) =>
                    `/order/test_account?panel=${panelId}`
                }
            />
        </Page>
    );
}
