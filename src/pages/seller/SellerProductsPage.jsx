import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage, FiChevronLeft } from 'react-icons/fi';
import { getMyProducts, deleteProduct } from '../../api/seller/sellerProductService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const extractArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const statusGradients = {
  active: 'from-emerald-400 to-green-500',
  inactive: 'from-gray-400 to-gray-500',
};

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm, activeFilter]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getMyProducts({
        pageNumber: currentPage,
        pageSize: 10,
        searchTerm: searchTerm || undefined,
      });

      const items = extractArray(data);

      const filtered = activeFilter === 'all'
        ? items
        : activeFilter === 'active'
          ? items.filter((p) => p.isActive)
          : items.filter((p) => !p.isActive);

      setProducts(filtered);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleteLoading(true);
      await deleteProduct(deleteId);
      toast.success('تم حذف المنتج بنجاح');
      setDeleteId(null);

      if (products.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      } else {
        fetchProducts();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'حدث خطأ في حذف المنتج');
    } finally {
      setDeleteLoading(false);
    }
  };

  const allItems = products;
  const activeCount = allItems.filter((p) => p.isActive).length;
  const inactiveCount = allItems.filter((p) => !p.isActive).length;

  const activeFilters = [
    { value: 'all', label: 'الكل' },
    { value: 'active', label: `نشط (${activeCount})` },
    { value: 'inactive', label: `غير نشط (${inactiveCount})` },
  ];

  const StatusBadge = ({ isActive }) => {
    const gradient = isActive ? statusGradients.active : statusGradients.inactive;
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold text-white bg-gradient-to-r ${gradient} shadow-sm`}>
        {isActive ? 'نشط' : 'غير نشط'}
      </span>
    );
  };

  const StockLabel = ({ quantity }) => {
    if (quantity === 0) {
      return <span className="text-xs font-bold text-red-500">نفذ من المخزون</span>;
    }
    if (quantity <= 5) {
      return <span className="text-xs font-bold text-orange-500">{quantity} متبقي</span>;
    }
    return <span className="text-xs text-gray-500">{quantity} في المخزون</span>;
  };

  const getStockColor = (quantity) => {
    if (quantity === 0) return 'text-red-600';
    if (quantity <= 5) return 'text-orange-500';
    return 'text-gray-700';
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-violet-500" />
            <span className="text-[11px] font-bold text-violet-600 uppercase tracking-wider">المنتجات</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">منتجاتي</h1>
          <p className="text-sm text-gray-500 mt-1">إدارة منتجات متجرك وعرضها للعملاء</p>
        </div>
        <Link
          to="/seller/products/new"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all text-sm font-medium shadow-sm"
        >
          <FiPlus size={16} />
          إضافة منتج
        </Link>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm space-y-3">
        <div className="relative">
          <FiSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="ابحث في منتجاتك..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pr-10 pl-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 focus:border-violet-500 outline-none text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
          {activeFilters.map((filter) => {
            const active = activeFilter === filter.value;
            return (
              <button
                key={filter.value}
                onClick={() => {
                  setActiveFilter(filter.value);
                  setCurrentPage(1);
                }}
                className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  active
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm'
                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700 border border-transparent'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProducts} />
      ) : products.length === 0 && activeFilter === 'all' && !searchTerm ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FiPackage size={32} className="text-violet-300" />
          </div>
          <p className="text-gray-400 font-medium">لا توجد منتجات</p>
          <p className="text-gray-300 text-sm mt-1">ابدأ بإضافة أول منتج لمتجرك</p>
          <Link
            to="/seller/products/new"
            className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl hover:from-emerald-700 hover:to-green-700 transition-all text-sm font-medium shadow-sm"
          >
            <FiPlus size={16} />
            إضافة منتج
          </Link>
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400">لا توجد منتجات مطابقة للبحث</p>
        </div>
      ) : (
        <>
          {/* Mobile: Card layout */}
          <div className="md:hidden space-y-3">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="relative shrink-0">
                    <img
                      src={product.imageUrl || '/placeholder-product.png'}
                      alt={product.name}
                      width={56}
                      height={56}
                      className={`w-14 h-14 rounded-xl object-cover ${!product.isActive ? 'opacity-50' : ''}`}
                      onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                    />
                    {!product.isActive && (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 rounded-xl">
                        <span className="text-white text-xs font-bold">مخفي</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold line-clamp-1 ${!product.isActive ? 'text-gray-400' : 'text-gray-900'}`}>
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{product.categoryName}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-bold text-gray-900">{formatPrice(product.price)}</span>
                      <span className={`text-xs ${getStockColor(product.stockQuantity)}`}>
                        {product.stockQuantity === 0 ? 'نفذ' : `${product.stockQuantity} قطعة`}
                      </span>
                    </div>
                  </div>
                  <StatusBadge isActive={product.isActive} />
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1">
                    <Link
                      to={`/seller/products/${product.id}/edit`}
                      className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center"
                      title="تعديل"
                    >
                      <FiEdit2 size={15} />
                    </Link>
                    <button
                      onClick={() => setDeleteId(product.id)}
                      className="w-9 h-9 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center"
                      title="حذف"
                    >
                      <FiTrash2 size={15} />
                    </button>
                  </div>
                  <StockLabel quantity={product.stockQuantity} />
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Table layout */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">المنتج</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">السعر</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">المخزون</th>
                    <th className="text-right px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">الحالة</th>
                    <th className="text-center px-5 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {products.map((product) => (
                    <tr key={product.id} className={`hover:bg-gray-50/50 transition-colors ${!product.isActive ? 'opacity-60' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative shrink-0">
                            <img
                              src={product.imageUrl || '/placeholder-product.png'}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-xl object-cover"
                              onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                            />
                            {!product.isActive && (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/20 rounded-xl">
                                <span className="text-white text-[10px] font-bold">مخفي</span>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{product.categoryName}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-gray-900">{formatPrice(product.price)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-sm font-medium ${getStockColor(product.stockQuantity)}`}>
                          {product.stockQuantity === 0 ? 'نفذ من المخزون' : product.stockQuantity}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge isActive={product.isActive} />
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            to={`/seller/products/${product.id}/edit`}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                            title="تعديل"
                          >
                            <FiEdit2 size={15} />
                          </Link>
                          <button
                            onClick={() => setDeleteId(product.id)}
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all"
                            title="حذف"
                          >
                            <FiTrash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {totalPages > 1 && (
              <div className="p-5 border-t border-gray-50">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
              </div>
            )}
          </div>

          {/* Mobile: Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 md:hidden">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => !deleteLoading && setDeleteId(null)}
        onConfirm={handleDelete}
        title="حذف المنتج"
        message="هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText={deleteLoading ? 'جاري الحذف...' : 'حذف'}
        danger
      />
    </div>
  );
};

export default SellerProductsPage;
