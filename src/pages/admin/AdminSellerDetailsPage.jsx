import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiX, FiSlash } from 'react-icons/fi';
import {
  getSellerById,
  approveSeller,
  rejectSeller,
  suspendSeller,
  updateCommissionRate,
} from '../../api/admin/adminSellerService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import { sellerStatusMap, getStatusInfo } from '../../utils/orderStatusMap';
import toast from 'react-hot-toast';

const PAYOUT_METHOD_LABELS = {
  BankTransfer: '🏦 تحويل بنكي',
  VodafoneCash: '📱 فودافون كاش',
  EtisalatCash: '📱 اتصالات كاش',
  OrangeCash: '📱 أورانج كاش',
  InstaPay: '🏦 إنستاباي',
};

const AdminSellerDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // ✅ إصلاح - نستخدم string عشان يدعم "0" صح
  const [newCommission, setNewCommission] = useState('');
  const [commissionLoading, setCommissionLoading] = useState(false);

  useEffect(() => {
    fetchSeller();
  }, [id]);

  const fetchSeller = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getSellerById(id);
      setSeller(data);

      // ✅ إصلاح المشكلة الرئيسية
      // ?? بدل || عشان 0 تعتبر قيمة صحيحة مش falsy
      setNewCommission(String(data.commissionRate ?? 10));
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل بيانات البائع');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setActionLoading(true);
      await approveSeller(id);
      toast.success('تم قبول البائع ✅');
      fetchSeller();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل قبول البائع');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    try {
      setActionLoading(true);
      await suspendSeller(id);
      toast.success('تم إيقاف البائع');
      fetchSeller();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل إيقاف البائع');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCommission = async () => {
    // ✅ إصلاح الـ validation
    // newCommission هنا string، فنحوّله لـ number أول
    const value = parseFloat(newCommission);

    if (newCommission === '' || isNaN(value)) {
      toast.error('يرجى إدخال نسبة عمولة');
      return;
    }

    if (value < 0 || value > 100) {
      toast.error('نسبة العمولة يجب أن تكون بين 0 و 100');
      return;
    }

    try {
      setCommissionLoading(true);
      await updateCommissionRate(id, value);
      toast.success(`تم تحديث نسبة العمولة إلى ${value}% ✅`);
      fetchSeller();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تحديث العمولة');
    } finally {
      setCommissionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchSeller} />;
  if (!seller) return null;

  const status = getStatusInfo(sellerStatusMap, seller.status);

  const hasPayoutInfo =
    seller.preferredPayoutMethod ||
    seller.bankName ||
    seller.walletNumber ||
    seller.instaPayAccount;

  // ✅ إصلاح العرض - ?? بدل ||
  const displayCommission = seller.commissionRate ?? 10;

  return (
    <div>
      {/* العنوان */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin/sellers')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <FiArrowRight size={20} />
        </button>

        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">{seller.storeName}</h1>
          <p className="text-gray-500 text-sm">
            {seller.sellerName || seller.userName}
            <span className="text-gray-400 mr-2">— ID: {seller.userId || id}</span>
          </p>
        </div>

        <span className={`text-sm px-3 py-1.5 rounded-full ${status.color}`}>
          {status.icon} {status.label}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* العمود الرئيسي */}
        <div className="lg:col-span-2 space-y-6">
          {/* بيانات المتجر */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">بيانات المتجر</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">اسم المتجر</p>
                <p className="font-medium">{seller.storeName}</p>
              </div>
              <div>
                <p className="text-gray-500">اسم البائع</p>
                <p className="font-medium">{seller.sellerName || seller.userName}</p>
              </div>
              <div>
                <p className="text-gray-500">البريد</p>
                <p className="font-medium">{seller.sellerEmail || seller.email}</p>
              </div>
              <div>
                <p className="text-gray-500">البريد التجاري</p>
                <p className="font-medium">{seller.businessEmail || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">الهاتف التجاري</p>
                <p className="font-medium">{seller.businessPhone || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">العنوان</p>
                <p className="font-medium">
                  {seller.businessAddress || '—'}
                  {seller.businessCity && `, ${seller.businessCity}`}
                  {seller.businessCountry && `, ${seller.businessCountry}`}
                </p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-gray-500">الوصف</p>
                <p className="font-medium">{seller.storeDescription || '—'}</p>
              </div>
              <div>
                <p className="text-gray-500">تاريخ التسجيل</p>
                <p className="font-medium">{formatDate(seller.createdAt)}</p>
              </div>
              {seller.approvedAt && (
                <div>
                  <p className="text-gray-500">تاريخ الموافقة</p>
                  <p className="font-medium">{formatDate(seller.approvedAt)}</p>
                </div>
              )}
              {seller.rejectionReason && (
                <div className="sm:col-span-2">
                  <p className="text-gray-500">سبب الرفض</p>
                  <p className="font-medium text-red-600">{seller.rejectionReason}</p>
                </div>
              )}
            </div>
          </div>

          {/* بيانات السحب */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">💳 بيانات السحب</h2>

            {hasPayoutInfo ? (
              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-xs text-gray-500 mb-1">طريقة السحب المفضلة</p>
                  <p className="font-bold text-blue-700 text-lg">
                    {PAYOUT_METHOD_LABELS[seller.preferredPayoutMethod] ||
                      seller.preferredPayoutMethod ||
                      '—'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {(seller.bankName || seller.bankAccountNumber) && (
                    <>
                      <div>
                        <p className="text-gray-500">🏦 البنك</p>
                        <p className="font-medium">{seller.bankName || '—'}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">رقم الحساب</p>
                        <p className="font-medium font-mono tracking-wider">
                          {seller.bankAccountNumber || '—'}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-gray-500">اسم صاحب الحساب</p>
                        <p className="font-medium">{seller.bankAccountHolder || '—'}</p>
                      </div>
                    </>
                  )}

                  {seller.walletNumber && (
                    <>
                      <div>
                        <p className="text-gray-500">📱 رقم المحفظة</p>
                        <p className="font-medium font-mono tracking-wider">
                          {seller.walletNumber}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">مزود الخدمة</p>
                        <p className="font-medium">{seller.walletProvider || '—'}</p>
                      </div>
                    </>
                  )}

                  {seller.instaPayAccount && (
                    <div className="sm:col-span-2">
                      <p className="text-gray-500">🏦 حساب إنستاباي</p>
                      <p className="font-medium font-mono">{seller.instaPayAccount}</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <span className="text-4xl">🚫</span>
                <p className="text-gray-500 mt-2">البائع لم يضف بيانات السحب بعد</p>
              </div>
            )}
          </div>

          {/* الإحصائيات */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">الإحصائيات</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">المنتجات</p>
                <p className="text-xl font-bold text-blue-600">{seller.totalProducts || 0}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">المبيعات</p>
                <p className="text-xl font-bold text-green-600">
                  {formatPrice(seller.totalSales || 0)}
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">الإيرادات</p>
                <p className="text-xl font-bold text-yellow-600">
                  {formatPrice(seller.totalRevenue || 0)}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">الرصيد</p>
                <p className="text-xl font-bold text-purple-600">
                  {formatPrice(seller.balance || 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* العمود الجانبي */}
        <div className="space-y-6">
          {/* إجراءات */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">إجراءات</h2>

            <div className="space-y-3">
              {seller.status === 'Pending' && (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                  >
                    <FiCheck size={18} />
                    {actionLoading ? 'جاري...' : 'قبول البائع'}
                  </button>

                  <button
                    onClick={() => navigate('/admin/sellers')}
                    className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 font-medium"
                  >
                    <FiX size={18} />
                    رفض (من القائمة)
                  </button>
                </>
              )}

              {seller.status === 'Approved' && (
                <button
                  onClick={handleSuspend}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 bg-orange-600 text-white py-2.5 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-medium"
                >
                  <FiSlash size={18} />
                  {actionLoading ? 'جاري...' : 'إيقاف البائع'}
                </button>
              )}

              {seller.status === 'Suspended' && (
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50 font-medium"
                >
                  <FiCheck size={18} />
                  {actionLoading ? 'جاري...' : 'إعادة تفعيل'}
                </button>
              )}
            </div>
          </div>

          {/* ✅ تعديل العمولة - متعدل */}
          <div className="bg-white rounded-xl border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-1">نسبة العمولة</h2>

            {/* ✅ إصلاح العرض - ?? بدل || */}
            <p className="text-sm text-gray-500 mb-3">
              النسبة الحالية:{' '}
              <span className="font-bold text-gray-800">
                {displayCommission}%
              </span>
            </p>

            <div className="flex gap-2">
              <input
                type="number"
                value={newCommission}
                onChange={(e) => setNewCommission(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                min="0"
                max="100"
                step="0.5"
                placeholder="0 - 100"
              />

              <button
                onClick={handleUpdateCommission}
                disabled={commissionLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
              >
                {commissionLoading ? '...' : 'تحديث'}
              </button>
            </div>

            {/* ✅ جديد - تلميح */}
            <p className="text-xs text-gray-400 mt-2">
              يمكن إدخال 0 لإلغاء العمولة على هذا البائع
            </p>
          </div>

          {/* التقييم */}
          <div className="bg-white rounded-xl border p-6 text-center">
            <p className="text-sm text-gray-500 mb-1">التقييم</p>
            <p className="text-2xl font-bold text-yellow-500">⭐ {seller.rating || 0}</p>
            <p className="text-xs text-gray-400">{seller.totalRatings || 0} تقييم</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSellerDetailsPage;