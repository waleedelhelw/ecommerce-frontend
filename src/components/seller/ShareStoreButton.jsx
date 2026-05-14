import { useState } from 'react';
import { FiShare2, FiCopy, FiSend } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ShareStoreButton = ({
  sellerId,
  storeSlug,
  storeName = 'متجري',
  storeDescription = '',
  className = '',
  label = 'شارك متجرك',
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStoreIdentifier = () => storeSlug || sellerId;

  const getStoreUrl = () => `${window.location.origin}/sellers/${getStoreIdentifier()}`;

  const getShareText = () => {
    const desc = storeDescription || `شوف متجر ${storeName} على تسوّق`;
    return `${desc}\n\n${getStoreUrl()}`;
  };

  const handleNativeShare = async () => {
    const storeUrl = getStoreUrl();
    const shareData = {
      title: `متجر ${storeName}`,
      text: storeDescription || `شوف متجر ${storeName} على تسوّق`,
      url: storeUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return true;
      }
      return false;
    } catch (err) {
      if (err.name !== 'AbortError') {
        throw err;
      }
      return true;
    }
  };

  const handleCopyLink = async () => {
    const text = getShareText();
    await navigator.clipboard.writeText(text);
    toast.success('تم نسخ رابط المتجر مع الوصف');
    setShowMenu(false);
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://wa.me/?text=${text}`, '_blank');
    setShowMenu(false);
  };

  const handleShare = async () => {
    if (!getStoreIdentifier()) {
      toast.error('رابط المتجر غير متاح حالياً');
      return;
    }

    try {
      const shared = await handleNativeShare();
      if (shared) return;
    } catch {
      // fallback to menu
    }

    // Show menu if native share not available or failed
    setShowMenu(true);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleShare}
        className={`inline-flex items-center justify-center gap-2 rounded-lg transition-colors font-medium ${className}`}
      >
        <FiShare2 size={16} aria-hidden="true" />
        {label}
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
              نسخ الرابط مع الوصف
            </button>
            <button
              type="button"
              onClick={handleWhatsApp}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <FiSend size={16} className="text-green-600" />
              مشاركة عبر واتساب
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShareStoreButton;
