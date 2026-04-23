import StarRating from '../common/StarRating';
import { formatDate } from '../../utils/formatDate';
import { FiUser } from 'react-icons/fi';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <FiUser className="text-blue-600" size={18} />
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {review.userName || review.userFirstName || 'مستخدم'}
            </p>
            <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size={14} showNumber={false} />
      </div>

      {review.title && (
        <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
      )}

      <p className="text-gray-600 text-sm">{review.comment}</p>
    </div>
  );
};

export default ReviewCard;