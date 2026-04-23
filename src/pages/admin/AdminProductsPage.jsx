import { useState, useEffect } from 'react';
import { FiTrash2, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import DataTable from '../../components/admin/DataTable';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Badge from '../../components/common/Badge';
import { getAllProducts, deleteProduct } from '../../api/admin/adminProductService';
import { formatPrice } from '../../utils/formatPrice';
import toast from 'react-hot-toast';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getAllProducts({
        pageNumber: currentPage,
        pageSize: 10,
        searchTerm: searchTerm || undefined,
      });
      setProducts(data?.items || data?.products || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('فشل في تحميل المنتجات');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchTerm]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await deleteProduct(deleteTarget.id);
      toast.success('تم حذف المنتج بنجاح');
      setDeleteTarget(null);
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل حذف المنتج');
    } finally {
      setDeleteLoading(false);
    }
  };

  const columns = [
    {
      header: '#',
      render: (row) => <span className="font-medium">{row.id}</span>,
    },
    {
      header: 'الصورة',
      render: (row) => (
        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={row.imageUrl || '/placeholder-product.png'}
            alt={row.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-product.png'; }}
          />
        </div>
      ),
    },
    {
      header: 'الاسم',
      render: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      header: 'المتجر',
      render: (row) => (
        <span className="text-sm text-gray-500">
          {row.storeName || row.sellerName || '—'}
        </span>
      ),
    },
    {
      header: 'السعر',
      render: (row) => <span className="font-bold text-blue-600">{formatPrice(row.price)}</span>,
    },
    {
      header: 'الكمية',
      render: (row) => (
        <span className={row.stockQuantity === 0 ? 'text-red-600 font-bold' : ''}>
          {row.stockQuantity}
        </span>
      ),
    },
    {
      header: 'الحالة',
      render: (row) =>
        row.isActive !== false ? (
          <Badge variant="success">نشط</Badge>
        ) : (
          <Badge variant="danger">غير نشط</Badge>
        ),
    },
    {
      header: 'إجراءات',
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/products/${row.id}`}
            target="_blank"
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            title="عرض"
          >
            <FiEye size={16} />
          </Link>
          <button
            onClick={() => setDeleteTarget(row)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
            title="حذف"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">📦 إدارة المنتجات</h1>

      <div className="mb-6">
        <SearchBar
          onSearch={(term) => { setSearchTerm(term); setCurrentPage(1); }}
          placeholder="ابحث عن منتج..."
        />
      </div>

      <DataTable columns={columns} data={products} loading={loading} emptyMessage="لا توجد منتجات" />

      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="حذف المنتج"
        message={`هل أنت متأكد من حذف "${deleteTarget?.name}"؟ لا يمكن التراجع عن هذا الإجراء.`}
        confirmText={deleteLoading ? 'جاري الحذف...' : 'حذف'}
        danger
      />
    </div>
  );
};

export default AdminProductsPage;