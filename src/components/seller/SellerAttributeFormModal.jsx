import { useState } from 'react';
import { FiPlus, FiX } from 'react-icons/fi';
import Modal from '../common/Modal';
import Input from '../common/Input';
import sellerAttributeService from '../../api/seller/sellerAttributeService';
import toast from 'react-hot-toast';

const SellerAttributeFormModal = ({ isOpen, onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    displayOrder: 0,
    values: [''],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleValueChange = (index, value) => {
    setFormData((prev) => {
      const values = [...prev.values];
      values[index] = value;
      return { ...prev, values };
    });
  };

  const addValue = () => {
    setFormData((prev) => ({ ...prev, values: [...prev.values, ''] }));
  };

  const removeValue = (index) => {
    setFormData((prev) => {
      const values = prev.values.filter((_, i) => i !== index);
      return { ...prev, values: values.length === 0 ? [''] : values };
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'اسم الخاصية مطلوب';
    const nonEmpty = formData.values.filter((v) => v.trim());
    if (nonEmpty.length === 0) newErrors.values = 'يجب إضافة قيمة واحدة على الأقل';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      name: formData.name.trim(),
      displayOrder: Number(formData.displayOrder) || 0,
      values: formData.values.filter((v) => v.trim()).map((v) => ({ value: v.trim() })),
    };
    try {
      setLoading(true);
      const result = await sellerAttributeService.createAttribute(payload);
      toast.success('تم إضافة الخاصية بنجاح');
      setFormData({ name: '', displayOrder: 0, values: [''] });
      if (onCreated) onCreated(result);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'حدث خطأ');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ name: '', displayOrder: 0, values: [''] });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="➕ إضافة خاصية جديدة" size="md">
      <div className="space-y-4">
        <Input
          label="اسم الخاصية *"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="مثال: اللون، السعة، المقاس"
          error={errors.name}
        />
        <Input
          label="ترتيب العرض"
          name="displayOrder"
          type="number"
          value={formData.displayOrder}
          onChange={handleChange}
          placeholder="0"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            القيم *
          </label>
          <div className="space-y-2">
            {formData.values.map((val, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={val}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  placeholder={`القيمة ${index + 1}`}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-blue-500"
                />
                {formData.values.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeValue(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addValue}
            className="mt-2 flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
          >
            <FiPlus size={14} /> إضافة قيمة
          </button>
          {errors.values && <p className="mt-1 text-sm text-red-500">{errors.values}</p>}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ الخاصية'}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2.5 border rounded-lg text-gray-600 hover:bg-gray-50 text-sm"
          >
            إلغاء
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default SellerAttributeFormModal;
