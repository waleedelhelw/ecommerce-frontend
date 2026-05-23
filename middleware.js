const API_BASE = 'https://waleedecommerceapi.runasp.net/api';
const SITE_URL = 'https://www.tasawwaq.store';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.jpg`;

const CRAWLER_PATTERN = /WhatsApp|FacebookExternalHit|Facebot|Twitterbot|TelegramBot|LinkedInBot|Slackbot|Discordbot|Pinterest|Googlebot|facebook|telegram|twitter|linkedin|bingbot|bing|yandex|duckduckbot|baiduspider/i;

const esc = (s) => {
  if (typeof s !== 'string') return '';
  return s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, ' ');
};

const ogHtml = (title, description, imageUrl, url, type = 'website') => {
  const t = esc(title);
  const d = esc(description);
  const i = esc(imageUrl);
  const u = esc(url);
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t}</title>
  <meta name="description" content="${d}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:site_name" content="تسوّق" />
  <meta property="og:title" content="${t}" />
  <meta property="og:description" content="${d}" />
  <meta property="og:image" content="${i}" />
  <meta property="og:image:secure_url" content="${i}" />
  <meta property="og:url" content="${u}" />
  <meta property="og:locale" content="ar_EG" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${t}" />
  <meta name="twitter:description" content="${d}" />
  <meta name="twitter:image" content="${i}" />
</head>
<body></body>
</html>`;
};

const PAGE_META = {
  '/products': { title: 'المنتجات | تسوّق', description: 'تصفح آلاف المنتجات في مختلف الأقسام على تسوّق - أفضل الأسعار والجودة' },
  '/categories': { title: 'الأقسام | تسوّق', description: 'تصفح الأقسام المختلفة وابحث عن ما يناسبك على تسوّق' },
  '/sellers': { title: 'المتاجر | تسوّق', description: 'اكتشف متاجر متنوعة واشترِ من أفضل البائعين على تسوّق' },
  '/offers': { title: 'العروض | تسوّق', description: 'أفضل العروض والتخفيضات - وفر كثيراً على مشترياتك من تسوّق' },
  '/about': { title: 'معلومات عنا | تسوّق', description: 'تعرف على منصة تسوّق - سوق مفتوح للبيع والشراء في مصر' },
  '/contact': { title: 'اتصل بنا | تسوّق', description: 'تواصل مع فريق تسوّق - نحن هنا لمساعدتك' },
  '/faq': { title: 'الأسئلة الشائعة | تسوّق', description: 'إجابات على الأسئلة الشائعة حول التسوق والبيع على تسوّق' },
  '/privacy': { title: 'سياسة الخصوصية | تسوّق', description: 'سياسة الخصوصية لمنصة تسوّق' },
  '/terms': { title: 'الشروط والأحكام | تسوّق', description: 'الشروط والأحكام لمنصة تسوّق' },
  '/shipping': { title: 'سياسة الشحن | تسوّق', description: 'تعرف على سياسة الشحن والتوصيل على تسوّق' },
  '/return-policy': { title: 'سياسة الإرجاع | تسوّق', description: 'سياسة الإرجاع والاستبدال على تسوّق' },
  '/how-to-sell': { title: 'كيف تبيع | تسوّق', description: 'تعلم كيف تبيع منتجاتك على تسوّق وافتح متجرك الخاص' },
};

export const config = {
  matcher: ['/products', '/products/:path*', '/categories', '/categories/:path*', '/sellers', '/sellers/:path*', '/offers', '/offers/:path*', '/about', '/contact', '/faq', '/privacy', '/terms', '/shipping', '/return-policy', '/how-to-sell'],
};

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  if (!CRAWLER_PATTERN.test(userAgent)) return;

  const { pathname } = new URL(request.url);

  if (pathname.startsWith('/products/') && pathname !== '/products') {
    return handleProductPage(pathname);
  }

  if (pathname.startsWith('/sellers/') && pathname !== '/sellers') {
    return handleSellerPage(pathname);
  }

  if (pathname.startsWith('/categories/')) {
    return handleCategoryPage(pathname);
  }

  const meta = PAGE_META[pathname];
  if (meta) {
    return respond(ogHtml(meta.title, meta.description, DEFAULT_IMAGE, `${SITE_URL}${pathname}`));
  }
}

async function handleSellerPage(pathname) {
  const slug = pathname.replace(/^\/sellers\//, '');
  if (!slug) return;

  const isNumeric = /^\d+$/.test(slug);
  const endpoint = isNumeric
    ? `${API_BASE}/customer/sellers/${slug}`
    : `${API_BASE}/customer/sellers/by-slug/${slug}`;

  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return;

    const body = await res.json();
    const seller = body?.data || body;
    if (!seller || !seller.storeName) return;

    const storeName = seller.storeName;
    const description = seller.storeDescription
      ? seller.storeDescription.substring(0, 160).trim()
      : `زُر متجر ${storeName} على تسوّق`;
    const imageUrl = seller.logoUrl || seller.bannerUrl || DEFAULT_IMAGE;
    const url = `${SITE_URL}/sellers/${slug}`;

    return respond(ogHtml(
      `متجر ${storeName} | تسوّق`,
      description,
      imageUrl,
      url
    ));
  } catch {
    return;
  }
}

async function handleProductPage(pathname) {
  const id = pathname.replace(/^\/products\//, '');
  if (!id || !/^\d+$/.test(id)) return;

  try {
    const res = await fetch(`${API_BASE}/customer/products/${id}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return;

    const body = await res.json();
    const product = body?.data || body;
    if (!product || !product.name) return;

    const title = product.name;
    const description = product.description
      ? product.description.replace(/<[^>]*>/g, '').substring(0, 160).trim()
      : `اشترِ ${product.name} على تسوّق`;
    const rawImage = product.images?.[0];
    const imageUrl = product.imageUrl || (typeof rawImage === 'string' ? rawImage : rawImage?.imageUrl) || DEFAULT_IMAGE;
    const url = `${SITE_URL}/products/${id}`;

    return respond(ogHtml(
      `${title} | تسوّق`,
      description,
      imageUrl,
      url,
      'product'
    ));
  } catch {
    return;
  }
}

async function handleCategoryPage(pathname) {
  const parts = pathname.replace(/^\/categories\//, '').split('/');
  const id = parts[0];
  if (!id || !/^\d+$/.test(id)) return;

  try {
    const res = await fetch(`${API_BASE}/customer/categories/${id}`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return;

    const body = await res.json();
    const category = body?.data || body;
    if (!category || !category.name) return;

    const name = category.name;
    const url = `${SITE_URL}/categories/${id}/products`;

    return respond(ogHtml(
      `${name} | تسوّق`,
      `تصفح منتجات قسم ${name} على تسوّق - أفضل الأسعار والجودة`,
      category.imageUrl || DEFAULT_IMAGE,
      url
    ));
  } catch {
    return;
  }
}

function respond(html) {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(html);
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Length': String(bytes.length),
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}
