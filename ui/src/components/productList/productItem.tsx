"use client";

import { useTranslations } from "next-intl";
import { FC, useEffect, useState } from "react";
import { getPanel } from "@/actions/panel.action";
import { getCookie } from "@/lib/utils/cookie.helper";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { DeleteProduct } from "../deleteProduct/deleteProduct";
import { EditProduct } from "../editProduct/editProduct";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Product = {
    id: string;
    name: string;
    panel: string;
};

export const ProductItem: FC<Product> = ({ id, name, panel }) => {
    const t = useTranslations("i18n");
    const [panelName, setPanelName] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isEditOpen, setEditOpen] = useState(false);
    const [isDeleteOpen, setDeleteOpen] = useState(false);

    useEffect(() => {
        const fetchPanelName = async () => {
            try {
                const panelDetail = JSON.parse(
                    await getPanel({
                        id: panel,
                        csrf: generateCsrfToken(getCookie("csrf") ?? ""),
                    })
                );
                setPanelName(panelDetail.name);
            } catch (error) {
                setPanelName("Unknown Panel");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPanelName();
    }, [panel]);

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                    <div className="space-y-1">
                        <CardTitle>{name}</CardTitle>
                        <CardDescription>
                            {isLoading ? (
                                <Skeleton className="h-4 w-24" />
                            ) : (
                                `Panel: ${panelName}`
                            )}
                        </CardDescription>
                    </div>
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
                                className="text-red-600 focus:text-red-600"
                            >
                                <Trash2 className="me-2 h-4 w-4" />
                                <span>{t("delete")}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </CardHeader>
            </Card>

            <EditProduct id={id} open={isEditOpen} onOpenChange={setEditOpen} />
            <DeleteProduct
                id={id}
                name={name}
                open={isDeleteOpen}
                onOpenChange={setDeleteOpen}
            />
        </>
    );
};
