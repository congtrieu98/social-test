/* eslint-disable react-hooks/exhaustive-deps */
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

import { useSocket } from "@novu/notification-center";
import { useEffect } from "react";
import { ToastAction } from "@/components/ui/toast";
import { usePathname, useRouter } from "next/navigation";

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
              {/* <Link href={`tasks/${data.message.payload.url}`}>Detail</Link> */}
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


export async function RequestPermission() {
  try {
    Notification.requestPermission().then((per) => {
      if (per === "granted") {
        const noti = new Notification("Example notification!", {
          body: "This is more text",
          data: { hello: "word" }
        })

        noti.addEventListener('close', e => {
          console.log(e)
        })
      } else if (per === "denied") {
        // alert("Permission denied!");
        throw new Error("Permission denied");
      }

    })


  } catch (error) {
    console.error("Error in RequestPermission:", error);
    throw error;
  }
}