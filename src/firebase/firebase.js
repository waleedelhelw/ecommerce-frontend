import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

let messagingInstance = null;
let swRegistration = null;
let initPromise = null;

async function initMessaging() {
  const supported = await isSupported();
  if (!supported) return null;

  try {
    if ('serviceWorker' in navigator) {
      swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });
      await navigator.serviceWorker.ready;
    }
  } catch {
    // service worker registration failed, proceed anyway
  }

  messagingInstance = getMessaging(app);
  return messagingInstance;
}

export async function getMessagingInstance() {
  if (messagingInstance) return messagingInstance;
  if (!initPromise) {
    initPromise = initMessaging();
  }
  return initPromise;
}

export async function getFcmToken() {
  const messaging = await getMessagingInstance();
  if (!messaging) return null;

  const getTokenOptions = { vapidKey: VAPID_KEY };
  if (swRegistration) {
    getTokenOptions.serviceWorkerRegistration = swRegistration;
  }

  return getToken(messaging, getTokenOptions);
}

export { onMessage };

export const VAPID_KEY = import.meta.env.VITE_FIREBASE_VAPID_KEY;
