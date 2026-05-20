import { useState, useEffect } from 'react';
import reviewService from '../../api/reviewService';
import ReviewList from '../review/ReviewList';
import ReviewForm from '../review/ReviewForm';
import useAuth from '../../hooks/useAuth';

const ProductReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, isAdmin } = useAuth();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewService.getProductReviews(productId);
      setReviews(data.items || data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  return (
    <div className="mt-12 bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">المراجعات</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        التقييمات والمراجعات
        {reviews.length > 0 && (
          <span className="text-sm text-gray-400 font-normal mr-2">({reviews.length})</span>
        )}
      </h2>

      {isAuthenticated && !isAdmin && (
        <ReviewForm productId={productId} onReviewAdded={fetchReviews} />
      )}

      <ReviewList reviews={reviews} loading={loading} />
    </div>
  );
};

export default ProductReviews;