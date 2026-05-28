import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';

const FeaturesPage = () => {
  const pageSchema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': 'https://www.tasawwaq.store/features',
        name: 'مميزات تسوّق - كل ما يقدمه الموقع للمشترين والبائعين',
        description: 'اكتشف جميع مميزات منصة تسوّق للتسوق الإلكتروني في مصر. تصفح المنتجات، إدارة المتجر، تتبع الطلبات، طرق الدفع، الشحن، الإرجاع، العروض والتخفيضات.',
        inLanguage: 'ar',
        isAccessibleForFree: true,
        about: {
          '@type': 'Thing',
          name: 'التسوق الإلكتروني في مصر',
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://www.tasawwaq.store' },
          { '@type': 'ListItem', position: 2, name: 'مميزات تسوّق', item: 'https://www.tasawwaq.store/features' },
        ],
      },
    ],
  };

  const sections = [
    {
      id: 'customer',
      title: 'للمشترين',
      icon: '🛍️',
      items: [
        {
          title: 'تصفح جميع المنتجات',
          desc: 'تصفح آلاف المنتجات في مختلف الأقسام — إلكترونيات، موضة، أدوات منزلية، مستحضرات تجميل، وأكثر. استخدم التصنيفات والبحث المتقدم للوصول لأي منتج بسرعة.',
          link: '/products',
          linkText: 'تصفح المنتجات',
          keywords: 'تسوق اونلاين مصر, شراء منتجات, متجر الكتروني مصري, منتجات متنوعة',
        },
        {
          title: 'بحث متقدم يدعم العربية',
          desc: 'ابحث عن أي منتج بالعربية الفصحى أو العامية — الموقع بيفهم كل اللهجات العربية بفضل تقنية البحث الذكي. تقدر تبحث باسم المنتج، الوصف، القسم، المتجر، أو الماركة.',
          link: '/products',
          linkText: 'جرب البحث الآن',
          keywords: 'بحث عربي, تسوق ذكي, بحث منتجات مصر',
        },
        {
          title: 'تصنيفات وأقسام',
          desc: 'تصفح المنتجات حسب التصنيفات والأقسام المختلفة. اختر القسم اللي يهمك وشوف كل المنتجات المتاحة فيه.',
          link: '/categories',
          linkText: 'عرض الأقسام',
          keywords: 'تصنيفات منتجات, أقسام المتجر, تسوق حسب القسم',
        },
        {
          title: 'متاجر البائعين',
          desc: 'تصفح متاجر البائعين الموثوقين، شوف تقييماتهم ومنتجاتهم وتاريخهم في البيع. كل متجر عنده صفحته الخاصة.',
          link: '/sellers',
          linkText: 'استعرض المتاجر',
          keywords: 'متاجر مصرية, بائعين موثوقين, تسوق من متاجر',
        },
        {
          title: 'تفاصيل المنتج الكاملة',
          desc: 'كل منتج عنده صفحة كاملة بالصور، السعر، الوصف، التقييمات، المخزون المتوفر، معلومات البائع، وعروض الأسعار.',
          link: '/products',
          linkText: 'شوف مثال',
          keywords: 'تفاصيل المنتج, صور منتجات, تقييمات المنتجات',
        },
        {
          title: 'عروض وتخفيضات 🔥',
          desc: 'لاقي أفضل العروض والتخفيضات على المنتجات. عروض الخصم المباشر بنسبة %، عروض BOGO (اشتر واحدة وخذ واحدة مجاناً)، ومع عدادات تنازلية للعروض محدودة الوقت.',
          link: '/offers',
          linkText: 'تصفح العروض',
          keywords: 'عروض تخفيضات مصر, خصومات, عروض اليوم, تسوق بسعر مخفض',
        },
        {
          title: 'سلة التسوق',
          desc: 'أضف المنتجات لسلة التسوق وعدّل الكميات بسهولة قبل الشراء. سلة التسوق بتتذكر منتجاتك حتى بعد تسجيل الخروج.',
          link: '/cart',
          linkText: 'سلة التسوق',
          keywords: 'سلة تسوق, عربة شراء, منتجات في السلة',
        },
        {
          title: 'المفضلة (Wishlist)',
          desc: 'احتفظ بالمنتجات اللي عجباك في المفضلة عشان ترجع لها بعدين بسهولة. تقدر تضيف منتجات من قوائم المفضلة للسلة.',
          link: '/wishlist',
          linkText: 'المفضلة',
          keywords: 'قائمة المفضلة, حفظ المنتجات, wishlist مصر',
        },
        {
          title: 'طرق دفع متعددة 💳',
          desc: 'ادفع بالطريقة اللي تناسبك — الدفع عند الاستلام (COD) مع رسوم رمزية، أو دفع إلكتروني عبر فودافون كاش، إنستاباي، باي بال، تحويل بنكي، أو محافظ إلكترونية. اختار الدفع للمنصة أو مباشرة للتاجر.',
          link: '/checkout',
          linkText: 'طريقة الدفع',
          keywords: 'طرق الدفع مصر, فودافون كاش, انستاباي, دفع عند الاستلام, COD مصر',
        },
        {
          title: 'شراء بالتقسيط 📋',
          desc: 'قسّم قيمة مشترياتك على دفعات شهرية مريحة. اختر خطة التقسيط المناسبة ليك وادفع أول قسط لتأكيد الطلب.',
          link: '/checkout',
          linkText: 'شوف خطط التقسيط',
          keywords: 'تقسيط منتجات, شراء بالتقسيط, دفع على دفعات مصر',
        },
        {
          title: 'تتبع الطلبات',
          desc: 'تابع طلبك من لحظة تأكيده لحد ما يوصل لباب بيتك. تقدر تشوف حالة الطلب وتاريخ التوصيل المتوقع ومعلومات الشحن كاملة.',
          link: '/orders',
          linkText: 'طلباتي',
          keywords: 'تتبع الطلب, تتبع شحنة, حالة الطلب مصر',
        },
        {
          title: 'تتبع الطلبات للضيوف',
          desc: 'طلبت من غير ما تعمل حساب؟ ما علاش — تقدر تتتبع طلبك عن طريق رابط التتبع اللي يتوصلك على واتساب. مشاركة سهلة مع البائع.',
          link: '/track',
          linkText: 'تتبع طلب ضيف',
          keywords: 'تتبع طلب زائر, تتبع بدون حساب, tracking guest order',
        },
        {
          title: 'مشاركة عبر واتساب',
          desc: 'شارك المنتجات والطلبات مع أهلك وأصحابك عبر واتساب بضغطة زر. المنتجات بتتشارك مع صورة المنتج وسعره.',
          keywords: 'مشاركة واتساب, مشاركة منتج, تسوق جماعي مصر',
        },
        {
          title: 'سياسة إرجاع واضحة',
          desc: 'تقدر ترجع المنتجات اللي مش عجبك خلال الفترة المحددة. سياسة الإرجاع واضحة ومكتوبة. قدم طلب إرجاع من حسابك وتابع حالته.',
          link: '/return-policy',
          linkText: 'سياسة الإرجاع',
          keywords: 'إرجاع المنتجات, استرجاع مشتريات, سياسة الارجاع مصر',
        },
      ],
    },
    {
      id: 'seller',
      title: 'للبائعين',
      icon: '🏪',
      items: [
        {
          title: 'فتح متجر مجاني',
          desc: 'سجّل كبائع وافتح متجرك الإلكتروني مجاناً. أضف منتجاتك وابدأ البيع في دقائق. لو عندك مشروع صغير أو علامة تجارية، دي فرصتك تبيع أونلاين.',
          link: '/register-seller',
          linkText: 'افتح متجرك',
          keywords: 'فتح متجر الكتروني, بيع اونلاين مصر, متجر مجاني, بائع مصري',
        },
        {
          title: 'لوحة تحكم البائع',
          desc: 'لوحة تحكم شاملة تظهر لك كل حاجة — المبيعات، الطلبات الجديدة، المخزون، الإحصائيات، وأداء متجرك في لمحة.',
          link: '/seller/dashboard',
          linkText: 'اللوحة',
          keywords: 'لوحة تحكم بائع, إدارة المتجر, احصائيات البيع',
        },
        {
          title: 'إدارة المنتجات',
          desc: 'أضف منتجات جديدة بسهولة مع الصور والأسعار والكميات. عدّل أو اشطب أي منتج لما تحب. تصفّح منتجاتك وابحث فيها.',
          link: '/seller/products',
          linkText: 'منتجاتي',
          keywords: 'إضافة منتجات, إدارة المخزون, رفع منتجات مصر',
        },
        {
          title: 'نظام العروض الذكي',
          desc: 'اعمل عروض على منتجاتك بسهولة — خصم مباشر (%)، أو عروض BOGO (اشتر واحدة وخذ مجاناً). حدد مدة العرض واختار المنتجات. العروض بتظهر مع عدادات تنازلية.',
          link: '/seller/offers',
          linkText: 'عروضي',
          keywords: 'عروض بائع, خصومات متجر, BOGO, تخفيضات',
        },
        {
          title: 'إدارة الطلبات',
          desc: 'شوف كل الطلبات اللي وصلتك، غيّر حالتها، وتابع توصيلها للعميل. تقدر تعمل طلبات خارجية للعملاء اللي بتقابلهم.',
          link: '/seller/orders',
          linkText: 'الطلبات',
          keywords: 'إدارة طلبات, طلبات المتجر, توصيل الطلبات',
        },
        {
          title: 'إدارة المرتجعات',
          desc: 'استقبل طلبات الإرجاع من العملاء ووافق عليها أو ارفضها. تابع حالة كل مرتجع وسجل ملاحظاتك.',
          link: '/seller/returns',
          linkText: 'المرتجعات',
          keywords: 'إدارة المرتجعات, استرجاع البائع, مرتجعات المتجر',
        },
        {
          title: 'التقارير المالية والأرباح',
          desc: 'تقارير مالية مفصّلة تظهر لك أرباحك، المبيعات اليومية، إجمالي الإيرادات، وصافي المكاسب. كل الأرقام اللي تحتاجها عشان تعرف أداء متجرك.',
          link: '/seller/finance',
          linkText: 'المالية',
          keywords: 'تقارير مالية, أرباح المتجر, إيرادات البائع, مبيعات',
        },
        {
          title: 'إعدادات الشحن',
          desc: 'حدد مناطق الشحن اللي بتشحن ليها والتكلفة لكل منطقة. عميلك بيشوف تكلفة الشحن قبل ما يطلب.',
          link: '/seller/shipping-zones',
          linkText: 'مناطق الشحن',
          keywords: 'توصيل منتجات, شحن مصر, مناطق الشحن, تكلفة التوصيل',
        },
        {
          title: 'طرق دفع البائع',
          desc: 'أضف طرق الدفع اللي بتقبلها — حساب بنكي، محفظة إلكترونية، فودافون كاش، إنستاباي. العميل يقدر يدفعلك مباشرة.',
          link: '/seller/payment-methods',
          linkText: 'طرق الدفع',
          keywords: 'تحويل بنكي بائع, استلام فلوس, طرق دفع المتجر',
        },
        {
          title: 'إنشاء طلبات خارجية',
          desc: 'لو قابلت عميل بره الموقع واتفقت معاه على منتج، تقدر تعمل له طلب خارجي من لوحة التحكم ويرجعله رابط تتبع.',
          link: '/seller/orders',
          linkText: 'طلب خارجي',
          keywords: 'طلب خارجي, فاتورة بائع, طلب يدوي',
        },
        {
          title: 'السحب المالي (Payouts)',
          desc: 'اطلب سحب أرباحك من المنصة في أي وقت. تابع حالة طلبات السحب وأرشيف المدفوعات السابقة.',
          link: '/seller/payouts',
          linkText: 'السحب',
          keywords: 'سحب أرباح, باي اوت, صرف فلوس المتجر',
        },
      ],
    },
    {
      id: 'platform',
      title: 'مميزات عامة',
      icon: '⚙️',
      items: [
        {
          title: 'تسجيل دخول متعدد',
          desc: 'سجّل دخولك بالبريد الإلكتروني أو بحساب Google. إنشاء حساب مجاني وسهل ومتاح للجميع.',
          link: '/login',
          linkText: 'تسجيل دخول',
          keywords: 'تسجيل دخول, انشاء حساب مصر, login Google, اشتراك موقع',
        },
        {
          title: 'الأمان والحماية',
          desc: 'كل البيانات مشفرة، وكلمات المرور محمية، ومفيش بيانات بطاقات بنكية بتتخزن عندنا. الدفع آمن 100%.',
          keywords: 'أمان موقع تسوق, حماية المشترين, تشفير بيانات مصر',
        },
        {
          title: 'إشعارات فورية',
          desc: 'استقبل إشعارات على هاتفك المحمول — طلبات جديدة، تأكيدات، تغيير حالة الطلب، عروض حصرية. فور وصولها.',
          keywords: 'اشعارات متجر, تنبيهات الطلبات, push notifications مصر',
        },
        {
          title: 'دعم اللغة العربية',
          desc: 'الموقع كامل بالعربية — من التصفح للشراء للإدارة. واجهة使用者 experience مصممة خصيصاً للمستخدم العربي.',
          keywords: 'موقع عربي, تسوق بالعربي, متجر مصري, واجهة عربية',
        },
        {
          title: 'تصميم متجاوب (Responsive)',
          desc: 'الموقع شغال تمام على الموبايل، التابلت، والكمبيوتر. تقدر تتسوق من أي جهاز في أي وقت.',
          keywords: 'تصميم متجاوب, تسوق من الموبايل, موقع متوافق مع الجوال',
        },
        {
          title: 'التقييمات والمراجعات',
          desc: 'كل منتج عنده تقييمات ومراجعات من المشترين اللي جربوه قبل كده. اقرأ تجارب الناس واختار بثقة.',
          link: '/products',
          linkText: 'شوف التقييمات',
          keywords: 'تقييم منتجات, مراجعات العملاء, تجارب شراء مصر',
        },
      ],
    },
  ];

  return (
    <>
      <SEO
        title="مميزات تسوّق - دليل الاستخدام الكامل للمشترين والبائعين"
        description="كل مميزات منصة تسوّق في مكان واحد: للمشترين — تصفح، بحث، عروض، دفع، تتبع. وللبائعين — فتح متجر، إدارة منتجات، عروض، تقارير مالية. دليل استخدام شامل للتسوق الإلكتروني في مصر."
        keywords="مميزات تسوق, دليل استخدام, تسوق اونلاين مصر, متجر الكتروني, بيع وشراء مصر, منصة تسوق مصرية, شرح الموقع, مزايا التسوق"
        url="/features"
        structuredData={pageSchema}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'مميزات تسوّق' }]} />

        <section className="text-center mb-16 py-12 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl">
          <h1 className="text-3xl lg:text-5xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            كل مميزات تسوّق في مكان واحد
          </h1>
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
            منصة تسوّق بتقدم لك كل الأدوات اللي تحتاجها — سواء كنت مشتري عايز أفضل المنتجات بأقل الأسعار،
            أو بائع عايز تطور مشروعك وتوصل لعدد أكبر من العملاء في مصر.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link to="/products" className="btn-primary px-6 py-2.5 text-sm">
              ابدأ التسوق
            </Link>
            <Link to="/register-seller" className="bg-white text-purple-600 border-2 border-purple-600 hover:bg-purple-50 font-bold px-6 py-2.5 rounded-xl text-sm transition-colors">
              افتح متجرك مجاناً
            </Link>
          </div>
        </section>

        {sections.map((section) => (
          <section key={section.id} className="mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2 flex items-center gap-3">
              <span className="text-3xl">{section.icon}</span>
              {section.title}
            </h2>
            <p className="text-gray-500 mb-8">
              {section.id === 'customer'
                ? 'كل الأدوات اللي بتساعدك تسوق بسهولة وأمان'
                : section.id === 'seller'
                  ? 'كل الأدوات اللي تحتاجها عشان تدير متجرك بنجاح'
                  : 'مميزات إضافية بتجعل تجربتك أفضل'}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item, idx) => (
                <article
                  key={idx}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-purple-200 transition-all duration-300"
                >
                  <h3 className="font-bold text-gray-800 text-base mb-2 flex items-center gap-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-4">
                    {item.desc}
                  </p>
                  {item.link && (
                    <Link
                      to={item.link}
                      className="text-purple-600 hover:text-purple-700 text-sm font-semibold inline-flex items-center gap-1"
                    >
                      {item.linkText || 'اذهب للصفحة'} ←
                    </Link>
                  )}
                  <meta itemProp="keywords" content={item.keywords} />
                </article>
              ))}
            </div>
          </section>
        ))}

        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-8 lg:p-12 text-center text-white mb-8">
          <h2 className="text-3xl font-bold mb-4">ابدأ رحلتك مع تسوّق النهاردة</h2>
          <p className="text-purple-100 mb-8 max-w-xl mx-auto">
            سواء عايز تشتري أو تبيع — تسوّق معاك في كل خطوة
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/products"
              className="bg-white text-purple-700 hover:bg-purple-50 font-bold px-8 py-3 rounded-xl transition-colors"
            >
              تسوّق الآن
            </Link>
            <Link
              to="/register"
              className="bg-purple-500 hover:bg-purple-400 text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              إنشاء حساب مجاني
            </Link>
            <Link
              to="/register-seller"
              className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold px-8 py-3 rounded-xl transition-colors"
            >
              فتح متجر جديد
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">عندك سؤال؟</h2>
          <p className="text-gray-500 mb-6 max-w-lg mx-auto">
            لو محتاج مساعدة في أي حاجة، الأسئلة الشائعة عندها إجابات لكل استفساراتك
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/faq" className="btn-primary px-6 py-2.5 text-sm">
              الأسئلة الشائعة
            </Link>
            <Link to="/contact" className="btn-outline px-6 py-2.5 text-sm">
              تواصل معنا
            </Link>
            <Link to="/about" className="btn-outline px-6 py-2.5 text-sm">
              عن تسوّق
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default FeaturesPage;
