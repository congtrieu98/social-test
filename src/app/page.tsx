"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";
// import { noti } from "@/utils/hook/notifi-sw";
// import { RequestPermission } from "@/utils/hook/notifications";

export default function Home() {
  const { data: session } = useSession();

  // useEffect(() => {
  //   noti();
  // }, []);

  // useEffect(() => {
  //   const handlePermission = () => {
  //     try {
  //       RequestPermission();
  //     } catch (error) {
  //       console.error("Error getting curenToken:", error);
  //     }
  //   };
  //   handlePermission();
  // }, []);

  return (
    <>
      {session?.user && (
        <div className="text-base">
          Welcome to{" "}
          <span className="font-semibold">{session?.user?.name}</span> come
          back!
        </div>
      )}

      {!session && (
        <div className="text-xl leading-7 ">
          <div className="p-2 text-center font-semibold">Vui lòng đăng nhập</div>
          <Button className="w-full" onClick={() => signIn("google")}>Sign in</Button>
        </div>
      )}
    </>
  );
}
