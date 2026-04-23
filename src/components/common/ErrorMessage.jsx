import { FiAlertCircle } from 'react-icons/fi';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <FiAlertCircle size={48} className="text-red-500 mb-4" />
      <h3 className="text-xl font-bold text-gray-700 mb-2">حدث خطأ</h3>
      <p className="text-gray-500 mb-6">{message || 'حدث خطأ غير متوقع'}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          إعادة المحاولة
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;