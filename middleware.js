const API_BASE = 'https://waleedecommerceapi.runasp.net/api';
const SITE_URL = 'https://tasawwaq.store';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.png`;

const CRAWLER_PATTERN = /WhatsApp|FacebookExternalHit|Facebot|Twitterbot|TelegramBot|LinkedInBot|Slackbot|Discordbot|Pinterest|Googlebot|facebook|telegram|twitter|linkedin/i;

const ogHtml = (title, description, imageUrl, url, type = 'website') => `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />

  <meta property="og:type" content="${type}" />
  <meta property="og:site_name" content="تسوّق" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${url}" />
  <meta property="og:locale" content="ar_EG" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <meta http-equiv="refresh" content="0;url=${url}" />
  <script>window.location.href = '${url}';</script>
</head>
<body></body>
</html>`;

export const config = {
  matcher: ['/sellers/:path*', '/products/:path*'],
};

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  if (!CRAWLER_PATTERN.test(userAgent)) return;

  const { pathname } = new URL(request.url);

  if (pathname.startsWith('/sellers/')) {
    return handleSellerPage(pathname);
  }

  if (pathname.startsWith('/products/')) {
    return handleProductPage(pathname);
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
    const imageUrl = product.images?.[0] || product.imageUrl || DEFAULT_IMAGE;
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

function respond(html) {
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
