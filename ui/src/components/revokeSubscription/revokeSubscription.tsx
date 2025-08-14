"use client";

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

import { revokeSub } from "@/actions/order.action";
import { getCookieCSRF } from "@/actions/auth.action";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";

type RevokeSubscriptionProps = {
    id: string;
    name: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubscriptionRevoked: (newUrl: string) => void;
};

export const RevokeSubscription: FC<RevokeSubscriptionProps> = ({
    id,
    name,
    open,
    onOpenChange,
    onSubscriptionRevoked,
}) => {
    const t = useTranslations("i18n");
    const [csrfToken, setCsrfToken] = useState("");
    const [confirmName, setConfirmName] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            const fetchCsrf = async () => {
                const token = await getCookieCSRF();
                setCsrfToken(generateCsrfToken(token ?? ""));
            };
            fetchCsrf();
        }
    }, [open]);

    const handleClose = () => {
        setConfirmName("");
        onOpenChange(false);
    };

    const revokeSubscriptionHandler = async () => {
        setIsSubmitting(true);
        try {
            const resultStr = await revokeSub({ id, csrf: csrfToken });
            const result = JSON.parse(resultStr);

            if (!result.success) {
                throw new Error(result.message);
            }

            onSubscriptionRevoked(result.data.subscriptionUrl);
            toast.success(t("revoked-successfully"));
            handleClose();
        } catch (error: any) {
            toast.error(`${t("revoke-unsuccessfully")}: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {t("revoke-sub")} &quot;{name}&quot;?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("are-sure-to-revoke-sub")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="py-2">
                    <Input
                        value={confirmName}
                        onChange={(e) => setConfirmName(e.target.value)}
                        placeholder={name}
                    />
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleClose}>
                        {t("no-cancel")}
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={revokeSubscriptionHandler}
                        disabled={confirmName !== name || isSubmitting}
                    >
                        {isSubmitting && (
                            <Loader2 className="me-2 h-4 w-4 animate-spin" />
                        )}
                        {t("yes-im-sure")}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};
