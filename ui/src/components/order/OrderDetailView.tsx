"use client";

import { useLocale, useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import { Copy, Earth, QrCode, Check, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import moment from "moment";
import "moment/locale/ru";
import "moment/locale/fa";
import jmoment from "moment-jalaali";
import { QRCodeSVG } from "qrcode.react";

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
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { RevokeSubscription } from "../revokeSubscription/revokeSubscription";
import { RenewOrder } from "../renewOrder/renewOrder";

// ... (Types and helper functions like formatBytes, StatusBadge, etc. can remain the same)
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
        return (
            <Badge className="bg-green-500 hover:bg-green-600">
                {t("online")}
            </Badge>
        );
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
                </div>
            </CardHeader>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-5 w-full" />
                <div className="flex justify-between">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
            </CardContent>
        </Card>
    </div>
);
const ProxyItem = ({ proxyUrl }: { proxyUrl: string }) => {
    const [hasCopied, setHasCopied] = useState(false);
    const name = decodeURIComponent(proxyUrl.split("#")[1] || "Proxy");

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setHasCopied(true);
        toast.success("Proxy copied!");
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <Card>
            <CardContent className="p-4 flex items-center justify-between">
                <p className="font-mono text-sm truncate">{name}</p>
                <div className="flex items-center gap-1">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <QrCode className="h-5 w-5" />
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="flex flex-col items-center justify-center p-8">
                            <DialogHeader>
                                <DialogTitle>{name}</DialogTitle>
                            </DialogHeader>
                            <QRCodeSVG value={proxyUrl} size={256} />
                        </DialogContent>
                    </Dialog>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleCopy(proxyUrl)}
                    >
                        {hasCopied ? (
                            <Check className="h-5 w-5 text-green-500" />
                        ) : (
                            <Copy className="h-5 w-5" />
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

// Main Component
type OrderDetailViewProps = {
    order: Order | null;
    panelUser: PanelUser | null;
};
export const OrderDetailView: FC<OrderDetailViewProps> = ({
    order,
    panelUser,
}) => {
    const t = useTranslations("i18n");
    const locale = useLocale();
    moment.locale(locale);
    if (locale == "fa")
        jmoment.loadPersian({
            dialect: "persian-modern",
            usePersianDigits: true,
        });

    const [isRevokeOpen, setIsRevokeOpen] = useState(false);
    const [isRenewOpen, setIsRenewOpen] = useState(false);
    const [subUrl, setSubUrl] = useState(panelUser?.subscriptionUrl || "");
    const [proxies, setProxies] = useState<string[]>([]);
    const [hasCopiedSubUrl, setHasCopiedSubUrl] = useState(false);

    useEffect(() => {
        if (!subUrl) return;
        const fetchProxies = async () => {
            try {
                const response = await fetch(subUrl);
                if (!response.ok)
                    throw new Error("Network response was not ok.");
                const decodedText = atob(await response.text());
                setProxies(
                    decodedText.split("\n").filter((p) => p.trim() !== "")
                );
            } catch (error) {
                console.error("Failed to fetch or decode proxies:", error);
                toast.error(t("failed-to-load-proxies"));
            }
        };
        fetchProxies();
    }, [subUrl, t]);

    if (!order || !panelUser) {
        return <p className="text-center">{t("order-not-found")}</p>;
    }

    const usedTraffic = panelUser.lifetimeUsedTraffic || 0;
    const dataLimit = panelUser.dataLimit || 1;
    const usagePercentage = Math.min((usedTraffic / dataLimit) * 100, 100);

    const handleCopySubscriptionUrl = () => {
        navigator.clipboard.writeText(subUrl);
        setHasCopiedSubUrl(true);
        toast.success("Subscription URL copied!");
        setTimeout(() => setHasCopiedSubUrl(false), 2000);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{panelUser.username}</CardTitle>
                        <StatusBadge panelUser={panelUser} />
                    </div>
                    <CardDescription className="pt-1">
                        <Badge
                            variant={
                                panelUser.isActive ? "default" : "destructive"
                            }
                        >
                            {panelUser.isActive ? t("active") : t("inactive")}
                        </Badge>
                    </CardDescription>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("data-usage")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <Progress value={usagePercentage} />
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
                <CardContent className="space-y-2 text-sm">
                    <p>
                        <strong>{t("time-left")}:</strong>{" "}
                        {panelUser.expireStrategy === "start_on_first_use" &&
                        !panelUser.expireDate
                            ? t("not-started-yet")
                            : moment(panelUser.expireDate).fromNow()}
                    </p>
                    <p>
                        <strong>{t("expires-in")}:</strong>{" "}
                        {panelUser.expireStrategy === "start_on_first_use" &&
                        !panelUser.expireDate
                            ? `${(panelUser.usageDuration || 0) / 86400} ${t(
                                  "days"
                              )}`
                            : locale == "fa"
                            ? jmoment(panelUser.expireDate).format(
                                  "dddd jD jMMMM jYYYY"
                              )
                            : moment(panelUser.expireDate).format(
                                  "dddd D MMMM YYYY"
                              )}
                    </p>
                </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => setIsRenewOpen(true)} className="flex-1">
                    <RefreshCw className="me-2 h-4 w-4" />
                    {t("renew-subscription")}
                </Button>
            </div>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="sub-link">
                    <AccordionTrigger>
                        {t("subscription-link")}
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-2">
                        <div className="flex items-center gap-2">
                            <Input value={subUrl} readOnly />
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleCopySubscriptionUrl}
                            >
                                {hasCopiedSubUrl ? (
                                    <Check className="h-4 w-4 text-green-500" />
                                ) : (
                                    <Copy className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="secondary" className="w-full">
                                    <QrCode className="me-2 h-4 w-4" />
                                    {t("show-qr-code")}
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="flex flex-col items-center justify-center p-8">
                                <QRCodeSVG value={subUrl} size={256} />
                            </DialogContent>
                        </Dialog>
                        <Button
                            onClick={() => setIsRevokeOpen(true)}
                            variant="destructive"
                            className="w-full"
                        >
                            {t("revoke-sub")}
                        </Button>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="proxies">
                    <AccordionTrigger>{t("proxies")}</AccordionTrigger>
                    <AccordionContent className="space-y-2 pt-2">
                        {proxies.length > 0 ? (
                            proxies.map((p) => (
                                <ProxyItem key={p} proxyUrl={p} />
                            ))
                        ) : (
                            <p className="text-sm text-center text-muted-foreground">
                                {t("no-proxies-found")}
                            </p>
                        )}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <RevokeSubscription
                id={order.id}
                name={order.name}
                open={isRevokeOpen}
                onOpenChange={setIsRevokeOpen}
                onSubscriptionRevoked={setSubUrl}
            />

            {/* FIX: Passing the correct props to RenewOrder component */}
            <RenewOrder
                id={order.id}
                product={order.product}
                visableState={[isRenewOpen, setIsRenewOpen]}
                subscriptionUrl={[subUrl, setSubUrl]}
            />
        </div>
    );
};
