import { Link } from 'react-router-dom';

const UnauthorizedPage = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <span className="text-8xl mb-4">🔐</span>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">401</h1>
      <p className="text-xl text-gray-600 mb-6">غير مصرّح</p>
      <p className="text-gray-500 mb-8">يجب تسجيل الدخول للوصول لهذه الصفحة</p>
      <Link to="/login" className="btn-primary">تسجيل الدخول</Link>
    </div>
  );
};

export default UnauthorizedPage;
