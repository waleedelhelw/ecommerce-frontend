import { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import adminUserService from '../../api/admin/adminUserService';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        pageNumber: currentPage,
        pageSize: 10,
      };
      if (searchTerm) params.searchTerm = searchTerm;

      const data = await adminUserService.getUsers(params);
      // ✅ الـ Service دلوقتي بيرجع response.data.data
      // اللي هو { items: [...], totalPages, ... }
      setUsers(data?.items || data || []);
      setTotalPages(data?.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('فشل في تحميل المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  const handleToggleStatus = async (userId) => {
    try {
      await adminUserService.toggleUserStatus(userId);
      toast.success('تم تحديث حالة المستخدم');
      fetchUsers();
    } catch (error) {
      toast.error('فشل تحديث حالة المستخدم');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا المستخدم؟')) return;
    try {
      await adminUserService.deleteUser(userId);
      toast.success('تم حذف المستخدم');
      fetchUsers();
    } catch (error) {
      toast.error('فشل حذف المستخدم');
    }
  };

  // ✅ Helper لعرض الدور بالعربي
  const getRoleBadge = (role) => {
    switch (role) {
      case 'SuperAdmin':
        return <Badge variant="primary">سوبر أدمن</Badge>;
      case 'Seller':
        return <Badge variant="warning">بائع</Badge>;
      case 'Customer':
        return <Badge variant="default">عميل</Badge>;
      default:
        return <Badge variant="default">{role}</Badge>;
    }
  };

  const columns = [
    {
      header: '#',
      render: (row) => <span className="font-medium">{row.id}</span>,
    },
    {
      header: 'الاسم',
      // ✅ الـ API بيرجع name مش firstName + lastName
      render: (row) => (
        <div>
          <span className="font-medium">{row.name}</span>
          {row.phone && (
            <p className="text-xs text-gray-400">{row.phone}</p>
          )}
        </div>
      ),
    },
    {
      header: 'البريد',
      render: (row) => <span className="text-sm text-gray-600">{row.email}</span>,
    },
    {
      header: 'الدور',
      // ✅ بيعرض كل الأدوار صح
      render: (row) => getRoleBadge(row.role),
    },
    {
      header: 'الحالة',
      render: (row) =>
        row.isActive ? (
          <Badge variant="success">نشط</Badge>
        ) : (
          <Badge variant="danger">محظور</Badge>
        ),
    },
    {
      header: 'تاريخ التسجيل',
      render: (row) => (
        <span className="text-sm text-gray-500">
          {formatDate(row.createdAt)}
        </span>
      ),
    },
    {
      header: 'إجراءات',
      // ✅ السوبر أدمن مش بيتحظر أو يتحذف
      render: (row) =>
        row.role !== 'SuperAdmin' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleStatus(row.id)}
              className={`text-sm font-medium px-3 py-1 rounded-lg ${
                row.isActive
                  ? 'text-red-600 hover:bg-red-50'
                  : 'text-green-600 hover:bg-green-50'
              }`}
            >
              {row.isActive ? 'حظر' : 'تفعيل'}
            </button>
            <button
              onClick={() => handleDeleteUser(row.id)}
              className="text-sm font-medium px-3 py-1 rounded-lg text-red-600 hover:bg-red-50"
            >
              حذف
            </button>
          </div>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">👥 إدارة المستخدمين</h1>

      <div className="mb-6">
        <SearchBar
          onSearch={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          placeholder="ابحث عن مستخدم..."
        />
      </div>

      <DataTable columns={columns} data={users} loading={loading} emptyMessage="لا يوجد مستخدمين" />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default AdminUsersPage;