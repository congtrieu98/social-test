"use client";

import { Button } from "@/components/ui/button";
import { signIn, useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import * as PusherPushNotifications from "@pusher/push-notifications-web";
// import { RequestPermission } from "@/utils/hook/notifications";

export default function Home() {
  const { data: session } = useSession();

  // const beamsClient = new PusherPushNotifications.Client({
  //   instanceId: 'cc48ad09-f709-4be3-9b2c-8abbabc169f5',
  // })

  // beamsClient.getUserId()
  //   .then(userId => {
  //     console.log(userId) // Will log the current user id
  //   })
  //   .catch(e => console.error('Could not get user id', e));


  // beamsClient.start()
  //   .then(() => beamsClient.addDeviceInterest('hello'))
  //   .then(() => console.log('Successfully registered and subscribed!'))
  //   .catch(console.error);


  // useEffect(() => {
  //   // const handlePermission = () => {
  //   if (session?.user) {
  //     console.log("1")
  //     //   try {
  //     Notification.requestPermission().then((per) => {
  //       if (per === "granted") {
  //         const noti = new Notification("Example notification!", {
  //           body: "This is more text",
  //           data: { hello: "word" }
  //         })

  //         noti.addEventListener('click', e => {
  //           return console.log(e)
  //         })
  //       }

  //     })
  //   }

  //   //   } catch (error) {
  //   //     console.error("Error getting curenToken:", error);
  //   //   }
  //   // };
  //   // handlePermission();
  // }, [session?.user]);

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
