"use client";

import CustomNotificationCenter from "@/utils/hook/notifications";
import {
  NovuProvider,
  PopoverNotificationCenter,
  NotificationBell,
  IMessage,
} from "@novu/notification-center";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

function NotificationMenu() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const handleOnNotificationClick = (message: IMessage) => {
    if (message?.payload?.url) {
      if (pathname === `/tasks/${message?.payload?.url}`) {
        return null;
      } else {
        router.push(`/tasks/${message?.payload?.url}` as string);
        router.refresh();
      }
    }
  };

  return (
    <>
      {session?.user?.id ? (
        <NovuProvider
          // backendUrl="/tasks"
          subscriberId={session?.user.id}
          applicationIdentifier={"5GtKNumdERcE"}
        >
          <PopoverNotificationCenter
            colorScheme={"light"}
            onNotificationClick={handleOnNotificationClick}
          >
            {({ unseenCount }) => (
              <NotificationBell unseenCount={unseenCount} />
            )}
          </PopoverNotificationCenter>
          {/* <CustomNotificationCenter /> */}
        </NovuProvider>
      ) : (
        ""
      )}
    </>
  );
}

export default NotificationMenu;
