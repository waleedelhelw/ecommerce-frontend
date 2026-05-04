import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import adminInstallmentService from '../../api/admin/adminInstallmentService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const AdminInstallmentPlansPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deletingPlanId, setDeletingPlanId] = useState(null);

  // Overdue
  const [overdueInstallments, setOverdueInstallments] = useState([]);
  const [showOverdue, setShowOverdue] = useState(false);
  const [overdueLoading, setOverdueLoading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    description: '',
    numberOfInstallments: 2,
    extraFeePercentage: 0,
    splits: [
      { splitOrder: 1, percentage: 50, dueTrigger: 'BeforeShipping', dueDaysAfterDelivery: 0 },
      { splitOrder: 2, percentage: 50, dueTrigger: 'OnDelivery', dueDaysAfterDelivery: 0 },
    ],
  });
  const [formErrors, setFormErrors] = useState({});

  // ═══════════════════════════════════════
  // جلب البيانات
  // ═══════════════════════════════════════
  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await adminInstallmentService.getAllPlans();
      setPlans(data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'فشل في تحميل خطط التقسيط');
    } finally {
      setLoading(false);
    }
  };

  const fetchOverdue = async () => {
    try {
      setOverdueLoading(true);
      const data = await adminInstallmentService.getOverdueInstallments();
      setOverdueInstallments(data || []);
    } catch (err) {
      console.error('Failed to fetch overdue:', err);
      toast.error('فشل في تحميل الدفعات المتأخرة');
    } finally {
      setOverdueLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  // ═══════════════════════════════════════
  // إدارة الفورم
  // ═══════════════════════════════════════
  const resetForm = () => {
    setForm({
      name: '',
      description: '',
      numberOfInstallments: 2,
      extraFeePercentage: 0,
      splits: [
        { splitOrder: 1, percentage: 50, dueTrigger: 'BeforeShipping', dueDaysAfterDelivery: 0 },
        { splitOrder: 2, percentage: 50, dueTrigger: 'OnDelivery', dueDaysAfterDelivery: 0 },
      ],
    });
    setFormErrors({});
    setEditingPlan(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowFormModal(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setForm({
      name: plan.name || '',
      description: plan.description || '',
      numberOfInstallments: plan.numberOfInstallments || 2,
      extraFeePercentage: plan.extraFeePercentage || 0,
      splits: plan.splits && plan.splits.length > 0
        ? plan.splits.map(s => ({
            splitOrder: s.splitOrder,
            percentage: s.percentage,
            dueTrigger: s.dueTrigger || 'BeforeShipping',
            dueDaysAfterDelivery: s.dueDaysAfterDelivery || 0,
          }))
        : generateDefaultSplits(plan.numberOfInstallments || 2),
    });
    setFormErrors({});
    setShowFormModal(true);
  };

  // توليد تقسيمات افتراضية
  const generateDefaultSplits = (count) => {
    const percentage = Math.floor(100 / count);
    const remainder = 100 - percentage * count;
    const triggers = ['BeforeShipping', 'OnDelivery', 'DaysAfterDelivery'];

    return Array.from({ length: count }, (_, i) => ({
      splitOrder: i + 1,
      percentage: i === 0 ? percentage + remainder : percentage,
      dueTrigger: triggers[i] || 'DaysAfterDelivery',
      dueDaysAfterDelivery: i >= 2 ? 7 * (i - 1) : 0,
    }));
  };

  // عند تغيير عدد الدفعات
  const handleInstallmentCountChange = (count) => {
    const num = parseInt(count) || 2;
    if (num < 2 || num > 4) return;

    setForm(prev => ({
      ...prev,
      numberOfInstallments: num,
      splits: generateDefaultSplits(num),
    }));
  };

  // تعديل split
  const updateSplit = (index, field, value) => {
    setForm(prev => {
      const newSplits = [...prev.splits];
      newSplits[index] = { ...newSplits[index], [field]: value };
      return { ...prev, splits: newSplits };
    });
  };

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!form.name.trim()) errors.name = 'اسم الخطة مطلوب';
    if (form.numberOfInstallments < 2) errors.numberOfInstallments = 'الحد الأدنى 2 دفعات';
    if (form.extraFeePercentage < 0) errors.extraFeePercentage = 'النسبة لا يمكن أن تكون سالبة';

    // التحقق من مجموع النسب
    const totalPercentage = form.splits.reduce((sum, s) => sum + (parseFloat(s.percentage) || 0), 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      errors.splits = `مجموع النسب يجب أن يكون 100% (الحالي: ${totalPercentage}%)`;
    }

    // التحقق من كل split
    form.splits.forEach((split, index) => {
      if (!split.percentage || split.percentage <= 0) {
        errors[`split_${index}`] = 'النسبة يجب أن تكون أكبر من 0';
      }
      if (split.dueTrigger === 'DaysAfterDelivery' && (!split.dueDaysAfterDelivery || split.dueDaysAfterDelivery < 1)) {
        errors[`split_days_${index}`] = 'عدد الأيام مطلوب';
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ═══════════════════════════════════════
  // العمليات
  // ═══════════════════════════════════════
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setActionLoading(true);

      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        numberOfInstallments: form.numberOfInstallments,
        extraFeePercentage: parseFloat(form.extraFeePercentage) || 0,
        splits: form.splits.map(s => ({
          splitOrder: s.splitOrder,
          percentage: parseFloat(s.percentage),
          dueTrigger: s.dueTrigger,
          dueDaysAfterDelivery: s.dueTrigger === 'DaysAfterDelivery' ? parseInt(s.dueDaysAfterDelivery) || 0 : 0,
        })),
      };

      if (editingPlan) {
        await adminInstallmentService.updatePlan(editingPlan.id, payload);
        toast.success('تم تحديث الخطة بنجاح ✅');
      } else {
        await adminInstallmentService.createPlan(payload);
        toast.success('تم إنشاء الخطة بنجاح ✅');
      }

      setShowFormModal(false);
      resetForm();
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل حفظ الخطة');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle = async (planId) => {
    try {
      setActionLoading(true);
      await adminInstallmentService.togglePlan(planId);
      toast.success('تم تحديث حالة الخطة');
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل تحديث الحالة');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingPlanId) return;
    try {
      setActionLoading(true);
      await adminInstallmentService.deletePlan(deletingPlanId);
      toast.success('تم حذف الخطة بنجاح');
      setShowDeleteDialog(false);
      setDeletingPlanId(null);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل حذف الخطة');
    } finally {
      setActionLoading(false);
    }
  };

  // ═══════════════════════════════════════
  // Helper: عرض موعد الاستحقاق
  // ═══════════════════════════════════════
  const getDueTriggerLabel = (trigger, days) => {
    switch (trigger) {
      case 'BeforeShipping': return '📦 قبل الشحن';
      case 'OnDelivery': return '🚚 عند الاستلام';
      case 'DaysAfterDelivery': return `⏰ بعد ${days} يوم من الاستلام`;
      default: return trigger;
    }
  };

  // ═══════════════════════════════════════
  // Render
  // ═══════════════════════════════════════
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchPlans} />;

  return (
    <div>
      {/* العنوان */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">📋 خطط التقسيط</h1>
          <p className="text-gray-500 text-sm mt-1">إنشاء وإدارة خطط التقسيط للعملاء</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setShowOverdue(!showOverdue);
              if (!showOverdue && overdueInstallments.length === 0) fetchOverdue();
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-700 border border-red-200 rounded-lg hover:bg-red-100 text-sm font-medium transition-colors"
          >
            🚨 الدفعات المتأخرة
          </button>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            <FiPlus size={18} />
            خطة جديدة
          </button>
        </div>
      </div>

      {/* 🚨 قسم الدفعات المتأخرة */}
      {showOverdue && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-5 mb-6">
          <h2 className="text-lg font-bold text-red-800 mb-4">🚨 الدفعات المتأخرة</h2>
          {overdueLoading ? (
            <div className="text-center py-4">
              <div className="animate-spin w-6 h-6 border-3 border-red-500 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : overdueInstallments.length === 0 ? (
            <p className="text-center text-red-600 py-4">✅ لا توجد دفعات متأخرة حالياً</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-red-200">
                    <th className="text-right py-2 px-3 font-medium text-red-700">الطلب</th>
                    <th className="text-right py-2 px-3 font-medium text-red-700">الدفعة</th>
                    <th className="text-right py-2 px-3 font-medium text-red-700">المبلغ</th>
                    <th className="text-right py-2 px-3 font-medium text-red-700">تاريخ الاستحقاق</th>
                    <th className="text-right py-2 px-3 font-medium text-red-700">العميل</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueInstallments.map((item, index) => (
                    <tr key={item.id || index} className="border-b border-red-100">
                      <td className="py-2 px-3">
                        <button
                          onClick={() => window.open(`/admin/orders/${item.orderId}`, '_blank')}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          #{item.orderId}
                        </button>
                      </td>
                      <td className="py-2 px-3">الدفعة {item.installmentNumber}</td>
                      <td className="py-2 px-3 font-bold text-red-700">
                        {item.amount?.toLocaleString('ar-EG')} ج.م
                      </td>
                      <td className="py-2 px-3 text-red-600">{formatDate(item.dueDate)}</td>
                      <td className="py-2 px-3">{item.customerName || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* قائمة الخطط */}
      {plans.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <span className="text-5xl block mb-4">📋</span>
          <h3 className="text-xl font-bold text-gray-700 mb-2">لا توجد خطط تقسيط</h3>
          <p className="text-gray-500 mb-6">أنشئ أول خطة تقسيط للعملاء</p>
          <button
            onClick={openCreateModal}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 font-medium"
          >
            <FiPlus size={18} className="inline ml-2" />
            إنشاء خطة جديدة
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-xl border-2 p-6 transition-all ${
                plan.isActive ? 'border-blue-200 hover:border-blue-400' : 'border-gray-200 opacity-70'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg">{plan.name}</h3>
                  {plan.description && (
                    <p className="text-sm text-gray-500 mt-1">{plan.description}</p>
                  )}
                </div>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    plan.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {plan.isActive ? '✅ نشطة' : '⏸️ معطلة'}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">عدد الدفعات:</span>
                  <span className="font-bold text-blue-600">{plan.numberOfInstallments}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">رسوم إضافية:</span>
                  <span className={`font-medium ${plan.extraFeePercentage > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                    {plan.extraFeePercentage > 0 ? `${plan.extraFeePercentage}%` : 'بدون رسوم'}
                  </span>
                </div>
              </div>

              {/* Splits */}
              {plan.splits && plan.splits.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs font-bold text-gray-600 mb-2">التقسيمات:</p>
                  {plan.splits
                    .sort((a, b) => a.splitOrder - b.splitOrder)
                    .map((split) => (
                      <div key={split.id || split.splitOrder} className="flex justify-between text-xs py-1 border-b border-gray-100 last:border-0">
                        <span>
                          {split.splitOrder === 1 ? '🔵' : split.splitOrder === 2 ? '🟡' : '🟢'} الدفعة {split.splitOrder}
                        </span>
                        <span className="font-medium">{split.percentage}%</span>
                        <span className="text-gray-500">{getDueTriggerLabel(split.dueTrigger, split.dueDaysAfterDelivery)}</span>
                      </div>
                    ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t">
                <button
                  onClick={() => handleToggle(plan.id)}
                  disabled={actionLoading}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    plan.isActive
                      ? 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                  title={plan.isActive ? 'تعطيل' : 'تفعيل'}
                >
                  {plan.isActive ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                  {plan.isActive ? 'تعطيل' : 'تفعيل'}
                </button>

                <button
                  onClick={() => openEditModal(plan)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-xs font-medium transition-colors"
                >
                  <FiEdit2 size={14} />
                  تعديل
                </button>

                <button
                  onClick={() => {
                    setDeletingPlanId(plan.id);
                    setShowDeleteDialog(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-xs font-medium transition-colors"
                >
                  <FiTrash2 size={14} />
                  حذف
                </button>
              </div>

              {/* Created At */}
              {plan.createdAt && (
                <p className="text-xs text-gray-400 mt-3">
                  أُنشئت: {formatDate(plan.createdAt)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════ */}
      {/* Modal إنشاء / تعديل خطة */}
      {/* ═══════════════════════════════════════ */}
      {showFormModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-2xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold">
                {editingPlan ? '✏️ تعديل الخطة' : '➕ خطة تقسيط جديدة'}
              </h2>
              <button
                onClick={() => {
                  setShowFormModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* الاسم والوصف */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم الخطة *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="مثلاً: دفعتين - 50/50"
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                      formErrors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    عدد الدفعات *
                  </label>
                  <select
                    value={form.numberOfInstallments}
                    onChange={(e) => handleInstallmentCountChange(e.target.value)}
                    className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={2}>2 دفعات</option>
                    <option value={3}>3 دفعات</option>
                    <option value={4}>4 دفعات</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوصف (اختياري)
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="وصف مختصر للخطة..."
                  className="w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  رسوم إضافية (%)
                </label>
                <input
                  type="number"
                  value={form.extraFeePercentage}
                  onChange={(e) => setForm(prev => ({ ...prev, extraFeePercentage: e.target.value }))}
                  placeholder="0"
                  min="0"
                  max="50"
                  step="0.5"
                  className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                    formErrors.extraFeePercentage ? 'border-red-500' : ''
                  }`}
                />
                <p className="text-xs text-gray-400 mt-1">
                  نسبة مئوية تُضاف على إجمالي الطلب (0 = بدون رسوم)
                </p>
              </div>

              {/* التقسيمات */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-gray-700">📊 التقسيمات</label>
                  {formErrors.splits && (
                    <span className="text-xs text-red-500 font-medium">{formErrors.splits}</span>
                  )}
                </div>

                <div className="space-y-3">
                  {form.splits.map((split, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 border rounded-lg p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-lg">
                          {index === 0 ? '🔵' : index === 1 ? '🟡' : index === 2 ? '🟢' : '🟣'}
                        </span>
                        <span className="font-bold text-gray-700">الدفعة {split.splitOrder}</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* النسبة */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">النسبة (%)</label>
                          <input
                            type="number"
                            value={split.percentage}
                            onChange={(e) => updateSplit(index, 'percentage', parseFloat(e.target.value) || 0)}
                            min="1"
                            max="100"
                            className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                              formErrors[`split_${index}`] ? 'border-red-500' : ''
                            }`}
                          />
                          {formErrors[`split_${index}`] && (
                            <p className="text-xs text-red-500 mt-1">{formErrors[`split_${index}`]}</p>
                          )}
                        </div>

                        {/* موعد الاستحقاق */}
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">موعد الاستحقاق</label>
                          <select
                            value={split.dueTrigger}
                            onChange={(e) => updateSplit(index, 'dueTrigger', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="BeforeShipping">📦 قبل الشحن</option>
                            <option value="OnDelivery">🚚 عند الاستلام</option>
                            <option value="DaysAfterDelivery">⏰ بعد الاستلام بأيام</option>
                          </select>
                        </div>

                        {/* عدد الأيام (لو DaysAfterDelivery) */}
                        {split.dueTrigger === 'DaysAfterDelivery' && (
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">بعد كام يوم؟</label>
                            <input
                              type="number"
                              value={split.dueDaysAfterDelivery}
                              onChange={(e) => updateSplit(index, 'dueDaysAfterDelivery', parseInt(e.target.value) || 0)}
                              min="1"
                              max="90"
                              className={`w-full px-3 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 ${
                                formErrors[`split_days_${index}`] ? 'border-red-500' : ''
                              }`}
                            />
                            {formErrors[`split_days_${index}`] && (
                              <p className="text-xs text-red-500 mt-1">{formErrors[`split_days_${index}`]}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* عرض المجموع */}
                <div className={`mt-3 p-3 rounded-lg text-sm font-medium ${
                  Math.abs(form.splits.reduce((s, sp) => s + (parseFloat(sp.percentage) || 0), 0) - 100) < 0.01
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  مجموع النسب: {form.splits.reduce((s, sp) => s + (parseFloat(sp.percentage) || 0), 0)}%
                  {Math.abs(form.splits.reduce((s, sp) => s + (parseFloat(sp.percentage) || 0), 0) - 100) < 0.01
                    ? ' ✅'
                    : ' ❌ (يجب أن يكون 100%)'}
                </div>
              </div>

              {/* أزرار */}
              <div className="flex gap-3 pt-4 border-t">
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium transition-colors"
                >
                  {actionLoading
                    ? 'جاري الحفظ...'
                    : editingPlan
                    ? '✅ تحديث الخطة'
                    : '✅ إنشاء الخطة'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowFormModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dialog حذف */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
          setDeletingPlanId(null);
        }}
        onConfirm={handleDelete}
        title="حذف خطة التقسيط"
        message="هل أنت متأكد من حذف هذه الخطة؟ لن يتم حذفها إذا كانت مرتبطة بطلبات نشطة."
        confirmText={actionLoading ? 'جاري الحذف...' : '🗑️ نعم، احذفها'}
        danger
      />
    </div>
  );
};

export default AdminInstallmentPlansPage;