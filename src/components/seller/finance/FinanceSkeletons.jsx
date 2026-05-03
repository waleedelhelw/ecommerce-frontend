// ============ Skeleton للبطاقات الرئيسية ============
export const SummaryCardsSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
    {[...Array(4)].map((_, i) => (
      <div
        key={i}
        className="bg-gray-200 rounded-xl p-5 h-32 animate-pulse"
      />
    ))}
  </div>
);

// ============ Skeleton للإحصائيات ============
export const StatsCardsSkeleton = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
    {[...Array(2)].map((_, i) => (
      <div key={i} className="bg-white rounded-xl border p-5">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4 animate-pulse" />
        <div className="space-y-3">
          {[...Array(4)].map((_, j) => (
            <div key={j} className="flex justify-between py-2 border-b last:border-b-0">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ============ Skeleton للـ Chart ============
export const ChartSkeleton = () => (
  <div className="bg-white rounded-xl border p-5 mb-6">
    <div className="h-5 bg-gray-200 rounded w-1/4 mb-5 animate-pulse" />
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse" />
      ))}
    </div>
    <div className="h-72 bg-gray-100 rounded-lg animate-pulse" />
  </div>
);

// ============ Skeleton للجدول ============
export const TableSkeleton = ({ rows = 5 }) => (
  <div className="bg-white rounded-xl border overflow-hidden">
    <div className="bg-gray-50 border-b p-4">
      <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse" />
    </div>
    <div className="divide-y">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="h-4 bg-gray-200 rounded w-12 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-full w-20 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
            <div className="h-6 bg-gray-200 rounded-full w-16 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  </div>
);