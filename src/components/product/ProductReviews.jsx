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
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">
        ⭐ التقييمات والمراجعات ({reviews.length})
      </h2>

      {isAuthenticated && !isAdmin && (
        <ReviewForm productId={productId} onReviewAdded={fetchReviews} />
      )}

      <ReviewList reviews={reviews} loading={loading} />
    </div>
  );
};

export default ProductReviews;