"use client";

import Link from "next/link";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { FC, ReactNode } from "react";

type AdminLinkCardProps = {
    href: string;
    icon: ReactNode;
    title: string;
    description: string;
};

export const AdminLinkCard: FC<AdminLinkCardProps> = ({
    href,
    icon,
    title,
    description,
}) => {
    return (
        <Link href={href}>
            <Card className="h-full transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
                <CardHeader>
                    <div className="mb-3 text-primary">{icon}</div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </CardHeader>
            </Card>
        </Link>
    );
};
