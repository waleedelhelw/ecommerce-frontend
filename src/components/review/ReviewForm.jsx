import { useState } from 'react';
import StarRating from '../common/StarRating';
import reviewService from '../../api/reviewService';
import toast from 'react-hot-toast';

const ReviewForm = ({ productId, onReviewAdded }) => {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('يرجى اختيار تقييم');
      return;
    }
    if (!comment.trim()) {
      toast.error('يرجى كتابة تعليق');
      return;
    }

    try {
      setLoading(true);
      await reviewService.addReview({
        productId,
        rating,
        title,
        comment,
      });
      toast.success('تم إضافة التقييم بنجاح');
      setRating(0);
      setTitle('');
      setComment('');
      setIsOpen(false);
      if (onReviewAdded) onReviewAdded();
    } catch (error) {
      toast.error(error.response?.data?.message || 'فشل إضافة التقييم');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn-outline mb-6">
        ✏️ اكتب تقييم
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-6 mb-6">
      <h3 className="font-bold text-lg mb-4">✏️ اكتب تقييمك</h3>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">التقييم *</label>
        <StarRating rating={rating} interactive onChange={setRating} size={24} showNumber={false} />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">العنوان</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="عنوان مختصر للتقييم"
          className="input-field"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">التعليق *</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="اكتب رأيك في المنتج..."
          rows={4}
          className="input-field"
        />
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'جاري الإرسال...' : 'إرسال التقييم'}
        </button>
        <button type="button" onClick={() => setIsOpen(false)} className="btn-secondary">
          إلغاء
        </button>
      </div>
    </form>
  );
};

export default ReviewForm;