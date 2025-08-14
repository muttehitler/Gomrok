"use client";

import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import toast from "react-hot-toast";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ClipboardProps = {
    text: string;
    title: string;
};

export const Clipboard: FC<ClipboardProps> = ({ text, title }) => {
    const t = useTranslations("i18n");
    const [hasCopied, setHasCopied] = useState(false);

    const onCopy = () => {
        navigator.clipboard.writeText(text);
        setHasCopied(true);
        toast.success(t("copied-to-clipboard"));
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className="space-y-2">
            <Label htmlFor="clipboard-input">{title}</Label>
            <div className="flex items-center space-x-2">
                <Input id="clipboard-input" value={text} readOnly />
                <Button type="button" size="icon" onClick={onCopy}>
                    {hasCopied ? (
                        <Check className="h-4 w-4" />
                    ) : (
                        <Copy className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
};
