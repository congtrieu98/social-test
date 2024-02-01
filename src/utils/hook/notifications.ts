"use client";

import { getToken } from "firebase/messaging";
import { messaging } from "@/app/firebase";

export default async function RequestPermission() {
  try {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const curenToken = await getToken(messaging, {
        vapidKey:
          "BL2-WcjFdCOth65xJuEKlx97guNeOGcRzQwlPFFE4_FDcTC9cOGODM5a_l1A9SGx7uix62CPCZz7LTpElp8AElk",
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
