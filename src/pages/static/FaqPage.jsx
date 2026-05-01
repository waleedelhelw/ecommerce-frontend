import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiSearch, FiHelpCircle } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';

const FaqPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  // ✅ الأسئلة الشائعة
  const faqs = [
    {
      category: 'التسوق والشراء',
      question: 'كيف أقوم بالشراء من تسوّق؟',
      answer: 'الشراء سهل جداً! تصفح المنتجات، اختر المنتج اللي عجبك، اضغط على "أضف للسلة"، ثم اذهب للسلة وأكمل عملية الدفع. هتحتاج تسجل دخول أو تنشئ حساب جديد لإتمام الطلب.'
    },
    {
      category: 'التسوق والشراء',
      question: 'ما هي طرق الدفع المتاحة؟',
      answer: 'نوفر عدة طرق دفع آمنة: الدفع عند الاستلام، البطاقات الائتمانية (Visa, Mastercard)، المحافظ الإلكترونية (فودافون كاش، اتصالات كاش)، والتحويل البنكي.'
    },
    {
      category: 'التسوق والشراء',
      question: 'هل أحتاج لإنشاء حساب للشراء؟',
      answer: 'نعم، لازم تنشئ حساب علشان تقدر تشتري. ده بيساعدنا في تتبع طلبك وإرسال تحديثات عن حالة الشحن. التسجيل سريع ومجاني.'
    },
    {
      category: 'الشحن والتوصيل',
      question: 'كم مدة التوصيل؟',
      answer: 'مدة التوصيل تتراوح من 2 إلى 5 أيام عمل داخل القاهرة والإسكندرية، ومن 3 إلى 7 أيام عمل لباقي المحافظات. هتلاقي مدة التوصيل المتوقعة عند كل منتج.'
    },
    {
      category: 'الشحن والتوصيل',
      question: 'هل التوصيل متاح لكل المحافظات؟',
      answer: 'نعم، نوصّل لكل محافظات مصر. تكلفة الشحن تختلف حسب المحافظة والوزن، وفيه عروض شحن مجاني للطلبات اللي فوق مبلغ معين.'
    },
    {
      category: 'الإرجاع والاستبدال',
      question: 'ما هي سياسة الإرجاع؟',
      answer: 'لديك 14 يوم من تاريخ الاستلام لإرجاع المنتج لو ما عجبكش، بشرط يكون في حالته الأصلية وغير مستخدم. للتفاصيل الكاملة، راجع صفحة سياسة الإرجاع.'
    },
    {
      category: 'الإرجاع والاستبدال',
      question: 'كيف أرجع منتج؟',
      answer: 'ادخل على "طلباتي" في حسابك، اختر الطلب اللي عاوز ترجعه، واضغط على "طلب إرجاع". هنرسل مندوب لاستلام المنتج خلال 2-3 أيام عمل.'
    },
    {
      category: 'البائعين',
      question: 'كيف أفتح متجر على تسوّق؟',
      answer: 'فتح متجر مجاني تماماً! اضغط على "افتح متجرك" في الصفحة الرئيسية، املأ بيانات متجرك (الاسم، الوصف، رقم التواصل)، انتظر الموافقة من فريقنا (24-48 ساعة)، وابدأ في إضافة منتجاتك.'
    },
    {
      category: 'البائعين',
      question: 'هل هناك رسوم على البائعين؟',
      answer: 'فتح المتجر وعرض المنتجات مجاني تماماً. نأخذ نسبة عمولة بسيطة فقط على المبيعات التي تتم من خلال المنصة. التفاصيل الكاملة موجودة في اتفاقية البائعين.'
    },
    {
      category: 'الحساب والأمان',
      question: 'هل بياناتي آمنة؟',
      answer: 'نعم، أمان بياناتك أولوية قصوى عندنا. نستخدم تشفير SSL لحماية كل المعاملات، ولا نشارك بياناتك الشخصية مع أي طرف ثالث. للتفاصيل، راجع سياسة الخصوصية.'
    },
    {
      category: 'الحساب والأمان',
      question: 'نسيت كلمة المرور، ماذا أفعل؟',
      answer: 'اضغط على "نسيت كلمة المرور" في صفحة تسجيل الدخول، أدخل بريدك الإلكتروني، هنرسل لك رابط لإعادة تعيين كلمة المرور.'
    },
    {
      category: 'التواصل والدعم',
      question: 'كيف أتواصل مع خدمة العملاء؟',
      answer: 'فيه أكتر من طريقة: تقدر تراسلنا عبر صفحة "تواصل معنا"، تبعتلنا إيميل على info@tasawwaq.com، أو تكلمنا على رقم 01234567890 من 9 ص لـ 9 م يومياً.'
    },
  ];

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ تجميع الأسئلة حسب التصنيف
  const groupedFaqs = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {});

  // 🔥 FAQ Schema (مهم جداً للـ SEO!)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://tasawwaq.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'الأسئلة الشائعة', item: 'https://tasawwaq.vercel.app/faq' },
    ],
  };

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [faqSchema, breadcrumbSchema],
  };

  return (
    <>
      <SEO
        title="الأسئلة الشائعة"
        description="إجابات على أكثر الأسئلة شيوعاً عن تسوّق - الشراء، الشحن، الإرجاع، فتح متجر، طرق الدفع، وكل ما تحتاج معرفته."
        keywords="أسئلة شائعة, FAQ, تسوق, الشحن, الإرجاع, الدفع, فتح متجر, خدمة العملاء"
        url="/faq"
        structuredData={combinedSchema}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'الأسئلة الشائعة' }]} />

        {/* Hero */}
        <section className="text-center mb-10">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiHelpCircle className="text-purple-600" size={32} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold mb-3">الأسئلة الشائعة</h1>
          <p className="text-gray-600">إجابات على الأسئلة الأكثر شيوعاً</p>
        </section>

        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-xl mx-auto">
            <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} aria-hidden="true" />
            <input
              type="search"
              placeholder="ابحث في الأسئلة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none"
              aria-label="بحث في الأسئلة الشائعة"
            />
          </div>
        </div>

        {/* FAQs */}
        {Object.keys(groupedFaqs).length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">لا توجد نتائج لبحثك. جرّب كلمات أخرى.</p>
          </div>
        ) : (
          Object.entries(groupedFaqs).map(([category, items]) => (
            <section key={category} className="mb-8">
              <h2 className="text-xl font-bold mb-4 text-purple-700">{category}</h2>
              <div className="space-y-3">
                {items.map((faq) => {
                  const globalIndex = faqs.indexOf(faq);
                  const isOpen = openIndex === globalIndex;
                  return (
                    <article
                      key={globalIndex}
                      className="bg-white border rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setOpenIndex(isOpen ? -1 : globalIndex)}
                        className="w-full flex items-center justify-between p-5 text-right hover:bg-gray-50 transition-colors"
                        aria-expanded={isOpen}
                        aria-controls={`faq-answer-${globalIndex}`}
                      >
                        <h3 className="font-semibold text-gray-800 text-lg flex-1">
                          {faq.question}
                        </h3>
                        <FiChevronDown
                          size={20}
                          className={`text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                          aria-hidden="true"
                        />
                      </button>
                      {isOpen && (
                        <div
                          id={`faq-answer-${globalIndex}`}
                          className="px-5 pb-5 text-gray-600 leading-relaxed border-t pt-4"
                        >
                          {faq.answer}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>
          ))
        )}

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-3">لم تجد إجابتك؟</h2>
          <p className="mb-6 text-purple-100">فريق الدعم جاهز لمساعدتك على مدار الساعة</p>
          <Link to="/contact" className="inline-block bg-white text-purple-700 px-8 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors">
            تواصل معنا
          </Link>
        </section>
      </div>
    </>
  );
};

export default FaqPage;