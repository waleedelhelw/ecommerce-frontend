import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

const SortableHeader = ({
  label,
  field,
  currentSort,
  currentOrder,
  onSort,
  sortable = true,
  align = 'right',
}) => {
  const isActive = currentSort === field;
  const isAsc = isActive && currentOrder === 'asc';
  const isDesc = isActive && currentOrder === 'desc';

  if (!sortable) {
    return (
      <th className={`text-${align} px-4 py-3 font-medium text-gray-600`}>
        {label}
      </th>
    );
  }

  const handleClick = () => {
    if (!isActive) {
      onSort(field, 'desc');
    } else if (currentOrder === 'desc') {
      onSort(field, 'asc');
    } else {
      onSort(null, null); // إلغاء الترتيب
    }
  };

  return (
    <th
      className={`text-${align} px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:bg-gray-100 transition-colors`}
      onClick={handleClick}
    >
      <div className="flex items-center gap-1">
        <span>{label}</span>
        <div className="flex flex-col">
          <FiChevronUp
            size={12}
            className={`-mb-1 ${isAsc ? 'text-green-600' : 'text-gray-300'}`}
          />
          <FiChevronDown
            size={12}
            className={isDesc ? 'text-green-600' : 'text-gray-300'}
          />
        </div>
      </div>
    </th>
  );
};

export default SortableHeader;