"use client";

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { deleteProduct } from "@/actions/product.action";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import { sprintf } from "sprintf-js";
import emitter from "@/lib/utils/eventEmitter";
import toast from "react-hot-toast";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type DeleteProductProp = {
    id: string;
    open: boolean;
    onOpenChange: Dispatch<SetStateAction<boolean>>;
    name: string;
};

export const DeleteProduct: FC<DeleteProductProp> = ({
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

    const deleteProductHandler = async () => {
        const dataAsJson = { id, csrf: csrfToken };
        const result = JSON.parse(await deleteProduct(dataAsJson));

        if (!result.success) {
            toast.error(`${t("delete-unsuccessfully")}: ${result.message}`);
            return;
        }

        toast.success(t("deleted-successfully"));
        emitter.emit("listProducts");
        onOpenChange(false);
        setConfirmName("");
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t("delete")} &quot;{name}&quot;?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {sprintf(
                            t("if-you-are-sure-delete-product"),
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
                        onClick={deleteProductHandler}
                        disabled={confirmName !== name}
                    >
                        {t("yes-im-sure")}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
