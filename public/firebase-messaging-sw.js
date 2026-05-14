importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'VITE_FIREBASE_API_KEY',
  authDomain: 'tasawwaq-web.firebaseapp.com',
  projectId: 'tasawwaq-web',
  storageBucket: 'tasawwaq-web.firebasestorage.app',
  messagingSenderId: '418672200066',
  appId: '1:418672200066:web:2077f2dac1dfc5ce1e679b',
  measurementId: 'G-LSCSH2F76X',
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'إشعار جديد';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/logo.svg',
    badge: '/favicon.svg',
    data: payload.data || {},
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};

  // 1. Use explicit url if provided
  let urlToOpen = data.url || '/';

  // 2. If no url but has orderId, determine path based on user role
  if (!data.url && data.orderId) {
    const orderId = data.orderId;

    // Try to infer role from currently open pages
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        const hasAdminPage = clientList.some((c) => c.url.includes('/admin/'));
        const hasSellerPage = clientList.some((c) => c.url.includes('/seller/'));

        if (hasAdminPage) urlToOpen = `/admin/orders/${orderId}`;
        else if (hasSellerPage) urlToOpen = `/seller/orders/${orderId}`;
        else urlToOpen = `/orders/${orderId}`;

        return openOrFocus(clientList, urlToOpen);
      })
    );
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      return openOrFocus(clientList, urlToOpen);
    })
  );
});

function openOrFocus(clientList, url) {
  for (const client of clientList) {
    if (client.url === url && 'focus' in client) {
      return client.focus();
    }
  }
  return clients.openWindow(url);
}
