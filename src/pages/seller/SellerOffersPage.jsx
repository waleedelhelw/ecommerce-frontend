import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiPlus, FiTrash2, FiEdit2, FiTag, FiGift } from 'react-icons/fi';
import { getMyOffers, deleteOffer } from '../../api/seller/sellerOfferService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ShareOfferButton from '../../components/common/ShareOfferButton';
import { formatPrice } from '../../utils/formatPrice';
import { formatDate } from '../../utils/formatDate';
import toast from 'react-hot-toast';

const statusConfig = {
  active: { label: 'نشط', gradient: 'from-emerald-400 to-green-500' },
  expired: { label: 'منتهي', gradient: 'from-gray-400 to-gray-500' },
  cancelled: { label: 'ملغي', gradient: 'from-red-400 to-rose-500' },
};

const getOfferStatus = (offer) => {
  if (offer.isActive === false) return 'cancelled';
  if (offer.endDate && new Date(offer.endDate) < new Date()) return 'expired';
  return 'active';
};

const OfferMobileCard = ({ offer, onCancel }) => {
  const status = getOfferStatus(offer);
  const config = statusConfig[status];
  const isDiscount = offer.offerType === 'Discount';
  const isBogo = offer.offerType === 'BuyOneGetOne';

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 border">
          <img
            src={offer.productImageUrl || '/placeholder-product.png'}
            alt={offer.productName}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = '/placeholder-product.png'; }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 line-clamp-1">{offer.title}</p>
          <p className="font-bold text-gray-800 text-sm line-clamp-1">{offer.productName}</p>
          <p className="text-[11px] text-gray-400 line-clamp-1">{offer.storeName}</p>
        </div>
        <div className="shrink-0">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r ${config.gradient} text-white text-[10px] font-bold rounded-full`}>
            {config.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isDiscount && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-l from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full">
            🔥 خصم {offer.discountPercentage}%
          </span>
        )}
        {isBogo && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-full">
            🎁
            {offer.buyQuantity && offer.freeQuantity
              ? ` اشتري ${offer.buyQuantity} + خذ ${offer.freeQuantity}`
              : ' عرض'}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm">
        {offer.offerPrice != null && (
          <>
            <span className="font-bold text-green-700">{formatPrice(offer.offerPrice)}</span>
            <span className="text-xs text-gray-400 line-through">{formatPrice(offer.originalPrice)}</span>
          </>
        )}
        {isBogo && (
          <span className="font-bold text-gray-800">{formatPrice(offer.originalPrice)}</span>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-400">
        <span>من {formatDate(offer.startDate)}</span>
        <span>إلى {formatDate(offer.endDate)}</span>
      </div>

      {status === 'active' && (
        <div className="flex gap-2">
          <Link
            to={`/seller/offers/${offer.id}/edit`}
            state={{ offer }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-100 transition-colors text-sm font-medium"
          >
            <FiEdit2 size={14} />
            تعديل
          </Link>
          <ShareOfferButton offer={offer} className="flex-1 flex items-center justify-center gap-1.5 py-2" />
          <button
            onClick={() => onCancel(offer.id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium"
          >
            <FiTrash2 size={14} />
            إلغاء
          </button>
        </div>
      )}
    </div>
  );
};

const FILTERS = [
  { key: 'all', label: 'الكل' },
  { key: 'active', label: 'نشط' },
  { key: 'expired', label: 'منتهي' },
  { key: 'cancelled', label: 'ملغي' },
];

const SellerOffersPage = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filter, setFilter] = useState('all');
  const [cancelId, setCancelId] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyOffers({ pageNumber: page, pageSize: 20 });
      setOffers(data?.items || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في تحميل العروض');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [page]);

  const filtered = filter === 'all'
    ? offers
    : offers.filter((o) => getOfferStatus(o) === filter);

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      setCancelLoading(true);
      await deleteOffer(cancelId);
      toast.success('تم إلغاء العرض');
      setCancelId(null);
      fetchOffers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'فشل إلغاء العرض');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={fetchOffers} />;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest">العروض</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">إدارة العروض</h1>
        </div>
        <Link
          to="/seller/offers/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all text-sm font-bold shadow-sm shrink-0"
        >
          <FiPlus size={16} />
          إضافة عرض جديد
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto scrollbar-hide pb-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              filter === f.key
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-amber-100">
            <FiTag size={32} className="text-amber-400" />
          </div>
          <p className="text-gray-500 font-medium">
            {filter !== 'all' ? 'لا توجد عروض بهذه الحالة' : 'لا توجد عروض بعد'}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {filter === 'all' && 'أضف عرضاً على أحد منتجاتك لزيادة المبيعات'}
          </p>
        </div>
      ) : (
        <>
          <div className="block sm:hidden space-y-3">
            {filtered.map((offer) => (
              <OfferMobileCard key={offer.id} offer={offer} onCancel={setCancelId} />
            ))}
          </div>

          <div className="hidden sm:block bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs">المنتج</th>
                    <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs">العنوان</th>
                    <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs">النوع</th>
                    <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs">السعر</th>
                    <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs">المدة</th>
                    <th className="text-right px-4 py-3 font-bold text-gray-600 text-xs">الحالة</th>
                    <th className="text-center px-4 py-3 font-bold text-gray-600 text-xs">خيارات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filtered.map((offer) => {
                    const status = getOfferStatus(offer);
                    const config = statusConfig[status];
                    const isDiscount = offer.offerType === 'Discount';
                    const isBogo = offer.offerType === 'BuyOneGetOne';
                    return (
                      <tr key={offer.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={offer.productImageUrl || '/placeholder-product.png'}
                              alt={offer.productName}
                              className="w-10 h-10 rounded-lg object-cover border"
                              onError={(e) => { e.target.src = '/placeholder-product.png'; }}
                            />
                            <span className="font-semibold text-gray-800 text-sm line-clamp-1">
                              {offer.productName}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-sm">{offer.title}</td>
                        <td className="px-4 py-3">
                          {isDiscount && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-l from-orange-500 to-red-500 text-white text-[10px] font-bold rounded-full">
                              🔥 خصم {offer.discountPercentage}%
                            </span>
                          )}
                          {isBogo && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-[10px] font-bold rounded-full">
                              🎁
                              {offer.buyQuantity && offer.freeQuantity
                                ? ` اشتري ${offer.buyQuantity} + خذ ${offer.freeQuantity}`
                                : ' عرض'}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            {isDiscount && offer.offerPrice != null && (
                              <>
                                <span className="font-bold text-green-700 text-sm">{formatPrice(offer.offerPrice)}</span>
                                <span className="text-[11px] text-gray-400 line-through">{formatPrice(offer.originalPrice)}</span>
                              </>
                            )}
                            {isBogo && (
                              <span className="font-bold text-gray-800 text-sm">{formatPrice(offer.originalPrice)}</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          <div>{formatDate(offer.startDate)}</div>
                          <div>{formatDate(offer.endDate)}</div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r ${config.gradient} text-white text-[10px] font-bold rounded-full`}>
                            {config.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {status === 'active' && (
                              <>
                                <Link
                                  to={`/seller/offers/${offer.id}/edit`}
                                  state={{ offer }}
                                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors text-xs font-medium"
                                >
                                  <FiEdit2 size={12} />
                                  تعديل
                                </Link>
                                <ShareOfferButton offer={offer} />
                                <button
                                  onClick={() => setCancelId(offer.id)}
                                  className="inline-flex items-center justify-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-xs font-medium"
                                >
                                  <FiTrash2 size={12} />
                                  إلغاء
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleCancel}
        title="إلغاء العرض"
        message="هل أنت متأكد من إلغاء هذا العرض؟ لن يتم حذفه نهائياً ولكن سيصبح غير نشط."
        confirmText={cancelLoading ? 'جاري الإلغاء...' : 'نعم، إلغاء العرض'}
        cancelText="تراجع"
        variant="danger"
      />
    </div>
  );
};

export default SellerOffersPage;
