"use client";

import { useTranslations } from "next-intl";
import { FC } from "react";
import { Copy } from "lucide-react";
import toast from "react-hot-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

type User = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    chatId: number;
    photoUrl: string;
};

const InfoRow = ({
    label,
    value,
}: {
    label: string;
    value: string | number;
}) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(String(value));
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="flex items-center justify-between py-3">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{value}</p>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={handleCopy}
                >
                    <Copy className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export const UserDetailSkeleton = () => (
    <div className="space-y-6">
        <Card>
            <CardContent className="flex flex-col items-center p-6 space-y-2">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-7 w-40 mt-4" />
                <Skeleton className="h-5 w-32" />
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </CardContent>
        </Card>
    </div>
);

type UserDetailViewProps = {
    user: User | null;
};

export const UserDetailView: FC<UserDetailViewProps> = ({ user }) => {
    const t = useTranslations("i18n");

    if (!user) {
        return (
            <div className="text-center">
                <p>{t("user-not-found")}</p>
            </div>
        );
    }

    const getInitials = (firstName: string, lastName: string) => {
        const f = firstName?.[0] || "";
        const l = lastName?.[0] || "";
        return `${f}${l}`.toUpperCase() || "U";
    };

    const fullName = `${user.firstName} ${user.lastName || ""}`.trim();

    return (
        <div className="space-y-6">
            <Card>
                <CardContent className="flex flex-col items-center p-6 space-y-2">
                    <Avatar className="h-24 w-24 text-3xl">
                        <AvatarImage src={user.photoUrl} alt={fullName} />
                        <AvatarFallback>
                            {getInitials(user.firstName, user.lastName)}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className="text-2xl font-bold pt-2">{fullName}</h2>
                    {user.username && (
                        <p className="text-muted-foreground">
                            @{user.username}
                        </p>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>{t("user-details")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <InfoRow label={t("chat-id")} value={user.chatId} />
                    <Separator />
                    <InfoRow label={t("id")} value={user.id} />
                </CardContent>
            </Card>
        </div>
    );
};
