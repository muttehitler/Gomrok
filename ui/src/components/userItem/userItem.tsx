"use client";

import { useTranslations } from "next-intl";
import { FC } from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";

type User = {
    id: string;
    firstName: string;
    lastName: string;
    username?: string;
    photoUrl?: string;
};

export const UserItem: FC<User> = ({
    id,
    firstName,
    lastName,
    username,
    photoUrl,
}) => {
    const t = useTranslations("i18n");
    const fullName = `${firstName} ${lastName || ""}`.trim();

    // Get user initials for avatar fallback
    const getInitials = (name: string) => {
        const names = name.split(" ");
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`;
        }
        return names[0] ? names[0][0] : "U";
    };

    return (
        <Card>
            <CardContent className="p-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar>
                            <AvatarImage src={photoUrl} alt={fullName} />
                            <AvatarFallback>
                                {getInitials(fullName)}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                            <p className="font-semibold">{fullName}</p>
                            {username && (
                                <p className="text-sm text-muted-foreground">
                                    @{username}
                                </p>
                            )}
                        </div>
                    </div>
                    <Button asChild variant="ghost" size="icon">
                        <Link href={`/admin/user/${id}`}>
                            <ChevronRight className="h-5 w-5" />
                            <span className="sr-only">{t("details")}</span>
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
