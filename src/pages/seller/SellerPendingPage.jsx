import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const SellerPendingPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        {/* أيقونة */}
        <div className="text-6xl mb-4">⏳</div>

        {/* العنوان */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          في انتظار الموافقة
        </h1>

        {/* الرسالة */}
        <p className="text-gray-600 mb-6 leading-relaxed">
          مرحباً <span className="font-medium text-gray-800">{user?.name}</span>،
          <br />
          تم استلام طلب تسجيلك كبائع لمتجر
          <span className="font-medium text-green-600"> "{user?.storeName}"</span>.
          <br />
          سيتم مراجعة طلبك والرد عليك في أقرب وقت.
        </p>

        {/* معلومات إضافية */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-sm text-yellow-800">
          <p className="font-medium mb-1">⚡ ما الخطوة التالية؟</p>
          <ul className="text-right space-y-1">
            <li>• سيقوم مدير الموقع بمراجعة بياناتك</li>
            <li>• ستصلك إشعار عند الموافقة</li>
            <li>• بعد الموافقة تقدر تضيف منتجاتك وتبدأ البيع</li>
          </ul>
        </div>

        {/* الأزرار */}
        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            تصفح المتجر
          </Link>
          <button
            onClick={logout}
            className="block w-full text-red-600 py-2.5 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            تسجيل الخروج
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellerPendingPage;