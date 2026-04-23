import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const SellerSuspendedPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🚫</div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          حسابك موقوف
        </h1>

        <p className="text-gray-600 mb-6 leading-relaxed">
          عزيزي <span className="font-medium text-gray-800">{user?.name}</span>،
          <br />
          تم إيقاف حساب متجرك
          <span className="font-medium text-red-600"> "{user?.storeName}"</span>
          مؤقتاً.
        </p>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-sm text-red-800">
          <p className="font-medium mb-1">❗ لماذا تم الإيقاف؟</p>
          <p>قد يكون السبب مخالفة لسياسات المنصة. يرجى التواصل مع الإدارة لمعرفة التفاصيل وإعادة تفعيل حسابك.</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-sm text-gray-600">
          <p className="font-medium mb-1">📧 تواصل معنا:</p>
          <p>support@ecommerce.com</p>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="block w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            العودة للمتجر
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

export default SellerSuspendedPage;