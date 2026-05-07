import { SORT_OPTIONS } from '../../utils/constants';

const ProductSort = ({ value, onChange, totalItems }) => {
  return (
    <div className="bg-white border rounded-2xl p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-gray-600 text-sm">
          عدد النتائج: <span className="font-bold text-gray-900">{totalItems}</span> منتج
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="text-sm text-gray-600">ترتيب حسب:</label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full sm:w-auto min-w-[170px] px-3 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default ProductSort;