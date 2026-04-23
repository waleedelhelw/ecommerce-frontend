const SalesChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-bold mb-4">📈 المبيعات</h3>
        <p className="text-gray-500 text-center py-8">لا توجد بيانات</p>
      </div>
    );
  }

  const maxValue = Math.max(...data.map((d) => d.value || d.total || 0));

  return (
    <div className="bg-white rounded-xl border p-6">
      <h3 className="font-bold mb-6">📈 المبيعات</h3>
      <div className="flex items-end gap-2 h-48">
        {data.map((item, index) => {
          const height = maxValue > 0 ? ((item.value || item.total || 0) / maxValue) * 100 : 0;
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <span className="text-xs text-gray-500">
                {(item.value || item.total || 0).toLocaleString()}
              </span>
              <div
                className="w-full bg-blue-500 rounded-t-md transition-all duration-500"
                style={{ height: `${Math.max(height, 4)}%` }}
              ></div>
              <span className="text-xs text-gray-400">{item.label || item.month}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SalesChart;