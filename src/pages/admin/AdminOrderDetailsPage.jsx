import { useState, useEffect } from 'react';
import DataTable from '../../components/admin/DataTable';
import SearchBar from '../../components/common/SearchBar';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import { getAllUsers, toggleUserStatus } from '../../api/admin/adminUserService';
import { formatDate } from '../../utils/formatDate';
import { ROLES } from '../../utils/constants';
import toast from 'react-hot-toast';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        pageNumber: currentPage,
        pageSize: 10,
      };
      if (searchTerm) params.searchTerm = searchTerm;
      if (roleFilter) params.role = roleFilter;

      const data = await getAllUsers(params);
      setUsers(data?.items || data?.users || data || []);
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
  }, [currentPage, searchTerm, roleFilter]);

  const handleToggleStatus = async (userId) => {
    try {
      await toggleUserStatus(userId);
      toast.success('تم تحديث حالة المستخدم');
      fetchUsers();
    } catch (error) {
      toast.error('فشل تحديث حالة المستخدم');
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case ROLES.SUPER_ADMIN:
        return <Badge variant="danger">سوبر أدمن</Badge>;
      case ROLES.SELLER:
        return <Badge variant="primary">بائع</Badge>;
      case ROLES.CUSTOMER:
        return <Badge variant="default">عميل</Badge>;
      default:
        return <Badge variant="default">{role || 'غير معروف'}</Badge>;
    }
  };

  const columns = [
    {
      header: '#',
      render: (row) => <span className="font-medium">{row.id}</span>,
    },
    {
      header: 'الاسم',
      render: (row) => (
        <div>
          <p className="font-medium">
            {row.name || `${row.firstName || ''} ${row.lastName || ''}`.trim() || '—'}
          </p>
          {row.storeName && (
            <p className="text-xs text-gray-400">🏪 {row.storeName}</p>
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
      render: (row) => getRoleBadge(row.role),
    },
    {
      header: 'طريقة التسجيل',
      render: (row) => (
        <span className="text-xs text-gray-500">
          {row.authProvider === 'Google' ? '🔵 Google' : '📧 Local'}
        </span>
      ),
    },
    {
      header: 'الحالة',
      render: (row) =>
        row.isActive !== false ? (
          <Badge variant="success">نشط</Badge>
        ) : (
          <Badge variant="danger">محظور</Badge>
        ),
    },
    {
      header: 'تاريخ التسجيل',
      render: (row) => (
        <span className="text-sm text-gray-500">
          {formatDate(row.createdAt || row.registrationDate)}
        </span>
      ),
    },
    {
      header: 'إجراءات',
      render: (row) =>
        row.role !== ROLES.SUPER_ADMIN ? (
          <button
            onClick={() => handleToggleStatus(row.id)}
            className={`text-sm font-medium px-3 py-1 rounded-lg ${
              row.isActive !== false
                ? 'text-red-600 hover:bg-red-50'
                : 'text-green-600 hover:bg-green-50'
            }`}
          >
            {row.isActive !== false ? 'حظر' : 'تفعيل'}
          </button>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        ),
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">👥 إدارة المستخدمين</h1>

      {/* البحث + الفلتر */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar
            onSearch={(term) => {
              setSearchTerm(term);
              setCurrentPage(1);
            }}
            placeholder="ابحث عن مستخدم..."
          />
        </div>
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="input-field w-auto"
        >
          <option value="">كل الأدوار</option>
          <option value="SuperAdmin">سوبر أدمن</option>
          <option value="Seller">بائع</option>
          <option value="Customer">عميل</option>
        </select>
      </div>

      <DataTable columns={columns} data={users} loading={loading} emptyMessage="لا يوجد مستخدمين" />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminUsersPage;