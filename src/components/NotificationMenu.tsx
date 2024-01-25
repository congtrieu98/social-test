"use client";

import { useState, useRef, useEffect } from "react";
import {
  KnockFeedProvider,
  NotificationIconButton,
  NotificationFeedPopover,
} from "@knocklabs/react-notification-feed";

// Required CSS import, unless you're overriding the styling
import "@knocklabs/react-notification-feed/dist/index.css";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";

const YourAppLayout = ({ knockToken }: { knockToken: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const notifButtonRef = useRef(null);

  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient && status === "authenticated" ? (
    <KnockFeedProvider
      apiKey={"pk_test_UvzY6ZVrNaV0trRFBmMy3_Fk0MiwE4c41shpGv03RBs"}
      feedId={"f542e358-c99c-4224-a5ff-958fb2731dd5"}
      userId={session?.user?.id as string}
      userToken={knockToken}
    // In production, you must pass a signed userToken
    // and enable enhanced security mode in your Knock dashboard
    // userToken={currentUser.knockUserToken}
    >
      <>
        <NotificationIconButton
          ref={notifButtonRef}
          onClick={(e) => setIsVisible(!isVisible)}
        />
        <NotificationFeedPopover
          buttonRef={notifButtonRef}
          isVisible={isVisible}
          onClose={() => setIsVisible(false)}
        />
      </>
    </KnockFeedProvider>
  ) : (
    <Bell />
  );
};

export default YourAppLayout;
