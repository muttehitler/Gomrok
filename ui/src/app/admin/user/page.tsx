"use client";

import { useTranslations } from "next-intl";
import { Page } from "@/components/Page";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/pagination/pagination";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import { getUserList } from "@/actions/user.action";
import { UserItem } from "@/components/userItem/userItem";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";

type User = {
    id: string;
    firstName: string;
    lastName: string;
    username?: string;
    photoUrl?: string;
};

const UserListSkeleton = () => (
    <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
            <div
                key={i}
                className="flex items-center justify-between p-3 border rounded-lg"
            >
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-24" />
                    </div>
                </div>
                <Skeleton className="h-8 w-8" />
            </div>
        ))}
    </div>
);

export default function UserListPage() {
    const t = useTranslations("i18n");
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [usersLength, setUsersLength] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken(getCookie("csrf") ?? "");
                const result = JSON.parse(
                    await getUserList({
                        csrf,
                        startIndex: (currentPage - 1) * pageSize,
                        limit: pageSize,
                        order: -1,
                    })
                );

                if (!result.success) {
                    toast.error(
                        `${t("list-unsuccessfully")}: ${result.message}`
                    );
                    return;
                }

                setUsersLength(result.data.length);
                setUsers(result.data.items);
            } catch (error) {
                toast.error(
                    "An unexpected error occurred while fetching users."
                );
            } finally {
                setIsLoading(false);
            }
        };

        fetchUsers();
    }, [currentPage, pageSize, t]);

    return (
        <Page back={true}>
            <div className="p-4 md:p-6 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight">
                        {t("users")}
                    </h2>
                </div>

                <div className="space-y-4">
                    {isLoading ? (
                        <UserListSkeleton />
                    ) : users.length > 0 ? (
                        users.map((user) => (
                            <UserItem {...user} key={user.id} />
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center">
                            {t("no-users-found")}
                        </p>
                    )}
                </div>

                <div className="mt-6">
                    <Pagination
                        currentPageState={[currentPage, setCurrentPage]}
                        pageCount={Math.ceil(usersLength / pageSize)}
                    />
                </div>
            </div>
        </Page>
    );
}
