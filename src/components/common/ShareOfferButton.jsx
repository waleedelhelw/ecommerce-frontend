import { useState } from 'react';
import { FiShare2, FiCopy, FiSend, FiFacebook } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ShareOfferButton = ({ offer, className = '' }) => {
  const [showMenu, setShowMenu] = useState(false);

  const getProductUrl = () => `${window.location.origin}/products/${offer.productId}`;

  const getShareText = () => {
    let discount = '';
    if (offer.offerType === 'Discount' && offer.discountPercentage) {
      discount = `🔥 خصم ${offer.discountPercentage}%`;
    } else if (offer.offerType === 'BuyOneGetOne') {
      discount = `🎁 اشتري ${offer.buyQuantity || 1} واحصل على ${offer.freeQuantity || 1} مجاناً`;
    }
    const text = `${offer.productName || 'منتج'} - ${discount || 'عرض خاص'}`;
    const productUrl = getProductUrl();
    return `${text}\n\nاطلب دلوقتي 🛒\n${productUrl}`;
  };

  const handleNativeShare = async () => {
    const shareData = {
      title: offer.title || 'عرض خاص',
      text: getShareText(),
      url: getProductUrl(),
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(getShareText());
    toast.success('تم نسخ الرابط مع التفاصيل');
    setShowMenu(false);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(getShareText())}`, '_blank');
    setShowMenu(false);
  };

  const handleFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(getProductUrl())}`, '_blank');
    setShowMenu(false);
  };

  const handleShare = async () => {
    try {
      const shared = await handleNativeShare();
      if (shared) return;
    } catch {}
    setShowMenu(true);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-100 transition-colors text-xs font-medium ${className}`}
      >
        <FiShare2 size={12} />
        مشاركة
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
          <div className="absolute left-0 mt-2 bg-white rounded-xl border shadow-lg z-50 w-56 overflow-hidden">
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiCopy size={16} className="text-gray-500" />
              نسخ الرابط مع التفاصيل
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiSend size={16} className="text-green-600" />
              مشاركة عبر واتساب
            </button>
            <button
              type="button"
              onClick={handleFacebook}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiFacebook size={16} className="text-blue-600" />
              مشاركة عبر فيسبوك
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareOfferButton;
