import { SORT_OPTIONS } from '../../utils/constants';

const ProductSort = ({ value, onChange, totalItems }) => {
  return (
    <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
      <p className="text-gray-600 text-sm">
        عدد النتائج: <span className="font-bold text-gray-900">{totalItems}</span> منتج
      </p>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">ترتيب حسب:</label>
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="input-field w-auto"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ProductSort;