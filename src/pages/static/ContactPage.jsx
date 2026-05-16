import { useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiFacebook, FiInstagram, FiTwitter } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      // TODO: ربط بـ API لاحقاً
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('فشل إرسال الرسالة، حاول مرة أخرى');
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ ContactPage Schema
  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'تواصل معنا',
    description: 'تواصل مع فريق دعم تسوّق - نحن هنا لمساعدتك',
    url: 'https://tasawwaq.store/contact',
    mainEntity: {
      '@type': 'Organization',
      name: 'تسوّق',
      url: 'https://tasawwaq.store',
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '+20-123-456-7890',
          contactType: 'customer service',
          email: 'info@tasawwaq.com',
          areaServed: 'EG',
          availableLanguage: ['Arabic', 'English'],
        },
      ],
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://tasawwaq.store' },
      { '@type': 'ListItem', position: 2, name: 'تواصل معنا', item: 'https://tasawwaq.store/contact' },
    ],
  };

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [contactSchema, breadcrumbSchema],
  };

  const contactInfo = [
    { icon: FiMail, label: 'البريد الإلكتروني', value: 'info@tasawwaq.com', link: 'mailto:info@tasawwaq.com' },
    { icon: FiPhone, label: 'رقم الهاتف', value: '+201096842033', link: 'tel:+201234567890' },
    { icon: FiMapPin, label: 'العنوان', value: 'القاهرة، مصر', link: null },
    { icon: FiClock, label: 'ساعات العمل', value: 'يومياً 9 ص - 9 م', link: null },
  ];

  return (
    <>
      <SEO
        title="تواصل معنا"
        description="تواصل مع فريق دعم تسوّق. نحن هنا لمساعدتك في أي استفسار. أرسل لنا رسالة أو اتصل بنا مباشرة."
        keywords="تواصل معنا, اتصل بنا, دعم تسوق, خدمة العملاء, تسوق مصر"
        url="/contact"
        structuredData={combinedSchema}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'تواصل معنا' }]} />

        {/* Hero */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">تواصل معنا</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            عندك سؤال أو استفسار؟ فريقنا جاهز لمساعدتك. أرسل لنا رسالة وسنرد عليك في أقرب وقت ممكن.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <aside className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold mb-4">معلومات التواصل</h2>

            {contactInfo.map((item, idx) => {
              const Icon = item.icon;
              const content = (
                <div className="flex items-start gap-3 p-4 bg-white border rounded-xl hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="text-purple-600" size={20} aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1">{item.label}</h3>
                    <p className="font-semibold text-gray-800">{item.value}</p>
                  </div>
                </div>
              );

              return item.link ? (
                <a key={idx} href={item.link} className="block" aria-label={item.label}>
                  {content}
                </a>
              ) : (
                <div key={idx}>{content}</div>
              );
            })}

            {/* Social Media */}
            <div className="pt-4">
              <h3 className="font-bold mb-3">تابعنا على</h3>
              <div className="flex gap-3">
                <a href="https://facebook.com/tasawwaq" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-blue-100 hover:bg-blue-600 hover:text-white text-blue-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label="فيسبوك">
                  <FiFacebook size={18} aria-hidden="true" />
                </a>
                <a href="https://instagram.com/tasawwaq" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-pink-100 hover:bg-pink-600 hover:text-white text-pink-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label="انستجرام">
                  <FiInstagram size={18} aria-hidden="true" />
                </a>
                <a href="https://twitter.com/tasawwaq" target="_blank" rel="noopener noreferrer"
                  className="w-10 h-10 bg-sky-100 hover:bg-sky-600 hover:text-white text-sky-600 rounded-full flex items-center justify-center transition-colors"
                  aria-label="تويتر">
                  <FiTwitter size={18} aria-hidden="true" />
                </a>
              </div>
            </div>
          </aside>

          {/* Contact Form */}
          <section className="lg:col-span-2">
            <div className="bg-white border rounded-xl p-6 lg:p-8">
              <h2 className="text-2xl font-bold mb-6">أرسل لنا رسالة</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      الاسم <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="اسمك الكامل"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                      placeholder="email@example.com"
                      dir="ltr"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    الموضوع <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
                    placeholder="موضوع الرسالة"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    الرسالة <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none resize-none"
                    placeholder="اكتب رسالتك هنا..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary w-full sm:w-auto px-8 py-3 flex items-center justify-center gap-2"
                >
                  <FiSend size={18} aria-hidden="true" />
                  {submitting ? 'جاري الإرسال...' : 'إرسال الرسالة'}
                </button>
              </form>
            </div>
          </section>
        </div>
      </div>
    </>
  );
};

export default ContactPage;