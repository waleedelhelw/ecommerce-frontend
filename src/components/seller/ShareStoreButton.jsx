import { FiShare2 } from 'react-icons/fi';
import toast from 'react-hot-toast';

const ShareStoreButton = ({
  sellerId,
  storeSlug,
  storeName = 'متجري',
  storeDescription = '',
  className = '',
  label = 'شارك متجرك',
}) => {
  const handleShare = async () => {
    const storeIdentifier = storeSlug || sellerId;

    if (!storeIdentifier) {
      toast.error('رابط المتجر غير متاح حالياً');
      return;
    }

    const storeUrl = `${window.location.origin}/sellers/${storeIdentifier}`;
    const shareData = {
      title: `متجر ${storeName}`,
      text: storeDescription || `شوف متجر ${storeName} على تسوّق`,
      url: storeUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }

      await navigator.clipboard.writeText(storeUrl);
      toast.success('تم نسخ رابط المتجر');
    } catch (err) {
      if (err.name !== 'AbortError') {
        toast.error('تعذر مشاركة المتجر حالياً');
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-colors font-medium ${className}`}
    >
      <FiShare2 size={16} aria-hidden="true" />
      {label}
    </button>
  );
};

export default ShareStoreButton;
