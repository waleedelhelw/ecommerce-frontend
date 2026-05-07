import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiMaximize2, FiX } from 'react-icons/fi';

const ProductImageGallery = ({ imageUrl, productName, images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // ترتيب الصور - الرئيسية أولاً
  const allImages = [];

  // لو فيه مصفوفة صور
  if (images && images.length > 0) {
    const sorted = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
    sorted.forEach((img, idx) => {
      allImages.push({
        url: img.imageUrl,
        // ✅ Alt Text وصفي
        alt: img.altText || `${productName} - صورة ${idx + 1}`,
        isMain: img.isMain,
      });
    });
  }

  // لو مفيش صور أو فيه imageUrl أساسي ومش موجود في المصفوفة
  if (allImages.length === 0 && imageUrl) {
    allImages.push({
      url: imageUrl,
      alt: `${productName} - الصورة الرئيسية`,
      isMain: true,
    });
  }

  // لو مفيش أي صور خالص
  if (allImages.length === 0) {
    allImages.push({
      url: '/placeholder-product.png',
      alt: `صورة ${productName}`,
      isMain: true,
    });
  }

  const currentImage = allImages[selectedIndex] || allImages[0];
  const hasMultipleImages = allImages.length > 1;

  const goToPrevious = () => {
    setImgError(false);
    setSelectedIndex((current) => (current === 0 ? allImages.length - 1 : current - 1));
  };

  const goToNext = () => {
    setImgError(false);
    setSelectedIndex((current) => (current === allImages.length - 1 ? 0 : current + 1));
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
      {/* الصورة الرئيسية */}
      <div className="relative bg-gray-50">
        <div
          className="aspect-square sm:aspect-[4/5] lg:aspect-square max-h-[72vh] flex items-center justify-center p-3 sm:p-5"
          role="img"
          aria-label={currentImage.alt}
        >
          <img
            src={imgError ? '/placeholder-product.png' : currentImage.url}
            alt={currentImage.alt}
            className="w-full h-full object-contain"
            loading="eager"
            onError={(e) => {
              e.target.onerror = null;
              setImgError(true);
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="absolute top-3 left-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/95 text-gray-700 shadow-sm border hover:bg-gray-50 transition-colors"
          aria-label="تكبير صورة المنتج"
          title="تكبير الصورة"
        >
          <FiMaximize2 size={18} aria-hidden="true" />
        </button>

        {hasMultipleImages && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              className="absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/95 text-gray-800 shadow-sm border hover:bg-gray-50 transition-colors"
              aria-label="الصورة السابقة"
              title="الصورة السابقة"
            >
              <FiChevronRight size={22} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute left-3 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/95 text-gray-800 shadow-sm border hover:bg-gray-50 transition-colors"
              aria-label="الصورة التالية"
              title="الصورة التالية"
            >
              <FiChevronLeft size={22} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 p-3 sm:p-6 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 left-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors"
            aria-label="إغلاق الصورة"
            title="إغلاق"
          >
            <FiX size={22} aria-hidden="true" />
          </button>

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="الصورة السابقة"
                title="الصورة السابقة"
              >
                <FiChevronRight size={24} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors"
                aria-label="الصورة التالية"
                title="الصورة التالية"
              >
                <FiChevronLeft size={24} aria-hidden="true" />
              </button>
            </>
          )}

        <img
          src={imgError ? '/placeholder-product.png' : currentImage.url}
          alt={currentImage.alt}
          className="max-w-full max-h-full object-contain"
          loading="eager"
          onError={(e) => {
            e.target.onerror = null;
            setImgError(true);
          }}
        />
        </div>
      )}

      {/* الصور الصغيرة (Thumbnails) */}
      {hasMultipleImages && (
        <div className="p-3 border-t">
          <div
            className="flex gap-2 overflow-x-auto pb-1"
            role="list"
            aria-label="معرض صور المنتج"
          >
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                  setImgError(false);
                }}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors
                  ${selectedIndex === index
                    ? 'border-blue-500'
                    : 'border-gray-200 hover:border-gray-400'
                  }`}
                aria-label={`عرض ${img.alt}`}
                aria-current={selectedIndex === index ? 'true' : 'false'}
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  loading="lazy"
                  className="w-full h-full object-contain bg-gray-50"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-product.png';
                  }}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
