import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiPackage } from 'react-icons/fi';
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

const SellerProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ✅ جديد - فلتر الحالة
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

      // ✅ فلترة محلية حسب الحالة
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

  // ✅ إحصائيات سريعة
  const allItems = products;
  const activeCount = allItems.filter((p) => p.isActive).length;
  const inactiveCount = allItems.filter((p) => !p.isActive).length;

  const activeFilters = [
    { value: 'all', label: 'الكل' },
    { value: 'active', label: `نشط (${activeCount})` },
    { value: 'inactive', label: `غير نشط (${inactiveCount})` },
  ];

  return (
    <div>
      {/* العنوان + زر الإضافة */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">منتجاتي</h1>
          <p className="text-gray-500 mt-1">إدارة منتجات متجرك</p>
        </div>

        <Link
          to="/seller/products/new"
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          <FiPlus size={18} />
          إضافة منتج
        </Link>
      </div>

      {/* البحث + فلتر الحالة */}
      <div className="bg-white rounded-xl border p-4 mb-4 space-y-3">
        {/* البحث */}
        <div className="relative">
          <FiSearch
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="ابحث في منتجاتك..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pr-10 pl-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
          />
        </div>

        {/* ✅ جديد - فلاتر الحالة */}
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => {
                setActiveFilter(filter.value);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeFilter === filter.value
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* الجدول */}
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchProducts} />
      ) : products.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <FiPackage size={48} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {activeFilter === 'inactive'
              ? 'لا توجد منتجات غير نشطة'
              : activeFilter === 'active'
              ? 'لا توجد منتجات نشطة'
              : 'لا توجد منتجات'}
          </h3>
          <p className="text-gray-400 mb-4">ابدأ بإضافة أول منتج لمتجرك</p>
          <Link
            to="/seller/products/new"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <FiPlus size={18} />
            إضافة منتج
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">المنتج</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">السعر</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">المخزون</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600">الحالة</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600">إجراءات</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50 ${!product.isActive ? 'bg-gray-50/50' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={product.imageUrl || '/placeholder-product.png'}
                            alt={product.name}
                            width={40}
                            height={40}
                            className={`w-10 h-10 rounded-lg object-cover ${
                              !product.isActive ? 'opacity-50' : ''
                            }`}
                            onError={(e) => {
                              e.target.src = '/placeholder-product.png';
                            }}
                          />
                          {/* ✅ مؤشر غير نشط على الصورة */}
                          {!product.isActive && (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/30 rounded-lg">
                              <span className="text-white text-xs">🚫</span>
                            </div>
                          )}
                        </div>

                        <div>
                          <p className={`font-medium line-clamp-1 ${
                            !product.isActive ? 'text-gray-400' : 'text-gray-800'
                          }`}>
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-400">{product.categoryName}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      {formatPrice(product.price)}
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-sm ${
                        product.stockQuantity === 0
                          ? 'text-red-600 font-medium'
                          : product.stockQuantity <= 5
                          ? 'text-orange-500 font-medium'
                          : 'text-gray-700'
                      }`}>
                        {product.stockQuantity === 0 ? 'نفذ' : product.stockQuantity}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        product.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        {product.isActive ? '✅ نشط' : '🚫 غير نشط'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/seller/products/${product.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                          title="تعديل"
                        >
                          <FiEdit2 size={16} />
                        </Link>

                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          title="حذف"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="p-4 border-t">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
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