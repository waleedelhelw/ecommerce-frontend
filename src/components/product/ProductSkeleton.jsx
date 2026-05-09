const CardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
    <div className="bg-gray-100 h-40 sm:h-48 md:h-52 w-full" />
    <div className="p-3 sm:p-4 space-y-3">
      <div className="h-3 w-16 bg-gray-200 rounded" />
      <div className="h-4 w-full bg-gray-200 rounded" />
      <div className="h-4 w-3/4 bg-gray-200 rounded" />
      <div className="h-3 w-20 bg-gray-200 rounded" />
      <div className="flex items-center justify-between">
        <div className="h-5 w-16 bg-gray-200 rounded" />
        <div className="h-9 w-9 bg-gray-200 rounded-xl" />
      </div>
    </div>
  </div>
);

const ProductSkeleton = ({ count = 4, grid = true }) => {
  if (grid) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="w-[72vw] max-w-[260px] min-w-[210px] shrink-0">
          <CardSkeleton />
        </div>
      ))}
    </div>
  );
};

export default ProductSkeleton;
