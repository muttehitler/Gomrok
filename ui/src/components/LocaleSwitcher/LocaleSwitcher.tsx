"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { localesMap } from "@/core/i18n/config";
import { setLocale } from "@/core/i18n/locale";
import { Locale } from "@/core/i18n/types";
import { useLocale, useTranslations } from "next-intl";
import { FC } from "react";

export const LocaleSwitcher: FC = () => {
    const t = useTranslations("i18n");
    const locale = useLocale() as Locale;

    const onSelect = (value: string) => {
        const newLocale = value as Locale;
        setLocale(newLocale);
    };

    return (
        <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">{t("language")}</label>
            <Select value={locale} onValueChange={onSelect}>
                <SelectTrigger>
                    <SelectValue placeholder={t("select-language")} />
                </SelectTrigger>
                <SelectContent>
                    {localesMap.map((l) => (
                        <SelectItem key={l.key} value={l.key}>
                            {l.title}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
};
