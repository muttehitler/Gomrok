'use client'

import { useTranslations } from "next-intl";
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import './style.css'
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import toast from "react-hot-toast";
import { revokeSub } from "@/actions/order.action";
import { getCookieCSRF } from "@/actions/auth.action";
import { Button } from "../ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Input } from "../ui/input";

type RevokeSubscriptionProp = {
    id: string,
    visableState: [boolean, Dispatch<SetStateAction<boolean>>]
    subscriptionUrl: [string, Dispatch<SetStateAction<string>>]
    onOpenChange: Dispatch<SetStateAction<boolean>>
    name: string
}

export const RevokeSubscription: FC<RevokeSubscriptionProp> = ({ id, visableState, subscriptionUrl, onOpenChange, name }: RevokeSubscriptionProp) => {
    const t = useTranslations('i18n');

    const [csrfToken, setCsrfToken] = useState('')
    const [confirmName, setConfirmName] = useState("");

    const [isVisable, setVisablity] = visableState
    const [_, setUrl] = subscriptionUrl

    useEffect(() => {
        (async () => {
            setCsrfToken(generateCsrfToken(await getCookieCSRF() ?? ''))
        })()
    }, [])

    const revokeSubscriptionHandler = async () => {
        const dataAsJson = {
            id: id,
            csrf: csrfToken
        }

        const result = JSON.parse(await revokeSub(dataAsJson))

        if (!result.success) {
            toast.error(t('delete-unsuccessfully') + ": " + result.message.toString(), {
                duration: 4000,
                className: 'toast'
            })
            return
        }

        setUrl(result.data.subscriptionUrl)

        toast.success(t('deleted-successfully'), {
            duration: 2000,
            className: 'toast'
        })

        setVisablity(false)
    }

    return (
        <AlertDialog open={isVisable} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    {/* FIX: Replaced " with &quot; to fix ESLint error */}
                    <AlertDialogTitle>
                        {t('revoke-sub')} &quot;{name}&quot;?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {t("are-sure-to-revoke-sub")}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <Input
                    value={confirmName}
                    onChange={(e) => setConfirmName(e.target.value)}
                    placeholder={name}
                    className="mt-2"
                />
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => { setConfirmName(""); setVisablity(false) }}>
                        {t("no-cancel")}
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        onClick={revokeSubscriptionHandler}
                        disabled={confirmName !== name}
                    >
                        {t("yes-im-sure")}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}