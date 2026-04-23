const WhyUsSection = () => {
  const features = [
    {
      icon: '🚚',
      title: 'شحن سريع',
      description: 'توصيل سريع لجميع المحافظات',
    },
    {
      icon: '🔒',
      title: 'دفع آمن',
      description: 'طرق دفع متعددة وآمنة',
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
    <section className="py-12 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-center mb-8">💪 لماذا تختارنا</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 text-center">
              <span className="text-4xl mb-3 block">{feature.icon}</span>
              <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;