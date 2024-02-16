"use client";

import { useToast } from "@/components/ui/use-toast";
// import { getToken } from "firebase/messaging";
// import { messaging } from "@/app/firebase";

// export default async function RequestPermission() {
//   try {
//     const permission = await Notification.requestPermission();

//     if (permission === "granted") {
//       const curenToken = await getToken(messaging, {
//         vapidKey:
//           "BNhH2rlGssLDnhNMZMwR09WDgnSjlouPaaEJu2ZFKwtITOt9MElzgwNlRlmpugNx-f2KMfnimBr9tC_RV_qCc5E",
//       });
//       return curenToken;
//     } else if (permission === "denied") {
//       // alert("Permission denied!");
//       throw new Error("Permission denied");
//     }
//   } catch (error) {
//     console.error("Error in RequestPermission:", error);
//     throw error;
//   }
// }

import { NovuProvider, useSocket } from "@novu/notification-center";
import { useEffect } from "react";

export default function CustomNotificationCenter() {
  const { socket } = useSocket();
  const { toast } = useToast();

  useEffect(() => {
    if (socket) {
      socket.on("notification_received", (data) => {
        console.log(data);
        // set received notification content as toast content
        // setToastContent(data.content)
        // open the toast
        toast(
          {
            title: "New Task",
            description: data.message.payload.text,
          }
          // onclick: () => {

          // }
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("notification_received");
      }
    };
  }, [socket]);

  return "";
}
