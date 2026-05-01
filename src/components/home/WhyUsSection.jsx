const WhyUsSection = () => {
  const features = [
    {
      icon: '🚚',
      title: 'شحن سريع',
      description: 'توصيل سريع لجميع المحافظات في مصر',
    },
    {
      icon: '🔒',
      title: 'دفع آمن',
      description: 'طرق دفع متعددة وآمنة 100%',
    },
    {
      icon: '🔄',
      title: 'إرجاع سهل',
      description: 'سياسة إرجاع مرنة خلال 14 يوم',
    },
    {
      icon: '💬',
      title: 'دعم فني',
      description: 'فريق دعم متاح على مدار الساعة',
    },
  ];

  return (
    <section
      className="py-12 bg-gray-100"
      aria-labelledby="why-us-section-title"
    >
      <div className="max-w-7xl mx-auto px-4">
        <h2
          id="why-us-section-title"
          className="text-2xl font-bold text-center mb-8"
        >
          <span aria-hidden="true">💪</span> لماذا تختارنا
        </h2>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          role="list"
        >
          {features.map((feature, index) => (
            <article
              key={index}
              className="bg-white rounded-xl p-6 text-center"
              role="listitem"
            >
              <span className="text-4xl mb-3 block" aria-hidden="true">
                {feature.icon}
              </span>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;