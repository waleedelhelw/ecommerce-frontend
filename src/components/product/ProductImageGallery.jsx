import { useState } from 'react';

const ProductImageGallery = ({ imageUrl, productName, images = [] }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imgError, setImgError] = useState(false);

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

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border">
      {/* الصورة الرئيسية */}
      <div
        className="aspect-square bg-gray-100 flex items-center justify-center"
        role="img"
        aria-label={currentImage.alt}
      >
        <img
          src={imgError ? '/placeholder-product.png' : currentImage.url}
          alt={currentImage.alt}
          className="w-full h-full object-cover"
          loading="eager"
          onError={(e) => {
            e.target.onerror = null;
            setImgError(true);
          }}
        />
      </div>

      {/* الصور الصغيرة (Thumbnails) */}
      {allImages.length > 1 && (
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
                  className="w-full h-full object-cover"
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