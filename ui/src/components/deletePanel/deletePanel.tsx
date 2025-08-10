"use client";

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { deletePanel } from "@/actions/panel.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import { sprintf } from "sprintf-js";
import emitter from "@/lib/utils/eventEmitter";
import toast from "react-hot-toast";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type DeletePanelProp = {
    id: string;
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    name: string;
};

export const DeletePanel: FC<DeletePanelProp> = ({
    id,
    open,
    onOpenChange,
    name,
}) => {
    const t = useTranslations("i18n");

    const [csrfToken, setCsrfToken] = useState("");
    const [confirmName, setConfirmName] = useState("");

    useEffect(() => {
        setCsrfToken(generateCsrfToken(getCookie("csrf") ?? ""));
    }, []);

    const deletePanelHandler = async () => {
        const dataAsJson = {
            id: id,
            csrf: csrfToken,
        };

        const result = JSON.parse(await deletePanel(dataAsJson));

        if (!result.success) {
            toast.error(
                t("delete-unsuccessfully") + ": " + result.message.toString()
            );
            return;
        }

        toast.success(t("deleted-successfully"));
        emitter.emit("listPanels");
        onOpenChange(false);
        setConfirmName("");
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t("delete")} "{name}"?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {sprintf(
                            t("if-you-are-sure-delete-panel"),
                            `"${name}"`
                        )}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    value={confirmName}
                    onChange={(e) => setConfirmName(e.target.value)}
                    placeholder={name}
                    className="mt-2"
                />
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmName("")}>
                        {t("no-cancel")}
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={deletePanelHandler}
                        disabled={confirmName !== name}
                    >
                        {t("yes-im-sure")}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
