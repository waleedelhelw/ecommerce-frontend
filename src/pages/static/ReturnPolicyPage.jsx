import { Link } from 'react-router-dom';
import { FiRefreshCw, FiCheckCircle, FiXCircle, FiClock, FiPackage, FiDollarSign } from 'react-icons/fi';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';

const ReturnsPolicyPage = () => {
  const eligibleItems = [
    'المنتجات في حالتها الأصلية وغير مستخدمة',
    'المنتجات بالتغليف الأصلي والملحقات',
    'المنتجات التي وصلت تالفة أو معيبة',
    'المنتجات التي لا تطابق الوصف',
    'الملابس والأحذية بالتاجات الأصلية',
  ];

  const ineligibleItems = [
    'المنتجات الشخصية (ملابس داخلية، مستحضرات تجميل مفتوحة)',
    'المنتجات المخصصة أو المصنوعة حسب الطلب',
    'المنتجات الغذائية والقابلة للتلف',
    'المنتجات الرقمية والاشتراكات',
    'المنتجات بعد مرور 14 يوم من الاستلام',
  ];

  const refundMethods = [
    { method: 'الدفع عند الاستلام', time: '7-14 يوم عمل', desc: 'تحويل بنكي للحساب المسجل' },
    { method: 'بطاقة ائتمانية', time: '5-10 أيام عمل', desc: 'استرداد على نفس البطاقة' },
    { method: 'محفظة إلكترونية', time: '3-7 أيام عمل', desc: 'استرداد على نفس المحفظة' },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://tasawwaq.store' },
      { '@type': 'ListItem', position: 2, name: 'سياسة الإرجاع', item: 'https://tasawwaq.store/returns' },
    ],
  };

  return (
    <>
      <SEO
        title="سياسة الإرجاع والاستبدال"
        description="سياسة الإرجاع على تسوّق - 3 ايام لإرجاع المنتجات. تعرّف على شروط الإرجاع وطرق استرداد المبلغ."
        keywords="سياسة الإرجاع, إرجاع المنتجات, استبدال, استرداد المبلغ, حق الإرجاع, تسوق"
        url="/returns"
        structuredData={breadcrumbSchema}
      />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'سياسة الإرجاع' }]} />

        {/* Hero */}
        <section className="text-center mb-12 py-12 bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl">
          <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiRefreshCw className="text-white" size={32} aria-hidden="true" />
          </div>
          <h1 className="text-4xl font-bold mb-3">سياسة الإرجاع والاستبدال</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            راحتك أولويتنا - لديك 3 ايام لإرجاع المنتج لو ما عجبكش
          </p>
        </section>

        {/* Quick Info */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <article className="bg-white border rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiClock className="text-blue-600" size={28} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold mb-2">3 ايام</h2>
            <p className="text-sm text-gray-600">من تاريخ الاستلام لإرجاع المنتج</p>
          </article>

          <article className="bg-white border rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPackage className="text-green-600" size={28} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold mb-2">إرجاع مجاني</h2>
            <p className="text-sm text-gray-600">في حالة عيب المنتج أو خطأ في الشحن</p>
          </article>

          <article className="bg-white border rounded-xl p-6 text-center">
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiDollarSign className="text-purple-600" size={28} aria-hidden="true" />
            </div>
            <h2 className="text-xl font-bold mb-2">استرداد سريع</h2>
            <p className="text-sm text-gray-600">استرداد المبلغ خلال 7-14 يوم عمل</p>
          </article>
        </section>

        {/* How to Return */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-2">كيف ترجع منتج؟</h2>
          <p className="text-center text-gray-500 mb-10">4 خطوات بسيطة لإرجاع طلبك</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'ادخل على طلباتي', desc: 'من حسابك، اختر الطلب اللي عاوز ترجعه' },
              { step: '2', title: 'اطلب الإرجاع', desc: 'اضغط على "طلب إرجاع" واختر السبب' },
              { step: '3', title: 'مندوب يستلم المنتج', desc: 'هنبعت مندوب لاستلام المنتج خلال 2-3 أيام' },
              { step: '4', title: 'استرداد المبلغ', desc: 'بعد الفحص، يتم استرداد المبلغ' },
            ].map((item) => (
              <article key={item.step} className="bg-white border rounded-xl p-6 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  {item.step}
                </div>
                <h3 className="font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Eligible vs Not Eligible */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* Eligible */}
          <article className="bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-green-800">
              <FiCheckCircle size={24} aria-hidden="true" />
              منتجات يمكن إرجاعها
            </h2>
            <ul className="space-y-3">
              {eligibleItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <FiCheckCircle className="text-green-600 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* Not Eligible */}
          <article className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-800">
              <FiXCircle size={24} aria-hidden="true" />
              منتجات لا يمكن إرجاعها
            </h2>
            <ul className="space-y-3">
              {ineligibleItems.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <FiXCircle className="text-red-600 flex-shrink-0 mt-0.5" size={16} aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>

        {/* Refund Methods */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-2">طرق استرداد المبلغ</h2>
          <p className="text-center text-gray-500 mb-10">المبلغ يتم استرداده بنفس طريقة الدفع الأصلية</p>

          <div className="overflow-x-auto bg-white border rounded-xl">
            <table className="w-full text-right">
              <caption className="sr-only">جدول طرق استرداد المبلغ على تسوّق</caption>
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold text-gray-800">طريقة الدفع الأصلية</th>
                  <th scope="col" className="px-6 py-4 font-bold text-gray-800">مدة الاسترداد</th>
                  <th scope="col" className="px-6 py-4 font-bold text-gray-800 hidden md:table-cell">طريقة الاسترداد</th>
                </tr>
              </thead>
              <tbody>
                {refundMethods.map((item, idx) => (
                  <tr key={idx} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold text-gray-800">{item.method}</td>
                    <td className="px-6 py-4 text-sm text-orange-600 font-medium">{item.time}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{item.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Important Notes */}
        <section className="mb-12 bg-yellow-50 border-r-4 border-yellow-400 p-6 rounded-lg">
          <h2 className="font-bold text-lg mb-3">
            <span aria-hidden="true">⚠️</span> شروط مهمة للإرجاع
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li>• المنتج يجب أن يكون في حالته الأصلية وغير مستخدم</li>
            <li>• الاحتفاظ بالتغليف الأصلي وكل الملحقات والإكسسوارات</li>
            <li>• إرفاق فاتورة الشراء أو رقم الطلب</li>
            <li>• في حالة الإرجاع لتغيير الرأي، تكلفة الشحن على المشتري</li>
            <li>• في حالة عيب المنتج، الإرجاع مجاني تماماً</li>
            <li>• يحق لنا رفض الإرجاع لو كان المنتج مستخدم أو تالف بسبب سوء الاستخدام</li>
          </ul>
        </section>

        {/* Damaged Item */}
        <section className="mb-12 bg-red-50 border-2 border-red-200 rounded-xl p-6 lg:p-8">
          <h2 className="text-2xl font-bold mb-4 text-red-800">
            <span aria-hidden="true">📦</span> وصلني منتج تالف أو خطأ، أعمل إيه؟
          </h2>
          <p className="text-gray-700 mb-4">
            في حالة وصول منتج تالف أو معيب أو غير مطابق للوصف:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-gray-700 text-sm mr-4">
            <li>صوّر المنتج فوراً (قبل ما تفك التغليف لو ممكن)</li>
            <li>تواصل معنا خلال 48 ساعة من الاستلام</li>
            <li>هنرسل مندوب لاستلام المنتج بدون رسوم</li>
            <li>هتاخد المنتج البديل أو يتم استرداد المبلغ كامل</li>
          </ol>
        </section>

        {/* CTA */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="bg-orange-500 hover:bg-orange-600 text-white p-6 rounded-xl text-center transition-colors"
          >
            <h3 className="text-xl font-bold mb-2">عاوز ترجع منتج؟</h3>
            <p className="text-orange-100 text-sm">روح لطلباتي وقدم طلب إرجاع</p>
          </Link>
          <Link
            to="/contact"
            className="bg-gray-800 hover:bg-gray-900 text-white p-6 rounded-xl text-center transition-colors"
          >
            <h3 className="text-xl font-bold mb-2">محتاج مساعدة؟</h3>
            <p className="text-gray-300 text-sm">تواصل معنا وفريقنا هيساعدك</p>
          </Link>
        </section>
      </div>
    </>
  );
};

export default ReturnsPolicyPage;