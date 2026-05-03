import { useState, useEffect } from 'react';
import { FiSearch, FiX } from 'react-icons/fi';

const TransactionsSearch = ({ value, onChange, placeholder = 'ابحث في الوصف أو رقم المرجع...' }) => {
  const [localValue, setLocalValue] = useState(value || '');

  // Debounce علشان مايبعتش طلب مع كل حرف
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [localValue]);

  // مزامنة مع التغييرات الخارجية (مثل reset)
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);

  const handleClear = () => {
    setLocalValue('');
    onChange('');
  };

  return (
    <div className="relative flex-1">
      <FiSearch
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        size={18}
      />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pr-10 pl-10 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
      />
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
};

export default TransactionsSearch;