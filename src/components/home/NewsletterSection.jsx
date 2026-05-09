import { useState } from 'react';
import { FiSend, FiMail, FiCheck } from 'react-icons/fi';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  if (subscribed) {
    return (
      <section className="py-10 sm:py-16 bg-gradient-to-l from-purple-600 via-indigo-600 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-400/20 rounded-full mb-4">
            <FiCheck size={32} className="text-green-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">تم الاشتراك بنجاح!</h2>
          <p className="text-purple-200">شكراً لاشتراكك في نشرتنا البريدية. سنبقيك على اطلاع بكل جديد.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 sm:py-16 bg-gradient-to-l from-purple-600 via-indigo-600 to-purple-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-5">
          <FiMail size={28} className="text-white" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          اشترك في نشرتنا البريدية
        </h2>
        <p className="text-purple-200 text-sm sm:text-base mb-8 max-w-lg mx-auto">
          احصل على أحدث العروض والتخفيضات والمنتجات الجديدة أولاً بأول
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="أدخل بريدك الإلكتروني"
            required
            className="flex-1 px-5 py-3.5 rounded-xl border-0 outline-none text-gray-900 placeholder:text-gray-400 text-sm bg-white/95 focus:ring-2 focus:ring-yellow-400"
            aria-label="البريد الإلكتروني"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-yellow-400 text-purple-900 px-6 py-3.5 rounded-xl font-bold hover:bg-yellow-300 transition-all text-sm shrink-0"
          >
            <FiSend size={16} />
            اشتراك
          </button>
        </form>

        <p className="text-purple-300/60 text-xs mt-4">
          لن نشارك بريدك الإلكتروني مع أي طرف ثالث. يمكنك إلغاء الاشتراك في أي وقت.
        </p>
      </div>
    </section>
  );
};

export default NewsletterSection;
