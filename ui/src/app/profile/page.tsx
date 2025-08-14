"use client";

import { useTranslations } from "next-intl";
import { initData, useSignal } from "@telegram-apps/sdk-react";
import { Copy, Check, LogOut, User as UserIcon } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { useState } from "react";

import { Page } from "@/components/Page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Main Profile Page Component
export default function ProfilePage() {
    const t = useTranslations("i18n");
    const data = useSignal(initData.state);
    const [hasCopied, setHasCopied] = useState(false);

    const user = data?.user;
    const userInitials =
        (user?.firstName?.[0] || "") + (user?.lastName?.[0] || "");

    const handleCopy = async (text: string) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setHasCopied(true);
            toast.success(t("user-id-copied"));
            setTimeout(() => setHasCopied(false), 2000); // Reset icon after 2 seconds
        } catch (err) {
            toast.error(t("failed-to-copy"));
            console.error("Failed to copy: ", err);
        }
    };

    const handleLogout = () => {
        // Implement your logout logic here
        // For example: clearing cookies, calling a logout action, etc.
        toast.success("Logged out successfully!"); // Placeholder
    };

    return (
        <Page back={true}>
            <Toaster position="top-center" reverseOrder={false} />
            <div className="container mx-auto p-4 md:p-6 max-w-lg">
                <div className="flex flex-col space-y-6">
                    {/* User Information Card */}
                    <Card>
                        <CardHeader className="items-center text-center">
                            <Avatar className="h-24 w-24 mb-4">
                                <AvatarImage
                                    src={user?.photoUrl}
                                    alt={user?.username || "User profile photo"}
                                />
                                <AvatarFallback className="text-3xl">
                                    {userInitials}
                                </AvatarFallback>
                            </Avatar>
                            <CardTitle className="text-2xl">
                                {user?.firstName} {user?.lastName}
                            </CardTitle>
                            {user?.username && (
                                <CardDescription>
                                    @{user.username}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <Separator />
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-muted-foreground">
                                    <p>{t("telegram-user-id")}</p>
                                    <p className="font-mono">{user?.id}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleCopy(String(user?.id))}
                                    aria-label={t("copy-user-id")}
                                >
                                    {hasCopied ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-destructive">
                                {t("danger-zone")}
                            </CardTitle>
                            <CardDescription>
                                {t("danger-zone-description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                variant="destructive"
                                className="w-full"
                                onClick={handleLogout}
                            >
                                <LogOut className="me-2 h-4 w-4" />
                                {t("logout")}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Page>
    );
}
