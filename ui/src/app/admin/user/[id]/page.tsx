"use client";

import { Page } from "@/components/Page";
import { useEffect, useState } from "react";
import { generateCsrfToken } from "@/lib/utils/csrf.helper";
import { getCookie } from "@/lib/utils/cookie.helper";
import { getUser } from "@/actions/user.action";
import toast from "react-hot-toast";
import {
    UserDetailView,
    UserDetailSkeleton,
} from "@/components/user/UserDetailView";

type User = {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    chatId: number;
    photoUrl: string;
};

type Props = {
    params: { id: string };
};

export default async function UserDetailPage({ params }: Props) {
    const { id } = await params;
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            try {
                const csrf = generateCsrfToken(getCookie("csrf") ?? "");
                const result = JSON.parse(await getUser({ id, csrf }));

                if (result.success) {
                    setUser(result.data);
                } else {
                    toast.error(`Failed to get user: ${result.message}`);
                    setUser(null);
                }
            } catch (error) {
                toast.error("An unexpected error occurred.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [id]);

    return (
        <Page back={true}>
            <div className="p-4 md:p-6">
                {isLoading ? (
                    <UserDetailSkeleton />
                ) : (
                    <UserDetailView user={user} />
                )}
            </div>
        </Page>
    );
}
