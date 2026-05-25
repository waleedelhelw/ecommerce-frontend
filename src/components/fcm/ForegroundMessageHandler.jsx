import { useEffect, useRef, useState, useCallback } from 'react';
import { getMessagingInstance, onMessage } from '../../firebase/firebase';
import useAuth from '../../hooks/useAuth';
import toast from 'react-hot-toast';

const SWIPE_THRESHOLD = 60;

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

function SwipeableToast({ t, title, body, data, userRef, toastId }) {
  const [offsetX, setOffsetX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const startX = useRef(0);
  const moved = useRef(false);

  const handleTouchStart = useCallback((e) => {
    moved.current = false;
    startX.current = e.touches[0].clientX;
    setSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e) => {
    const dx = e.touches[0].clientX - startX.current;
    if (Math.abs(dx) > 5) moved.current = true;
    if (Math.abs(dx) > 20) e.preventDefault();
    setOffsetX(dx);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setSwiping(false);
    if (Math.abs(offsetX) > SWIPE_THRESHOLD) {
      toast.dismiss(toastId);
    } else {
      setOffsetX(0);
    }
  }, [offsetX, toastId]);

  const handleClick = useCallback(() => {
    if (moved.current) return;
    toast.dismiss(t.id);
    const url = resolveNotificationUrl(data, userRef.current);
    window.location.href = url;
  }, [t, data, userRef]);

  return (
    <div
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: `translateX(${offsetX}px)`,
        transition: swiping ? 'none' : 'transform 0.3s ease',
        touchAction: 'pan-y',
      }}
      className="bg-white border border-gray-200 rounded-xl shadow-lg p-4 cursor-pointer hover:bg-gray-50 transition-colors max-w-sm select-none"
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0">🔔</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm">{title}</p>
          {body && <p className="text-xs text-gray-600 mt-1 line-clamp-2">{body}</p>}
        </div>
      </div>
    </div>
  );
}

const ForegroundMessageHandler = () => {
  const unsubRef = useRef(null);
  const { user } = useAuth();
  const userRef = useRef(user);
  userRef.current = user;

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
            <SwipeableToast
              t={t}
              title={title}
              body={body}
              data={data}
              userRef={userRef}
              toastId={t.id}
            />
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
  }, [user?.userId]);
};

export default ForegroundMessageHandler;
