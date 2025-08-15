"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { isRGB } from "@telegram-apps/sdk-react";
import Link from "next/link";
import type { FC, ReactNode } from "react";
import { buttonVariants } from "../ui/button";

export type DisplayDataRow = {
    title: string;
} & ({ type: "link"; value?: string } | { value: ReactNode });

export interface DisplayDataProps {
    header?: ReactNode;
    footer?: ReactNode;
    rows: DisplayDataRow[];
}

const renderValue = (item: DisplayDataRow) => {
    if (item.value === undefined || item.value === null) {
        return <span className="text-muted-foreground italic">empty</span>;
    }

    if ("type" in item && item.type === "link") {
        return (
            <Link
                href={item.value ?? "#"}
                className={cn(
                    buttonVariants({ variant: "default", size: "sm" })
                )}
                target="_blank"
                rel="noopener noreferrer"
            >
                Open
            </Link>
        );
    }

    if (typeof item.value === "boolean") {
        return <Checkbox checked={item.value} disabled />;
    }

    if (typeof item.value === "string" && isRGB(item.value)) {
        return (
            <div className="flex items-center gap-x-2">
                <div
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: item.value }}
                />
                <span className="font-mono text-sm">{item.value}</span>
            </div>
        );
    }

    return String(item.value);
};

export const DisplayData: FC<DisplayDataProps> = ({ header, footer, rows }) => (
    <Card>
        {header && (
            <CardHeader>
                <CardTitle>{header}</CardTitle>
            </CardHeader>
        )}
        <CardContent className="p-0">
            <div className="flex flex-col">
                {rows.map((row, idx) => (
                    <div key={idx}>
                        <div className="flex min-h-[3.5rem] items-center justify-between p-4">
                            <span className="text-sm font-medium text-muted-foreground">
                                {row.title}
                            </span>
                            <div className="text-end text-sm">
                                {renderValue(row)}
                            </div>
                        </div>
                        {idx < rows.length - 1 && <Separator />}
                    </div>
                ))}
            </div>
        </CardContent>
        {footer && (
            <CardFooter>
                <p className="pt-4 text-sm text-muted-foreground">{footer}</p>
            </CardFooter>
        )}
    </Card>
);
