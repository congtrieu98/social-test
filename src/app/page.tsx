"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <>
      {session ? (
        <div className="text-base">
          Welcome to{" "}
          <span className="font-semibold">{session?.user?.name}</span> come
          back!
        </div>
      ) : (
        <div className="text-xl leading-7">
          You are not logged in{" "}
          <p>
            <Button onClick={() => signIn("google")}>Sign in</Button>
          </p>
        </div>
      )}
    </>
  );
}
