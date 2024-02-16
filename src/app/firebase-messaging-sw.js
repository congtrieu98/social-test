// importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
// );

// const firebaseConfig = {
//   apiKey: "AIzaSyDylIfrcYXbsIj3TjE4CKXJLNMxUDCDqas",
//   authDomain: "social-network-406414.firebaseapp.com",
//   projectId: "social-network-406414",
//   storageBucket: "social-network-406414.appspot.com",
//   messagingSenderId: "1027302965022",
//   appId: "1:1027302965022:web:747ac231f96398395b930f",
//   measurementId: "G-N0YGPXXG27",
// };

// // firebase.initializeApp(firebaseConfig);
// const messaging = firebase.messaging();
// messaging.onBackgroundMessage((payload) => {
//   console.log("notif incoming", payload);
//   const notificationTitle = JSON.parse(JSON.parse(payload.notification)).title;
//   // payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.image,
//   };

//   self.registration.showNotification(notificationTitle, notificationOptions);
// });
