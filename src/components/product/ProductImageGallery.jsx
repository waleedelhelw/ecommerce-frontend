import { useState, useRef, useCallback } from 'react';
import { FiMaximize2, FiX } from 'react-icons/fi';
import { getOptimizedImage } from '../../utils/cloudinary';

const ProductImageGallery = ({ imageUrl, productName, images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const SWIPE_THRESHOLD = 50;

  const allImages = [];

  if (images && images.length > 0) {
    const sorted = [...images].sort((a, b) => a.displayOrder - b.displayOrder);
    sorted.forEach((img, idx) => {
      allImages.push({
        url: img.imageUrl,
        alt: img.altText || `${productName} - صورة ${idx + 1}`,
        isMain: img.isMain,
      });
    });
  }

  if (allImages.length === 0 && imageUrl) {
    allImages.push({
      url: imageUrl,
      alt: `${productName} - الصورة الرئيسية`,
      isMain: true,
    });
  }

  if (allImages.length === 0) {
    allImages.push({
      url: '/placeholder-product.png',
      alt: `صورة ${productName}`,
      isMain: true,
    });
  }

  const currentImage = allImages[selectedIndex] || allImages[0];
  const hasMultipleImages = allImages.length > 1;

  const goToPrevious = useCallback(() => {
    setImgError(false);
    setImgLoaded(false);
    setSelectedIndex((current) => (current === 0 ? allImages.length - 1 : current - 1));
  }, [allImages.length]);

  const goToNext = useCallback(() => {
    setImgError(false);
    setImgLoaded(false);
    setSelectedIndex((current) => (current === allImages.length - 1 ? 0 : current + 1));
  }, [allImages.length]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!hasMultipleImages) return;
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > SWIPE_THRESHOLD) {
      if (diff > 0) goToNext();
      else goToPrevious();
    }
  };

  const currentSrc = imgError ? '/placeholder-product.png' : currentImage.url;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Main Image */}
      <div
        className="relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="aspect-square sm:aspect-[4/5] lg:aspect-square w-full relative overflow-hidden">
          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 skeleton-shimmer z-10" />
          )}

          {imgLoaded && !imgError && (
            <div
              className="absolute inset-0 scale-110 blur-3xl opacity-60"
              style={{
                backgroundImage: `url(${getOptimizedImage(currentSrc)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
          )}

          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="relative z-10 w-full h-full block cursor-zoom-in"
            aria-label="تكبير صورة المنتج"
          >
            <img
              src={getOptimizedImage(currentSrc, 600, 600)}
              alt={currentImage.alt}
              width={600}
              height={600}
              fetchpriority="high"
              className={`w-full h-full object-contain p-4 sm:p-6 lg:p-8 transition-all duration-500 ${
                imgLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="eager"
              onLoad={() => setImgLoaded(true)}
              onError={() => { setImageError(true); setImgLoaded(true); }}
            />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          className="absolute top-3 left-3 inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/90 text-gray-600 shadow-sm border border-gray-200 hover:bg-white hover:shadow-md transition-all z-20"
          aria-label="تكبير صورة المنتج"
          title="تكبير الصورة"
        >
          <FiMaximize2 size={15} aria-hidden="true" />
        </button>
      </div>

      {/* Thumbnails */}
      {hasMultipleImages && (
        <div className="px-3 sm:px-4 py-3 border-t border-gray-100">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="list" aria-label="معرض صور المنتج">
            {allImages.map((img, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedIndex(index);
                  setImgError(false);
                  setImgLoaded(false);
                }}
                className={`shrink-0 w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  selectedIndex === index
                    ? 'border-blue-500 shadow-sm shadow-blue-500/20'
                    : 'border-gray-100 hover:border-gray-300 opacity-70 hover:opacity-100'
                }`}
                aria-label={`عرض ${img.alt}`}
                aria-current={selectedIndex === index ? 'true' : 'false'}
              >
                <img
                  src={getOptimizedImage(img.url)}
                  alt={img.alt}
                  loading="lazy"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover bg-gray-50"
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

      {/* Fullscreen Preview */}
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            onClick={() => setIsPreviewOpen(false)}
            className="absolute top-4 left-4 z-10 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/20 transition-all"
            aria-label="إغلاق الصورة"
            title="إغلاق"
          >
            <FiX size={22} aria-hidden="true" />
          </button>

          <div className="absolute top-4 right-4 text-white/60 text-sm">
            {selectedIndex + 1} / {allImages.length}
          </div>

          <button
            type="button"
            onClick={() => setIsPreviewOpen(false)}
            className="w-full h-full flex items-center justify-center cursor-zoom-out"
            aria-label="إغلاق"
          >
            <img
              src={getOptimizedImage(currentSrc)}
              alt={currentImage.alt}
              width={1200}
              height={1200}
              className="max-w-[90vw] max-h-[85vh] object-contain pointer-events-none"
              loading="eager"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder-product.png';
              }}
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
