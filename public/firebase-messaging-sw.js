// Import Firebase libraries needed for messaging in service worker
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging-compat.js');

// Re-initialize Firebase inside service worker scope
firebase.initializeApp({
    apiKey: "AIzaSyDYeEqHFP5NbCek5ygsInbA-PRBHwdnK5U",
    authDomain: "piqueentertainment-7e672.firebaseapp.com",
    projectId: "piqueentertainment-7e672",
    storageBucket: "piqueentertainment-7e672.firebasestorage.app",
    messagingSenderId: "1068929359199",
    appId: "1:1068929359199:web:9e40c97ef1afd66c9deaea",

});

// Retrieve Firebase Messaging instance
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function (payload) {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);

    const notificationTitle = payload.notification?.title || 'Notification';
    const notificationOptions = {
        body: payload.notification?.body || '',
        icon: '/firebase-logo.png', // optional icon path
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
