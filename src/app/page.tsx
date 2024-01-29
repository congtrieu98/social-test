"use client";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import crypto from "crypto";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();

  // useEffect(() => {
  //   //@ts-ignore
  //   acceptNovuPushWebHookRequest(Request, Response);
  // }, []);

  // const acceptNovuPushWebHookRequest = (
  //   request: { body: any; headers: { [x: string]: any } },
  //   response: any
  // ) => {
  //   const payloadSentByNovu = request.body;
  //   const hmacHashSentByNovu = request.headers["x-novu-signature"];
  //   const secretKey =
  //     ';^j/"/U#2-u4v@5&3/OT7RqwL]5r{#vY?,ZjTAv0xfwuV,-:_/WYj*vuCAbI';
  //   const actualHashValue = crypto
  //     .createHmac("sha256", secretKey)
  //     .update(payloadSentByNovu, "utf-8")
  //     .digest("hex");

  //   if (hmacHashSentByNovu === actualHashValue) {
  //     // handle the notification
  //     console.log("Request sent by Novu");
  //   } else {
  //     throw new Error("Not a valod request");
  //   }
  // };
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
