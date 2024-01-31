"use client";

import { getToken } from "firebase/messaging";
import { messaging } from "./firebase";
import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();

  const requestPermission = async () => {
    console.log("vào requestPermission");
    const permission = await Notification.requestPermission();
    console.log("permission:", permission);
    if (permission === "granted") {
      console.log("vào đây");
      const token = await getToken(messaging, {
        //@ts-ignore
        vapidkey:
          "BL2-WcjFdCOth65xJuEKlx97guNeOGcRzQwlPFFE4_FDcTC9cOGODM5a_l1A9SGx7uix62CPCZz7LTpElp8AElk",
      }).then((curenToken) => {
        console.log(curenToken);
      });
      console.log("token-clinet", token);
    } else if (permission === "denied") {
      console.log("Persmission denied!");
      alert("Persmission denied!");
    }
  };

  useEffect(() => {
    console.log("vào useEffect");
    requestPermission();
  }, []);

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
