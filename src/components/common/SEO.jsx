import { Helmet } from 'react-helmet-async';

/**
 * ✅ مكون SEO موحّد للصفحات
 *
 * @param {string} title - عنوان الصفحة (سيُضاف "تسوّق" تلقائياً)
 * @param {string} description - وصف الصفحة (150-160 حرف)
 * @param {string} keywords - كلمات مفتاحية مفصولة بفواصل
 * @param {string} image - رابط الصورة (يفضل 1200x630)
 * @param {string} url - الرابط الكامل للصفحة
 * @param {string} type - نوع الصفحة (website / article / product)
 * @param {boolean} noindex - منع الفهرسة (للصفحات الخاصة)
 * @param {object} structuredData - JSON-LD Schema (اختياري)
 */
const SEO = ({
  title,
  description = 'تسوّق - سوق مفتوح للبيع والشراء',
  keywords = 'تسوق, متجر الكتروني, شراء, بيع, تسوق اونلاين',
  image = '/og-image.png',
  url,
  type = 'website',
  noindex = false,
  structuredData = null,
}) => {
  const SITE_URL = 'https://tasawwaq.store';
  const SITE_NAME = 'تسوّق';

  // ✅ Title formatting
  const fullTitle = title
    ? title.includes('تسوّق') ? title : `${title} | ${SITE_NAME}`
    : SITE_NAME;

  // ✅ Image URL
  const fullImageUrl = image?.startsWith('http')
    ? image
    : `${SITE_URL}${image}`;

  // ✅ Page URL
  const fullUrl = url
    ? url.startsWith('http') ? url : `${SITE_URL}${url}`
    : SITE_URL;

  return (
    <Helmet>
      {/* ✅ Basic Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* ✅ Robots */}
      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow" />
      )}

      {/* ✅ Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:type" content={fullImageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg'} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="ar_EG" />

      {/* ✅ Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />

      {/* ✅ Structured Data (JSON-LD) */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEO;