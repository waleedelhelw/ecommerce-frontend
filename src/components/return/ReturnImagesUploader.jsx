import { useState } from 'react';
import { FiUpload, FiX, FiImage } from 'react-icons/fi';
import { uploadImage } from '../../utils/cloudinary';
import toast from 'react-hot-toast';

const MAX_IMAGES = 5;
const MIN_IMAGES = 1;

const ReturnImagesUploader = ({ images = [], onChange, error }) => {
  const [uploading, setUploading] = useState(false);

  const handleFilesSelect = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    // التحقق من العدد الإجمالى
    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`الحد الأقصى ${MAX_IMAGES} صور`);
      return;
    }

    // التحقق من كل ملف
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error(`الملف ${file.name} مش صورة`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`الصورة ${file.name} أكبر من 5MB`);
        return;
      }
    }

    try {
      setUploading(true);
      const uploadPromises = files.map((file) => uploadImage(file));
      const urls = await Promise.all(uploadPromises);

      const newImages = urls.map((url) => ({
        imageUrl: url,
        publicId: extractPublicId(url),
        altText: 'صورة إرجاع',
      }));

      onChange([...images, ...newImages]);
      toast.success(`تم رفع ${urls.length} صورة بنجاح`);
    } catch (err) {
      toast.error('فشل فى رفع الصور');
      console.error(err);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
  };

  // استخراج Public ID من URL Cloudinary
  const extractPublicId = (url) => {
    try {
      const parts = url.split('/');
      const fileWithExt = parts[parts.length - 1];
      const fileName = fileWithExt.split('.')[0];
      const folder = parts[parts.length - 2];
      return `${folder}/${fileName}`;
    } catch {
      return null;
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        صور المنتج <span className="text-red-500">*</span>
        <span className="text-xs text-gray-500 mr-2">
          (إجبارى - من {MIN_IMAGES} إلى {MAX_IMAGES} صور)
        </span>
      </label>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {/* الصور المرفوعة */}
        {images.map((img, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden border-2 border-gray-200 group"
          >
            <img
              src={img.imageUrl}
              alt={img.altText || `صورة ${index + 1}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                title="حذف"
              >
                <FiX size={18} />
              </button>
            </div>
            <div className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
              {index + 1}
            </div>
          </div>
        ))}

        {/* زرار رفع صور جديدة */}
        {images.length < MAX_IMAGES && (
          <label
            className={`aspect-square flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              uploading
                ? 'border-blue-300 bg-blue-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
            }`}
          >
            {uploading ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mb-2" />
                <span className="text-xs text-blue-500">جارى الرفع...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-500">
                <FiUpload size={20} className="mb-1" />
                <span className="text-xs">اضغط للرفع</span>
                <span className="text-[10px] text-gray-400 mt-1">
                  {images.length}/{MAX_IMAGES}
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleFilesSelect}
              className="hidden"
              disabled={uploading || images.length >= MAX_IMAGES}
            />
          </label>
        )}
      </div>

      {/* تنبيهات */}
      <div className="mt-3 space-y-1">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <FiImage size={12} />
          PNG, JPG, WEBP - حجم كل صورة لا يزيد عن 5MB
        </p>
        {images.length === 0 && (
          <p className="text-xs text-orange-600">
            ⚠️ يجب رفع صورة واحدة على الأقل توضح حالة المنتج
          </p>
        )}
        {images.length > 0 && images.length < MIN_IMAGES && (
          <p className="text-xs text-red-500">
            يجب رفع {MIN_IMAGES} صور على الأقل
          </p>
        )}
        {images.length >= MIN_IMAGES && (
          <p className="text-xs text-green-600">
            ✅ تم رفع {images.length} صور
          </p>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ReturnImagesUploader;