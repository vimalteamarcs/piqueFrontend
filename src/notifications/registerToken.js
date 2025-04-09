import { getToken, messaging } from "./firebase";


export const getFcmToken = async () => {
    try {
        // First, register the service worker
        await navigator.serviceWorker.register('/p/firebase-messaging-sw.js');
    
        // Then wait for it to become active
        const swReg = await navigator.serviceWorker.ready;
    
        // Now request the FCM token
        const currentToken = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: swReg,
        });
    
        if (currentToken) {
          console.log('✅ FCM Token:', currentToken);
          return currentToken;
        } 
    } catch (error) {
        console.error('Error while generating FCM token:', error);
        return null;
    }
};
