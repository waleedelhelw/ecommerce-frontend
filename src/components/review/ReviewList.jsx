import ReviewCard from './ReviewCard';
import LoadingSpinner from '../common/LoadingSpinner';
import EmptyState from '../common/EmptyState';

const ReviewList = ({ reviews, loading }) => {
  if (loading) return <LoadingSpinner />;

  if (!reviews || reviews.length === 0) {
    return (
      <EmptyState
        icon="⭐"
        title="لا توجد تقييمات"
        message="كن أول من يقيم هذا المنتج"
      />
    );
  }

  return (
    <div>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;