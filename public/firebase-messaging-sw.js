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

function getVal(data, ...keys) {
  for (const key of keys) {
    if (data[key] !== undefined && data[key] !== null) return String(data[key]);
  }
  return null;
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const data = event.notification.data || {};

  // 1. Use explicit url if provided (try common key formats)
  const url = getVal(data, 'url', 'Url', 'URL', 'deepLink', 'DeepLink', 'link');

  // 2. Try to get orderId (try common key formats)
  const orderId = getVal(data, 'orderId', 'OrderId', 'id', 'Id', 'order_id', 'Order_Id');

  if (url) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        return openOrFocus(clientList, url);
      })
    );
    return;
  }

  if (orderId) {
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
        const hasAdminPage = clientList.some((c) => c.url.includes('/admin/'));
        const hasSellerPage = clientList.some((c) => c.url.includes('/seller/'));

        const targetUrl = hasAdminPage
          ? `/admin/orders/${orderId}`
          : hasSellerPage
            ? `/seller/orders/${orderId}`
            : `/orders/${orderId}`;

        return openOrFocus(clientList, targetUrl);
      })
    );
    return;
  }

  // Fallback: just open home
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      return openOrFocus(clientList, '/');
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
