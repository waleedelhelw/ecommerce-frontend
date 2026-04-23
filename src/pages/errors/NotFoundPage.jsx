import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <span className="text-8xl mb-4">🔍</span>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <p className="text-xl text-gray-600 mb-6">الصفحة غير موجودة</p>
      <p className="text-gray-500 mb-8">عذراً، الصفحة التي تبحث عنها غير موجودة</p>
      <Link to="/" className="btn-primary">العودة للرئيسية</Link>
    </div>
  );
};

export default NotFoundPage;
