"use client";

import { getToken } from 'firebase/messaging'
import { messaging } from './firebase'
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";
import { Novu } from '@novu/node';

export default function Home() {
  const { data: session } = useSession();

  const requestPermission = async () => {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      // get token
      //@ts-ignore
      const token = await getToken(messaging, { vapidkey: 'BP8fYRkW78MpvSRhCkvLI_W3PCBNPndk2TInIV9N9VpDUi0S0jhDMdlC2K8svzRP6fmMPBhD4by2KOkN0eLu2z4' })
      console.log("token-clinet", token)
    } else if (permission === 'denied') {
      alert('Persmission denied!')
    }
  }

  useEffect(() => {
    requestPermission();
  }, [])


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
