import { FiCheck } from 'react-icons/fi';

const OrderTimeline = ({ currentStatus }) => {
  const steps = [
    { key: 'Pending', label: 'قيد الانتظار' },
    { key: 'Processing', label: 'قيد المعالجة' },
    { key: 'Shipped', label: 'تم الشحن' },
    { key: 'Delivered', label: 'تم التسليم' },
  ];

  const statusOrder = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const currentIndex = statusOrder.indexOf(currentStatus);
  const isCancelled = currentStatus === 'Cancelled';

  if (isCancelled) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <span className="text-2xl">🔴</span>
        <p className="font-bold text-red-700 mt-2">تم إلغاء الطلب</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div key={step.key} className="flex items-center flex-1">
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                index <= currentIndex
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {index <= currentIndex ? <FiCheck size={20} /> : index + 1}
            </div>
            <span className={`text-xs mt-2 text-center ${
              index <= currentIndex ? 'text-green-600 font-medium' : 'text-gray-400'
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`flex-1 h-1 mx-2 rounded ${
                index < currentIndex ? 'bg-green-500' : 'bg-gray-200'
              }`}
            ></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default OrderTimeline;