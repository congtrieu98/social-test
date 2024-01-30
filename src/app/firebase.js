import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

//from firebase console
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDylIfrcYXbsIj3TjE4CKXJLNMxUDCDqas",
    authDomain: "social-network-406414.firebaseapp.com",
    projectId: "social-network-406414",
    storageBucket: "social-network-406414.appspot.com",
    messagingSenderId: "1027302965022",
    appId: "1:1027302965022:web:747ac231f96398395b930f",
    measurementId: "G-N0YGPXXG27"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firebase Cloud Messaging and get a reference to the service
export const messaging = getMessaging(app);

export const onMessageListener = () =>
    new Promise((resolve) => {
        onMessage(messaging, (payload) => {
            console.log("payload", payload)
            resolve(payload);
        });
    });
