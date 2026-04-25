import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const DataTable = ({ columns, data, loading, emptyMessage = 'لا توجد بيانات' }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border p-8">
        <LoadingSpinner />
      </div>
    );
  }

  // ✅ حماية إضافية: تأكد إن data هي array
  const safeData = Array.isArray(data) ? data : [];

  if (safeData.length === 0) {
    return (
      <div className="bg-white rounded-xl border">
        <EmptyState icon="📭" title={emptyMessage} message="لم يتم العثور على نتائج" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="text-right px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeData.map((row, rowIndex) => (
              <tr
                key={row.id || rowIndex}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 text-sm">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;