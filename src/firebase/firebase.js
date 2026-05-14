import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'tasawwaq-web.firebaseapp.com',
  projectId: 'tasawwaq-web',
  storageBucket: 'tasawwaq-web.firebasestorage.app',
  messagingSenderId: '418672200066',
  appId: '1:418672200066:web:2077f2dac1dfc5ce1e679b',
  measurementId: 'G-LSCSH2F76X',
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

export const VAPID_KEY = 'VITE_FIREBASE_VAPID_KEY';
