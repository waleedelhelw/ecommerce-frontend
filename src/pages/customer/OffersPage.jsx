import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiTag, FiGift, FiTrendingDown, FiPercent, FiShoppingBag } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import Pagination from '../../components/common/Pagination';
import OfferCountdown from '../../components/common/OfferCountdown';
import ShareOfferButton from '../../components/common/ShareOfferButton';
import { getOffers } from '../../api/offerService';
import { formatPrice } from '../../utils/formatPrice';

const FILTERS = [
  { key: 'all', label: 'الكل' },
  { key: 'Discount', label: '🔥 خصم' },
  { key: 'BuyOneGetOne', label: '🎁 هدايا' },
];

const OfferCard = ({ offer }) => {
  const isDiscount = offer.offerType === 'Discount';
  const isBogo = offer.offerType === 'BuyOneGetOne';
  const [imgErr, setImgErr] = useState(false);

  const discountRate = isDiscount && offer.discountPercentage
    ? offer.discountPercentage
    : isBogo && offer.buyQuantity && offer.freeQuantity
      ? Math.round((offer.freeQuantity / (offer.buyQuantity + offer.freeQuantity)) * 100)
      : null;

  return (
    <Link
      to={`/products/${offer.productId}`}
      className="group bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-amber-200 transition-all duration-300 overflow-hidden flex flex-col active:scale-[0.97]"
    >
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="aspect-square w-full">
          {!imgErr ? (
            <img
              src={offer.productImageUrl || '/placeholder-product.png'}
              alt={offer.productName}
              loading="lazy"
              width={300}
              height={300}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              onError={() => setImgErr(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
              <FiShoppingBag size={36} className="text-amber-300" />
            </div>
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block" />

        <div className="absolute top-2 right-2 left-2 sm:top-3 sm:right-3 sm:left-3 flex items-start justify-between gap-1.5">
          <div className="flex flex-wrap gap-1">
            {isDiscount && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gradient-to-l from-orange-500 to-red-500 text-white text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl shadow-lg shadow-orange-500/20">
                🔥 خصم {offer.discountPercentage}%
              </span>
            )}
            {isBogo && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 bg-gradient-to-l from-purple-500 to-pink-500 text-white text-[10px] sm:text-xs font-bold rounded-lg sm:rounded-xl shadow-lg shadow-purple-500/20">
                🎁
                {offer.buyQuantity && offer.freeQuantity
                  ? `${offer.buyQuantity}+${offer.freeQuantity}`
                  : 'عرض'}
              </span>
            )}
          </div>
          <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }} className="hidden sm:block">
            <ShareOfferButton offer={offer} className="!px-2 !py-1.5 bg-white/90 hover:bg-white text-gray-600 shadow-sm backdrop-blur-sm border-0 rounded-xl" />
          </div>
        </div>

        {discountRate && (
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3">
            <div className="bg-white/95 backdrop-blur-sm rounded-lg sm:rounded-xl px-1.5 py-0.5 sm:px-2.5 sm:py-1 shadow-sm flex items-center gap-0.5 sm:gap-1">
              <FiTrendingDown size={9} className="text-red-500 sm:size-[11px]" />
              <span className="text-[9px] sm:text-[10px] font-bold text-red-600">وفر {discountRate}%</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 flex flex-col gap-1.5 sm:gap-2.5 flex-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
            <FiPercent size={6} className="text-amber-500 sm:size-[8px]" />
          </div>
          <span className="text-[10px] sm:text-[11px] text-amber-700 font-semibold line-clamp-1">{offer.title}</span>
        </div>

        <h3 className="font-bold text-gray-900 text-xs sm:text-sm leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] group-hover:text-amber-700 transition-colors">
          {offer.productName}
        </h3>

        {offer.storeName && (
          <div className="hidden sm:flex items-center gap-1.5">
            <div className="w-3.5 h-3.5 rounded-full bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center">
              <FiShoppingBag size={7} className="text-indigo-400" />
            </div>
            <span className="text-[11px] text-gray-400 line-clamp-1">{offer.storeName}</span>
          </div>
        )}

        <div className="mt-auto pt-1.5 sm:pt-2 border-t border-gray-50">
          <div className="flex items-baseline gap-1.5 sm:gap-2">
            <span className="text-sm sm:text-lg font-extrabold text-emerald-700">
              {formatPrice(offer.offerPrice || offer.originalPrice)}
            </span>
            {isDiscount && offer.offerPrice != null && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                {formatPrice(offer.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {offer.endDate && (
          <div className="pt-0.5">
            <OfferCountdown endDate={offer.endDate} className="!text-[10px] sm:!text-[11px]" />
          </div>
        )}
      </div>
    </Link>
  );
};

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const params = { pageNumber: page, pageSize: 20 };
      const data = await getOffers(params);
      setOffers(data?.items || []);
      setTotalPages(data?.totalPages || 1);
    } catch {
      setOffers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [page]);

  const filtered = filter === 'all'
    ? offers
    : offers.filter((o) => o.offerType === filter);

  return (
    <>
      <SEO
        title="العروض والتخفيضات"
        description="تصفح أحدث العروض والتخفيضات على تسوّق. خصومات تصل إلى 70% وعروض اشتري واحدة واحصل على الأخرى مجاناً."
        keywords="عروض, تخفيضات, خصم, اشتري واحدة, bogo, تسوق"
        url="/offers"
      />

      <div className="relative overflow-hidden bg-gradient-to-b from-amber-50/60 via-white to-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-red-200/20 to-amber-200/20 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 pt-6 sm:pt-8 pb-4 sm:pb-6 relative">
          <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm">
              <FiPercent size={10} className="text-white sm:size-[12px]" />
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-amber-600 uppercase tracking-widest">عروض حصرية</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-gray-900 mb-1 sm:mb-2">
            العروض والتخفيضات
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm max-w-xl leading-relaxed">
            أفضل العروض على منتجاتك المفضلة — خصومات تصل إلى 70% وعروض الهدايا المجانية
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 ${
                filter === f.key
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className="aspect-square skeleton-shimmer" />
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-2.5 sm:h-3 w-14 sm:w-16 skeleton-shimmer rounded" />
                  <div className="h-3.5 sm:h-4 w-full skeleton-shimmer rounded" />
                  <div className="h-2.5 sm:h-3 w-20 sm:w-24 skeleton-shimmer rounded" />
                  <div className="h-6 sm:h-8 w-full skeleton-shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 sm:p-16 text-center shadow-sm">
            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-sm border border-amber-100">
              <FiGift size={28} className="text-amber-400 sm:size-[40px]" />
            </div>
            <p className="text-gray-700 font-bold text-base sm:text-xl mb-1">لا توجد عروض</p>
            <p className="text-gray-400 text-xs sm:text-sm">
              {filter !== 'all' ? 'لا توجد عروض من هذا النوع حالياً' : 'لا توجد عروض متاحة حالياً، تابعنا قريباً'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {filtered.map((offer, idx) => (
                <div key={offer.id} className="animate-fadeIn" style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}>
                  <OfferCard offer={offer} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 sm:mt-10">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default OffersPage;
