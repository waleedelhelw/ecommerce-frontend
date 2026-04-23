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
      setUsers(data.items || data.users || data || []);
      setTotalPages(data.totalPages || 1);
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

  const columns = [
    {
      header: '#',
      render: (row) => <span className="font-medium">{row.id}</span>,
    },
    {
      header: 'الاسم',
      render: (row) => (
        <span className="font-medium">
          {row.firstName} {row.lastName}
        </span>
      ),
    },
    {
      header: 'البريد',
      render: (row) => <span className="text-sm text-gray-600">{row.email}</span>,
    },
    {
      header: 'الدور',
      render: (row) => (
        <Badge variant={row.role === 'Admin' ? 'primary' : 'default'}>
          {row.role === 'Admin' ? 'مدير' : 'عميل'}
        </Badge>
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
        row.role !== 'Admin' ? (
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default AdminUsersPage;