import { useState } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';
import { uploadImage } from '../../utils/cloudinary';
import toast from 'react-hot-toast';

const SingleImageUploader = ({ imageUrl, onChange, error }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ تحقق من النوع
    if (!file.type.startsWith('image/')) {
      toast.error('الملف لازم يكون صورة');
      return;
    }

    // ✅ تحقق من الحجم (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('حجم الصورة لازم يكون أقل من 5MB');
      return;
    }

    try {
      setUploading(true);
      const url = await uploadImage(file);
      onChange(url);
      toast.success('تم رفع الصورة بنجاح');
    } catch (error) {
      toast.error('فشل في رفع الصورة');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = () => {
    onChange('');
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        صورة المنتج *
      </label>

      {/* ✅ لو فيه صورة - اعرضها */}
      {imageUrl ? (
        <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 
          border-gray-200 group">
          <img
            src={imageUrl}
            alt="صورة المنتج"
            width={192}
            height={192}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/placeholder-product.png';
            }}
          />
          {/* ✅ زرار الحذف */}
          <div className="absolute inset-0 bg-black/50 opacity-0 
            group-hover:opacity-100 transition-opacity flex items-center 
            justify-center gap-2">
            <button
              type="button"
              onClick={removeImage}
              className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              title="حذف الصورة"
            >
              <FiX size={18} />
            </button>
            {/* ✅ زرار تغيير الصورة */}
            <label className="p-2 bg-blue-500 text-white rounded-lg 
              hover:bg-blue-600 cursor-pointer"
              title="تغيير الصورة"
            >
              <FiUpload size={18} />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>
      ) : (
        /* ✅ لو مفيش صورة - اعرض زرار الرفع */
        <label className={`flex flex-col items-center justify-center w-48 h-48 
          border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${uploading
            ? 'border-blue-300 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 
                border-blue-500 mb-2" />
              <span className="text-sm text-blue-500">جاري الرفع...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <FiUpload className="text-gray-400 mb-2" size={24} />
              <span className="text-sm text-gray-500">اضغط لرفع صورة</span>
              <span className="text-xs text-gray-400 mt-1">
                PNG, JPG, WEBP (أقصى 5MB)
              </span>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </label>
      )}

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default SingleImageUploader;