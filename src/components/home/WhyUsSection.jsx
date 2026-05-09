import { FiTruck, FiShield, FiRefreshCw, FiHeadphones, FiDollarSign, FiGift } from 'react-icons/fi';

const features = [
  {
    icon: FiTruck,
    title: 'شحن سريع',
    description: 'توصيل سريع لجميع المحافظات في مصر خلال 3-7 أيام عمل',
    gradient: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/20',
  },
  {
    icon: FiShield,
    title: 'دفع آمن',
    description: 'طرق دفع متعددة وآمنة 100% مع تشفير كامل لبياناتك',
    gradient: 'from-purple-500 to-pink-500',
    shadow: 'shadow-purple-500/20',
  },
  {
    icon: FiRefreshCw,
    title: 'إرجاع سهل',
    description: 'سياسة إرجاع مرنة خلال 14 يوم مع استرداد كامل للمبلغ',
    gradient: 'from-green-500 to-emerald-500',
    shadow: 'shadow-green-500/20',
  },
  {
    icon: FiHeadphones,
    title: 'دعم فني',
    description: 'فريق دعم متاح على مدار الساعة للرد على استفساراتك',
    gradient: 'from-orange-500 to-red-500',
    shadow: 'shadow-orange-500/20',
  },
  {
    icon: FiDollarSign,
    title: 'أفضل الأسعار',
    description: 'نضمن لك أفضل الأسعار في السوق مع عروض وتخفيضات مستمرة',
    gradient: 'from-indigo-500 to-purple-500',
    shadow: 'shadow-indigo-500/20',
  },
  {
    icon: FiGift,
    title: 'عروض حصرية',
    description: 'عروض وخصومات حصرية لأولياء الأمور والعملاء الجدد',
    gradient: 'from-pink-500 to-rose-500',
    shadow: 'shadow-pink-500/20',
  },
];

const WhyUsSection = () => {
  return (
    <section
      className="py-10 sm:py-16 bg-white"
      aria-labelledby="why-us-section-title"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-purple-600 bg-purple-50 border border-purple-200 px-3 py-1 rounded-full">
            لماذا تختارنا
          </span>
          <h2
            id="why-us-section-title"
            className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-3"
          >
            نقدم لك أفضل تجربة تسوق
          </h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            نحن نهتم بتجربتك ونعمل على توفير أفضل الخدمات لضمان رضاك التام
          </p>
        </div>

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          role="list"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <article
                key={index}
                className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-gray-100 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                role="listitem"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-5 shadow-sm ${feature.shadow} group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                  <Icon size={24} className="text-white" aria-hidden="true" />
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <div className="absolute -bottom-6 -left-6 w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-transparent pointer-events-none" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
