/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useToast } from "@/components/ui/use-toast";
// import { getToken } from "firebase/messaging";
// import { messaging } from "@/firebase";

import { useSocket } from "@novu/notification-center";
import { useEffect } from "react";
import { ToastAction } from "@/components/ui/toast";
import { usePathname, useRouter } from "next/navigation";

// export async function RequestPermission() {
//   try {
//     const permission = await Notification.requestPermission();

//     if (permission === "granted") {
//       const curenToken = await getToken(messaging, {
//         vapidKey:
//           "BMWaBBvAJgFL12fdU6HrEP0D6qR9bVWDd3adjJRi7QhcTDCg8ln5hQXEBNY32ylN9FIcJoeg7vy_9WlFkHknmd4",
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

export default function CustomNotificationCenter() {
  const { socket } = useSocket();
  const { toast } = useToast();

  const pathname = usePathname();
  const router = useRouter();

  const handleToaskClick = (data: any) => {
    if (data.message?.payload?.url) {
      if (pathname === `/tasks/${data?.message?.payload?.url}`) {
        return null;
      } else {
        router.push(`/tasks/${data?.message?.payload?.url}` as string);
        router.refresh();
      }
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("notification_received", (data) => {
        toast({
          title: "New Task",
          description: data.message.payload.text,
          action: (
            <ToastAction altText="Detail">
              <div
                // @ts-ignore
                onClick={handleToaskClick(data)}
              >
                Detail
              </div>
            </ToastAction>
          ),
        });
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
