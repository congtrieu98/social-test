"use client";

import { getToken } from "firebase/messaging";
import { messaging } from "@/app/firebase";

export default async function RequestPermission() {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const curenToken = await getToken(messaging, {
        vapidKey:
          "BNhH2rlGssLDnhNMZMwR09WDgnSjlouPaaEJu2ZFKwtITOt9MElzgwNlRlmpugNx-f2KMfnimBr9tC_RV_qCc5E",
      });
      return curenToken;
    } else if (permission === "denied") {
      // alert("Permission denied!");
      throw new Error("Permission denied");
    }
  } catch (error) {
    console.error("Error in RequestPermission:", error);
    throw error;
  }
}
