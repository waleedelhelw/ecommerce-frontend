import { FiShield } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';

const PrivacyPage = () => {
  const lastUpdated = '1 يناير 2026';

  const sections = [
    {
      title: '1. مقدمة',
      content: `نحن في تسوّق نلتزم بحماية خصوصية مستخدمينا. توضح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك الشخصية عند استخدامك لمنصتنا. باستخدامك لتسوّق، فإنك توافق على الممارسات الموضحة في هذه السياسة.`
    },
    {
      title: '2. المعلومات التي نجمعها',
      content: `نجمع المعلومات التالية:
• المعلومات الشخصية: الاسم، البريد الإلكتروني، رقم الهاتف، العنوان
• معلومات الحساب: اسم المستخدم، كلمة المرور (مشفرة)
• معلومات الدفع: تفاصيل البطاقات (نستخدم بوابات دفع آمنة)
• معلومات الاستخدام: الصفحات التي تزورها، المنتجات التي تشاهدها
• معلومات الجهاز: نوع المتصفح، عنوان IP، نظام التشغيل`
    },
    {
      title: '3. كيف نستخدم معلوماتك',
      content: `نستخدم معلوماتك للأغراض التالية:
• إنشاء وإدارة حسابك على المنصة
• معالجة طلباتك وتوصيل المنتجات
• التواصل معك بخصوص طلباتك أو استفساراتك
• تحسين خدماتنا وتجربة المستخدم
• إرسال عروض ومحتوى تسويقي (يمكنك إلغاء الاشتراك)
• الامتثال للمتطلبات القانونية`
    },
    {
      title: '4. مشاركة المعلومات',
      content: `لا نبيع معلوماتك الشخصية لأي طرف ثالث. قد نشارك معلوماتك في الحالات التالية:
• مع البائعين: لإتمام الطلبات (الاسم والعنوان فقط)
• مع شركات الشحن: لتوصيل المنتجات
• مع بوابات الدفع: لمعالجة المدفوعات بأمان
• عند الضرورة القانونية: للامتثال للقوانين أو حماية حقوقنا`
    },
    {
      title: '5. حماية المعلومات',
      content: `نتخذ إجراءات أمنية صارمة لحماية معلوماتك:
• تشفير SSL لجميع المعاملات
• تشفير كلمات المرور وعدم تخزينها كنص واضح
• مراجعة دورية لأنظمة الأمان
• تدريب الموظفين على ممارسات الأمان
• استخدام بوابات دفع معتمدة وآمنة`
    },
    {
      title: '6. الكوكيز (Cookies)',
      content: `نستخدم ملفات الكوكيز لتحسين تجربتك على الموقع. تساعدنا الكوكيز في:
• تذكر تفضيلاتك
• الحفاظ على جلسة تسجيل الدخول
• تحليل أداء الموقع
• تخصيص المحتوى المعروض

يمكنك التحكم في الكوكيز من خلال إعدادات متصفحك.`
    },
    {
      title: '7. حقوقك',
      content: `لديك الحقوق التالية فيما يتعلق بمعلوماتك:
• الوصول لمعلوماتك الشخصية
• تصحيح أو تحديث معلوماتك
• حذف حسابك ومعلوماتك
• الاعتراض على معالجة بياناتك
• إلغاء الاشتراك في الرسائل التسويقية
• طلب نسخة من بياناتك

للاستفادة من هذه الحقوق، تواصل معنا على info@tasawwaq.com`
    },
    {
      title: '8. حماية الأطفال',
      content: `لا نجمع معلومات من الأطفال دون 18 عاماً عمداً. إذا اكتشفنا أن طفل قدم لنا معلومات شخصية بدون موافقة الوالدين، سنحذفها فوراً.`
    },
    {
      title: '9. التحديثات على السياسة',
      content: `قد نقوم بتحديث هذه السياسة من وقت لآخر. سنخبرك بأي تغييرات جوهرية عبر البريد الإلكتروني أو من خلال إشعار على الموقع. استخدامك المستمر للموقع بعد التحديثات يعني موافقتك على السياسة الجديدة.`
    },
    {
      title: '10. التواصل',
      content: `إذا كان لديك أي استفسار أو شكوى بخصوص سياسة الخصوصية، يمكنك التواصل معنا:
• البريد الإلكتروني: privacy@tasawwaq.com
• رقم الهاتف: 01234567890
• العنوان: القاهرة، مصر`
    },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://tasawwaq.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'سياسة الخصوصية', item: 'https://tasawwaq.vercel.app/privacy' },
    ],
  };

  return (
    <>
      <SEO
        title="سياسة الخصوصية"
        description="سياسة الخصوصية لمنصة تسوّق - تعرّف على كيفية جمع واستخدام وحماية بياناتك الشخصية على منصتنا."
        keywords="سياسة الخصوصية, خصوصية, حماية البيانات, تسوق, شروط"
        url="/privacy"
        structuredData={breadcrumbSchema}
      />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'سياسة الخصوصية' }]} />

        {/* Hero */}
        <header className="text-center mb-10 py-8 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiShield className="text-white" size={32} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold mb-3">سياسة الخصوصية</h1>
          <p className="text-gray-600">آخر تحديث: {lastUpdated}</p>
        </header>

        {/* Content */}
        <article className="bg-white border rounded-xl p-6 lg:p-8 prose prose-lg max-w-none">
          <p className="text-gray-600 leading-relaxed mb-8">
            نحن في تسوّق نقدّر ثقتك ونحرص على حماية خصوصيتك. هذه السياسة توضح بشفافية كيف نتعامل مع معلوماتك الشخصية.
          </p>

          {sections.map((section, idx) => (
            <section key={idx} className="mb-8 pb-8 border-b last:border-0 last:pb-0 last:mb-0">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">{section.title}</h2>
              <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </section>
          ))}
        </article>

        {/* Contact */}
        <div className="mt-8 p-6 bg-purple-50 border border-purple-200 rounded-xl text-center">
          <h2 className="text-xl font-bold mb-2">عندك أسئلة؟</h2>
          <p className="text-gray-600 mb-4">
            تواصل معنا في أي وقت لو محتاج توضيح
          </p>
          <a
            href="mailto:privacy@tasawwaq.com"
            className="text-purple-600 font-medium hover:underline"
          >
            privacy@tasawwaq.com
          </a>
        </div>
      </div>
    </>
  );
};

export default PrivacyPage;