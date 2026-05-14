import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiAlertTriangle } from 'react-icons/fi';
import {
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from '../../api/seller/sellerPaymentMethodService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { PAYMENT_METHODS } from '../../utils/constants';
import toast from 'react-hot-toast';

const SELLER_PAYMENT_METHODS = PAYMENT_METHODS.filter((pm) => pm.value !== 'CashOnDelivery');

const defaultFormData = {
  paymentMethod: '',
  accountIdentifier: '',
  accountHolderName: '',
  bankName: '',
};

const SellerPaymentMethodsPage = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [formErrors, setFormErrors] = useState({});

  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchMethods();
  }, []);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPaymentMethods();
      setMethods(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل طرق الدفع');
    } finally {
      setLoading(false);
    }
  };

  const getMethodLabel = (value) => {
    const m = PAYMENT_METHODS.find((pm) => pm.value === value);
    return m ? m.label : value;
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData(defaultFormData);
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (method) => {
    setEditingId(method.id);
    setFormData({
      paymentMethod: method.paymentMethod || '',
      accountIdentifier: method.accountIdentifier || method.phone || '',
      accountHolderName: method.accountHolderName || '',
      bankName: method.bankName || '',
    });
    setFormErrors({});
    setShowModal(true);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) setFormErrors((prev) => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const errors = {};
    if (!formData.paymentMethod) errors.paymentMethod = 'اختر طريقة الدفع';
    if (!formData.accountIdentifier?.trim()) errors.accountIdentifier = 'رقم الحساب / المحفظة مطلوب';
    if (formData.paymentMethod === 'BankTransfer' && !formData.accountHolderName?.trim())
      errors.accountHolderName = 'اسم صاحب الحساب مطلوب';
    if (formData.paymentMethod === 'BankTransfer' && !formData.bankName?.trim())
      errors.bankName = 'اسم البنك مطلوب';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      setActionLoading(true);
      const payload = {
        paymentMethod: formData.paymentMethod,
        accountIdentifier: formData.accountIdentifier.trim(),
        accountHolderName: formData.accountHolderName.trim() || null,
        bankName: formData.bankName.trim() || null,
      };

      if (editingId) {
        await updatePaymentMethod(editingId, payload);
        toast.success('تم تحديث طريقة الدفع');
      } else {
        await createPaymentMethod(payload);
        toast.success('تم إضافة طريقة الدفع');
      }

      setShowModal(false);
      fetchMethods();
    } catch (err) {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء الحفظ');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setActionLoading(true);
      await deletePaymentMethod(id);
      toast.success('تم حذف طريقة الدفع');
      setDeleteConfirm(null);
      fetchMethods();
    } catch (err) {
      toast.error(err.response?.data?.message || 'حدث خطأ أثناء الحذف');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchMethods} />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">طرق الدفع الخاصة بي</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            أضف حسابات الدفع التي تريد استقبال الأموال عليها
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-green-600 text-white px-4 py-2.5 rounded-xl hover:bg-green-700 text-sm font-semibold transition-colors shadow-sm"
        >
          <FiPlus size={16} />
          إضافة طريقة دفع
        </button>
      </div>

      {methods.length === 0 ? (
        <div className="bg-white rounded-2xl border shadow-sm p-12 text-center">
          <div className="text-5xl mb-4">💳</div>
          <p className="text-gray-500 text-lg font-medium mb-2">لا توجد طرق دفع مضافة</p>
          <p className="text-gray-400 text-sm mb-6">
            أضف طرق الدفع التي تريد استقبال الأموال عليها من العملاء
          </p>
          <button
            onClick={openAddModal}
            className="bg-green-600 text-white px-6 py-2.5 rounded-xl hover:bg-green-700 text-sm font-semibold transition-colors"
          >
            + إضافة طريقة دفع
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-right px-5 py-3.5 text-gray-600 font-semibold">طريقة الدفع</th>
                  <th className="text-right px-5 py-3.5 text-gray-600 font-semibold">رقم الحساب / المحفظة</th>
                  <th className="text-right px-5 py-3.5 text-gray-600 font-semibold">صاحب الحساب</th>
                  <th className="text-right px-5 py-3.5 text-gray-600 font-semibold">البنك</th>
                  <th className="text-center px-5 py-3.5 text-gray-600 font-semibold">حالة</th>
                  <th className="text-left px-5 py-3.5 text-gray-600 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {methods.map((method) => (
                  <tr key={method.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-medium text-gray-800">
                        {getMethodLabel(method.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600 font-mono" dir="ltr">
                      {method.accountIdentifier || method.phone || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {method.accountHolderName || '—'}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {method.bankName || '—'}
                    </td>
                    <td className="px-5 py-4 text-center">
                      {method.isActive !== false ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-semibold">
                          <FiCheck size={12} /> نشط
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full font-semibold">
                          <FiX size={12} /> غير نشط
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-start">
                        <button
                          onClick={() => openEditModal(method)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="تعديل"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(method.id)}
                          disabled={actionLoading}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
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
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-gray-800">
                {editingId ? 'تعديل طريقة دفع' : 'إضافة طريقة دفع'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  طريقة الدفع <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => handleChange('paymentMethod', e.target.value)}
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all ${
                    formErrors.paymentMethod ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <option value="">-- اختر طريقة الدفع --</option>
                  {SELLER_PAYMENT_METHODS.map((pm) => (
                    <option key={pm.value} value={pm.value}>
                      {pm.label}
                    </option>
                  ))}
                </select>
                {formErrors.paymentMethod && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.paymentMethod}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {formData.paymentMethod === 'BankTransfer'
                    ? 'رقم الحساب البنكي'
                    : 'رقم المحفظة / الهاتف'}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.accountIdentifier}
                  onChange={(e) => handleChange('accountIdentifier', e.target.value)}
                  placeholder={
                    formData.paymentMethod === 'BankTransfer'
                      ? 'مثال: 1234567890123456'
                      : 'مثال: 01012345678'
                  }
                  className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all ${
                    formErrors.accountIdentifier ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                  }`}
                />
                {formErrors.accountIdentifier && (
                  <p className="mt-1 text-xs text-red-500">{formErrors.accountIdentifier}</p>
                )}
              </div>

              {formData.paymentMethod === 'BankTransfer' && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      اسم صاحب الحساب <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.accountHolderName}
                      onChange={(e) => handleChange('accountHolderName', e.target.value)}
                      placeholder="مثال: محمد أحمد"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all ${
                        formErrors.accountHolderName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                    {formErrors.accountHolderName && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.accountHolderName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      اسم البنك <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleChange('bankName', e.target.value)}
                      placeholder="مثال: البنك الأهلي المصري"
                      className={`w-full px-4 py-2.5 border rounded-xl text-sm outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all ${
                        formErrors.bankName ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                    {formErrors.bankName && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.bankName}</p>
                    )}
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-3 p-5 border-t">
              <button
                onClick={handleSubmit}
                disabled={actionLoading}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 font-semibold text-sm transition-colors"
              >
                {actionLoading
                  ? 'جاري الحفظ...'
                  : editingId
                  ? '💾 حفظ التعديلات'
                  : '✅ إضافة'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold text-sm transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <FiAlertTriangle size={28} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-800 mb-2">حذف طريقة الدفع</h2>
            <p className="text-sm text-gray-500 mb-6">
              هل أنت متأكد من حذف طريقة الدفع هذه؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                disabled={actionLoading}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 disabled:opacity-50 font-semibold text-sm transition-colors"
              >
                {actionLoading ? 'جاري الحذف...' : 'حذف'}
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={actionLoading}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold text-sm transition-colors"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerPaymentMethodsPage;
