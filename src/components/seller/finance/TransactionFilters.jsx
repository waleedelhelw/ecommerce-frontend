import { FiFilter, FiX } from 'react-icons/fi';
import TransactionsSearch from './TransactionsSearch';

const TransactionFilters = ({ filters, onChange, onReset }) => {
  // عدّ الفلاتر المفعّلة
  const activeFiltersCount = [
    filters.type,
    filters.status,
    filters.fromDate,
    filters.toDate,
    filters.search,
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FiFilter className="text-gray-500" size={18} />
          <h3 className="font-semibold text-gray-800">الفلاتر</h3>
          {activeFiltersCount > 0 && (
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
              {activeFiltersCount} مفعّل
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1"
          >
            <FiX size={14} />
            مسح الكل
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-3">
        <TransactionsSearch
          value={filters.search}
          onChange={(value) => onChange('search', value)}
        />
      </div>

      {/* فلاتر */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* من تاريخ */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            من تاريخ
          </label>
          <input
            type="date"
            value={filters.fromDate || ''}
            onChange={(e) => onChange('fromDate', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* إلى تاريخ */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            إلى تاريخ
          </label>
          <input
            type="date"
            value={filters.toDate || ''}
            onChange={(e) => onChange('toDate', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* النوع */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            النوع
          </label>
          <select
            value={filters.type || ''}
            onChange={(e) => onChange('type', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">الكل</option>
            <option value="Sale">بيع</option>
            <option value="Commission">عمولة</option>
            <option value="Refund">استرجاع</option>
            <option value="Payout">سحب</option>
            <option value="Adjustment">تعديل إداري</option>
            <option value="Bonus">مكافأة</option>
          </select>
        </div>

        {/* الحالة */}
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            الحالة
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onChange('status', e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">الكل</option>
            <option value="Pending">معلق</option>
            <option value="Available">متاح</option>
            <option value="Completed">مكتمل</option>
            <option value="Cancelled">ملغي</option>
          </select>
        </div>
      </div>

      {/* أزرار الفترات السريعة */}
      <div className="mt-3 pt-3 border-t flex flex-wrap items-center gap-2">
        <span className="text-xs text-gray-500 ml-2">فترات سريعة:</span>
        <QuickDateButton label="اليوم" days={0} onClick={onChange} />
        <QuickDateButton label="آخر 7 أيام" days={7} onClick={onChange} />
        <QuickDateButton label="آخر 30 يوم" days={30} onClick={onChange} />
        <QuickDateButton label="هذا الشهر" type="month" onClick={onChange} />
        <QuickDateButton label="هذه السنة" type="year" onClick={onChange} />
      </div>
    </div>
  );
};

// ============ زر فترة سريعة ============
const QuickDateButton = ({ label, days, type, onClick }) => {
  const handleClick = () => {
    const today = new Date();
    let fromDate;

    if (type === 'month') {
      fromDate = new Date(today.getFullYear(), today.getMonth(), 1);
    } else if (type === 'year') {
      fromDate = new Date(today.getFullYear(), 0, 1);
    } else if (days === 0) {
      fromDate = today;
    } else {
      fromDate = new Date();
      fromDate.setDate(today.getDate() - days);
    }

    const fromStr = fromDate.toISOString().split('T')[0];
    const toStr = today.toISOString().split('T')[0];

    onClick('fromDate', fromStr);
    setTimeout(() => onClick('toDate', toStr), 50);
  };

  return (
    <button
      onClick={handleClick}
      className="px-3 py-1 border rounded-full text-xs text-gray-600 hover:bg-green-50 hover:text-green-600 hover:border-green-300 transition-colors"
    >
      {label}
    </button>
  );
};

export default TransactionFilters;