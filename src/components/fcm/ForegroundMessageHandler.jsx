import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMessagingInstance, onMessage } from '../../firebase/firebase';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

function getDataValue(data, ...keys) {
  for (const key of keys) {
    const value = data[key];
    if (value !== undefined && value !== null) return value;
  }
  return null;
}

export function resolveNotificationUrl(data, user) {
  const url = getDataValue(data, 'url', 'Url', 'URL', 'deepLink', 'DeepLink', 'link');
  if (url) return url;

  const orderId = getDataValue(data, 'orderId', 'OrderId', 'id', 'Id', 'order_id', 'Order_Id');
  if (!orderId) return '/';

  const role = user?.role;
  if (role === 'SuperAdmin') return `/admin/orders/${orderId}`;
  if (role === 'Seller') return `/seller/orders/${orderId}`;
  return `/orders/${orderId}`;
}

const ForegroundMessageHandler = () => {
  const unsubRef = useRef(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    let cancelled = false;

    async function init() {
      const messaging = await getMessagingInstance();
      if (!messaging || cancelled) return;

      const unsubscribe = onMessage(messaging, (payload) => {
        const title = payload.notification?.title || 'إشعار جديد';
        const body = payload.notification?.body || '';
        const data = payload.data || {};

        toast.custom(
          (t) => (
            <div
              onClick={() => {
                toast.dismiss(t.id);
                const url = resolveNotificationUrl(data, user);
                navigate(url);
              }}
              className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors max-w-sm"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">🔔</span>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm">{title}</p>
                  {body && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{body}</p>}
                </div>
              </div>
            </div>
          ),
          { duration: 5000, position: 'top-center' }
        );
      });

      unsubRef.current = unsubscribe;
    }

    init();

    return () => {
      cancelled = true;
      if (unsubRef.current) {
        unsubRef.current();
      }
    };
  }, [navigate, user]);
};

export default ForegroundMessageHandler;
