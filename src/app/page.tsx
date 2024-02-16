"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import RequestPermission from "@/utils/hook/notifications";

export default function Home() {
  const { data: session } = useSession();

  useEffect(() => {
    const handlePermission = async () => {
      try {
        await RequestPermission();
      } catch (error) {
        console.error("Error getting curenToken:", error);
      }
    };
    handlePermission();
  }, []);

  return (
    <>
      {session?.user ? (
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
