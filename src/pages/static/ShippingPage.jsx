import { Link } from 'react-router-dom';
import { FiTruck, FiClock, FiMapPin, FiPackage, FiDollarSign, FiCheckCircle } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';

const ShippingPage = () => {
  const shippingZones = [
    { zone: 'القاهرة الكبرى', cities: 'القاهرة، الجيزة، القليوبية', duration: '2-3 أيام', cost: '30 ج.م' },
    { zone: 'الإسكندرية', cities: 'الإسكندرية، البحيرة', duration: '2-4 أيام', cost: '40 ج.م' },
    { zone: 'دلتا مصر', cities: 'الدقهلية، الغربية، الشرقية، المنوفية، كفر الشيخ، دمياط', duration: '3-5 أيام', cost: '50 ج.م' },
    { zone: 'قناة السويس وسيناء', cities: 'الإسماعيلية، السويس، بورسعيد، شمال وجنوب سيناء', duration: '3-5 أيام', cost: '60 ج.م' },
    { zone: 'الصعيد', cities: 'الفيوم، بني سويف، المنيا، أسيوط، سوهاج، قنا، الأقصر، أسوان', duration: '4-7 أيام', cost: '70 ج.م' },
    { zone: 'البحر الأحمر والوادي الجديد', cities: 'البحر الأحمر، الوادي الجديد، مرسى مطروح', duration: '5-7 أيام', cost: '80 ج.م' },
  ];

  const features = [
    { icon: FiCheckCircle, title: 'تتبع الطلب', desc: 'تابع طلبك خطوة بخطوة من لحظة الشحن حتى الاستلام' },
    { icon: FiPackage, title: 'تغليف آمن', desc: 'نغلف منتجاتك بعناية لضمان وصولها بحالة ممتازة' },
    { icon: FiDollarSign, title: 'دفع عند الاستلام', desc: 'ادفع نقداً عند استلام طلبك بدون أي رسوم إضافية' },
    { icon: FiClock, title: 'شحن سريع', desc: 'نسعى لتوصيل طلبك في أسرع وقت ممكن' },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://tasawwaq.store' },
      { '@type': 'ListItem', position: 2, name: 'الشحن والتوصيل', item: 'https://tasawwaq.store/shipping' },
    ],
  };

  return (
    <>
      <SEO
        title="الشحن والتوصيل"
        description="معلومات الشحن والتوصيل على تسوّق - تكاليف الشحن، مدة التوصيل لكل المحافظات المصرية، وسياسة الشحن."
        keywords="الشحن, التوصيل, شحن لكل مصر, مدة التوصيل, تكلفة الشحن, دفع عند الاستلام"
        url="/shipping"
        structuredData={breadcrumbSchema}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'الشحن والتوصيل' }]} />

        {/* Hero */}
        <section className="text-center mb-12 py-12 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl">
          <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTruck className="text-white" size={32} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold mb-3">الشحن والتوصيل</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نوصّل منتجاتك بأمان وسرعة لكل محافظات مصر بأفضل الأسعار
          </p>
        </section>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">مميزات خدمة الشحن</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <article key={idx} className="bg-white border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-green-600" size={24} aria-hidden="true" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.desc}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* Shipping Zones Table */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">مناطق الشحن والأسعار</h2>
            <p className="text-gray-500">تكلفة ومدة الشحن لكل محافظات مصر</p>
          </div>

          <div className="overflow-x-auto bg-white border rounded-xl">
            <table className="w-full text-right">
              <caption className="sr-only">جدول مناطق الشحن والأسعار في مصر</caption>
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold text-gray-800">المنطقة</th>
                  <th scope="col" className="px-6 py-4 font-bold text-gray-800 hidden md:table-cell">المحافظات</th>
                  <th scope="col" className="px-6 py-4 font-bold text-gray-800">مدة التوصيل</th>
                  <th scope="col" className="px-6 py-4 font-bold text-gray-800">التكلفة</th>
                </tr>
              </thead>
              <tbody>
                {shippingZones.map((zone, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-800 flex items-center gap-2">
                      <FiMapPin className="text-green-600" size={16} aria-hidden="true" />
                      {zone.zone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{zone.cities}</td>
                    <td className="px-6 py-4 text-sm">{zone.duration}</td>
                    <td className="px-6 py-4 font-bold text-green-600">{zone.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-500 mt-4 text-center">
            <span aria-hidden="true">💡</span> الأسعار تقريبية وقد تختلف حسب وزن وحجم المنتج
          </p>
        </section>

        {/* Free Shipping Banner */}
        <section className="mb-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white text-center">
          <div className="text-5xl mb-3" aria-hidden="true">🚚</div>
          <h2 className="text-3xl font-bold mb-3">شحن مجاني!</h2>
          <p className="text-green-50 max-w-2xl mx-auto">
            احصل على شحن مجاني لطلباتك التي تتجاوز <strong>1000 ج.م</strong> لأي محافظة في مصر
          </p>
        </section>

        {/* Process */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10">كيف تتم عملية الشحن؟</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'تأكيد الطلب', desc: 'بعد إتمام الطلب، يتم تأكيده فوراً' },
              { step: '2', title: 'تجهيز الطلب', desc: 'البائع يجهز ويغلف المنتج بعناية' },
              { step: '3', title: 'الشحن', desc: 'نسلّم المنتج لشركة الشحن' },
              { step: '4', title: 'التوصيل', desc: 'وصول المنتج لباب بيتك' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section className="mb-16 bg-yellow-50 border-r-4 border-yellow-400 p-6 rounded-lg">
          <h2 className="font-bold text-lg mb-3">
            <span aria-hidden="true">📝</span> ملاحظات مهمة
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• مدة التوصيل تُحسب بأيام العمل (السبت - الخميس)</li>
            <li>• في حالة عدم وجودك عند التوصيل، سيتم التواصل معك لتحديد موعد آخر</li>
            <li>• يمكنك تتبع طلبك من صفحة "طلباتي" في حسابك</li>
            <li>• في حال وصول المنتج تالفاً، يحق لك رفض الاستلام</li>
            <li>• الشحن متوفر لكل محافظات مصر بدون استثناء</li>
          </ul>
        </section>

        {/* CTA */}
        <section className="text-center bg-gray-50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-4">جاهز تطلب؟</h2>
          <p className="text-gray-600 mb-6">
            تصفّح آلاف المنتجات واحصل على توصيل سريع لباب بيتك
          </p>
          <Link to="/products" className="btn-primary px-8 py-3">
            تسوّق الآن
          </Link>
        </section>
      </div>
    </>
  );
};

export default ShippingPage;