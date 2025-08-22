"use client";

import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { setLocale } from "@/core/i18n/locale";
import { Card, CardContent } from "../ui/card";

type SelectLanguageDialogProp = {
};

export const SelectLanguageDialog: FC<SelectLanguageDialogProp> = ({ }) => {
    const t = useTranslations("i18n");
    const [open, setOpen] = useState(true)
    const onOpenChange = () => { setLocale('en'); setOpen(false) }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg w-[90%] rounded-lg">
                <DialogHeader>
                    <DialogTitle>
                        {t("select-language")}
                    </DialogTitle>
                </DialogHeader>


                <div className="space-y-4">
                    <Card onClick={() => { setLocale('en'); setOpen(false) }}>
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-5xl">🇺🇸</p>
                                    </div>
                                    <div className="grid gap-0.5">
                                        <p className="font-semibold">English</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card onClick={() => { setLocale('fa'); setOpen(false) }}>
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-5xl">🇮🇷</p>
                                    </div>
                                    <div className="grid gap-0.5">
                                        <p className="font-semibold">فارسی</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card onClick={() => { setLocale('ru'); setOpen(false) }}>
                        <CardContent className="p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div>
                                        <p className="text-5xl">🇷🇺</p>
                                    </div>
                                    <div className="grid gap-0.5">
                                        <p className="font-semibold">русский</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DialogContent>
        </Dialog>
    );
};
