/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { AuthSession } from "@/lib/auth/utils";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export const getUserLogin = async () => {
    const session = await getSession();
    return { session } as AuthSession;
};

export const checkUserLogin = async () => {
    const router = useRouter()
    const { session } = await getUserLogin();
    if (!session) router.push("/");
};
