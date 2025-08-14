"use client";

import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import { Copy, Earth, QrCode } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import jmoment from "moment-jalaali";
import { QRCodeSVG } from "qrcode.react";
import Link from "next/link";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { RevokeSubscription } from "../revokeSubscription/revokeSubscription";
// Note: You will need to refactor RevokeSubscription and RenewOrder components later
// import { RevokeSubscription } from '@/components/revokeSubscription/revokeSubscription';
// import { RenewOrder } from '@/components/renewOrder/renewOrder';

// Define the types based on your provided code
type Order = { id: string; name: string; product: string };
type PanelUser = {
    username: string;
    onlineAt?: string;
    isActive: boolean;
    dataLimit: number;
    lifetimeUsedTraffic: number;
    expireStrategy: string;
    expireDate?: string;
    usageDuration?: number;
    subscriptionUrl: string;
};

const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 GB";
    const gb = bytes / Math.pow(1024, 3);
    return `${gb.toFixed(2)} GB`;
};

const StatusBadge = ({ panelUser }: { panelUser: PanelUser }) => {
    const t = useTranslations("i18n");
    const isOnline =
        panelUser.onlineAt &&
        new Date().getTime() - new Date(panelUser.onlineAt + "Z").getTime() <
        60000;

    if (isOnline) {
        return <Badge className="bg-green-500">{t("online")}</Badge>;
    }
    if (panelUser.onlineAt) {
        return (
            <Badge variant="secondary">
                {moment(new Date(panelUser.onlineAt + "Z")).fromNow()}
            </Badge>
        );
    }
    return <Badge variant="outline">{t("not-connected-yet")}</Badge>;
};

export const OrderDetailSkeleton = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <Skeleton className="h-7 w-48" />
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full" />
                </div>
            </CardHeader>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-1/2" />
            </CardContent>
        </Card>
    </div>
);

type OrderDetailViewProps = {
    order: Order | null;
    panelUser: PanelUser | null;
};

export const OrderDetailView: FC<OrderDetailViewProps> = ({
    order,
    panelUser,
}) => {
    const t = useTranslations("i18n");
    jmoment.loadPersian({ dialect: "persian-modern", usePersianDigits: true });

    if (!order || !panelUser) {
        return <p className="text-center">{t("order-not-found")}</p>;
    }

    const usedTraffic = panelUser.lifetimeUsedTraffic || 0;
    const dataLimit = panelUser.dataLimit || 1; // Avoid division by zero
    const usagePercentage = Math.min((usedTraffic / dataLimit) * 100, 100);

    const [isRevokeSubVisable, setRevokeSubVisablity] = useState(false)
    const [proxies, setProxies] = useState<string[]>([])
    const [qrModal, setQRModal] = useState(false)
    const [qrUrl, setQRUrl] = useState('')
    const [qrName, setQRName] = useState('')
    const [subUrl, setSubUrl] = useState(panelUser.subscriptionUrl)

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied!");
    };

    useEffect(() => {
        (async () => {
            if (!subUrl)
                return

            const proxiesDecode = atob(await (await fetch(subUrl)).text()).split('\n')

            setProxies(proxiesDecode)
        })()
    }, [subUrl])

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{panelUser.username}</CardTitle>
                        <StatusBadge panelUser={panelUser} />
                    </div>
                    <div className="flex gap-2 pt-1">
                        <Badge
                            variant={
                                panelUser.isActive ? "default" : "destructive"
                            }
                        >
                            {panelUser.isActive ? t("active") : t("inactive")}
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("data-usage")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={usagePercentage} className="w-full" />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                        <span>{formatBytes(usedTraffic)}</span>
                        <span>{formatBytes(dataLimit)}</span>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("subscription-details")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2 text-sm">
                        <p>
                            {t("time-left")}:{" "}
                            {panelUser.expireStrategy === "start_on_first_use"
                                ? t("not-started-yet")
                                : moment(panelUser.expireDate).fromNow()}
                        </p>
                        <p>
                            {t("expires-in")}:{" "}
                            {panelUser.expireStrategy === "start_on_first_use"
                                ? `${(panelUser.usageDuration || 0) / 86400
                                } ${t("days")}`
                                : jmoment(panelUser.expireDate).format(
                                    "dddd jD jMMMM jYYYY"
                                )}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sub-link">
                    <AccordionTrigger>
                        {t("subscription-link")}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Input value={subUrl} readOnly />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    handleCopy(subUrl)
                                }
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="w-full">
                                    <QrCode />&ensp;{t("show-qr-code")}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="flex flex-col items-center justify-center p-8">
                                <QRCodeSVG
                                    value={subUrl}
                                    size={256}
                                />
                            </DialogContent>
                        </Dialog>

                        <Button onClick={() => setRevokeSubVisablity(true)} variant="destructive" className="w-full">
                            {t("revoke-sub")}
                        </Button>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="proxies">
                    <AccordionTrigger>
                        <Earth size={24} />{t('proxies')}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                        <div className="space-y-4">
                            {proxies && (
                                proxies.map(x => {
                                    const name = decodeURIComponent(x.split('#')[1])
                                    return (
                                        <Card key={name + Math.random()}>
                                            <CardContent className="p-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="grid gap-1">
                                                        <CardTitle className="text-base">name</CardTitle>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <Button asChild onClick={() => {
                                                            setQRUrl(x)
                                                            setQRName(name)
                                                            setQRModal(true)
                                                        }} variant="ghost" size="icon">
                                                            <QrCode className="h-5 w-5" />
                                                        </Button>
                                                        <Button asChild onClick={() => { handleCopy(x) }} variant="ghost" size="icon">
                                                            <Copy className="h-5 w-5" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )
                                })
                            )}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
            <RevokeSubscription
                id={order.id}
                name={order.name}
                visableState={[isRevokeSubVisable, setRevokeSubVisablity]}
                onOpenChange={() => { }}
                subscriptionUrl={[subUrl, setSubUrl]}
            />
        </div>
    );
};
