const SalesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-bold mb-4">📈 المبيعات</h3>
        <p className="text-gray-500 text-center py-8">لا توجد بيانات</p>
      </div>
    );
  }

  const getValue = (d) => d.value || d.total || d.totalSales || 0;
  const getLabel = (d) => {
    if (d.label) return d.label;
    if (d.month) return d.month;
    if (d.date) {
      const date = new Date(d.date);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    }
    return '';
  };

  const maxValue = Math.max(...data.map(getValue));

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="font-bold mb-6">📈 المبيعات</h3>
      <div className="flex items-end gap-2 h-48 overflow-x-auto">
        {data.map((item, index) => {
          const value = getValue(item);
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          return (
            <div key={index} className="flex-1 min-w-[30px] flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">
                {value.toLocaleString()}
              </span>
              <div
                className="w-full bg-blue-500 rounded-t-md transition-all duration-500"
                style={{ height: `${Math.max(height, 4)}%` }}
              ></div>
              <span className="text-xs text-gray-400">{getLabel(item)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesChart;