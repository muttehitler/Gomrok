"use client";

import { useTranslations } from "next-intl";
import { FC, useState } from "react";
import { EditPanel } from "../editPanel/editPanel";
import { DeletePanel } from "../deletePanel/deletePanel";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

type Panel = {
    id: string;
    name: string;
    type: string;
    url: string;
    weight: number;
};

export const PanelItem: FC<Panel> = ({
    id,
    name,
    type,
    url,
    weight,
}: Panel) => {
    const t = useTranslations("i18n");

    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-lg font-medium">
                        {name}
                    </CardTitle>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditOpen(true)}>
                                <Pencil className="me-2 h-4 w-4" />
                                <span>{t("edit")}</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setDeleteOpen(true)}
                                className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40"
                            >
                                <Trash2 className="me-2 h-4 w-4" />
                                <span>{t("delete")}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground truncate">
                        {url}
                    </p>
                </CardContent>
            </Card>

            <EditPanel id={id} open={isEditOpen} onOpenChange={setEditOpen} />

            <DeletePanel
                id={id}
                name={name}
                open={isDeleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
};
