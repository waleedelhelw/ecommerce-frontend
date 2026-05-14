const API_BASE = 'https://waleedecommerceapi.runasp.net/api';
const SITE_URL = 'https://tasawwaq.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/og-image.svg`;

const CRAWLER_PATTERN = /WhatsApp|FacebookExternalHit|Facebot|Twitterbot|TelegramBot|LinkedInBot|Slackbot|Discordbot|Pinterest|Googlebot|facebook|telegram|twitter|linkedin/i;

export const config = {
  matcher: '/sellers/:path*',
};

export default async function middleware(request) {
  const userAgent = request.headers.get('user-agent') || '';
  if (!CRAWLER_PATTERN.test(userAgent)) return;

  const { pathname } = new URL(request.url);
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

    return new Response(
      `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>متجر ${storeName} | تسوّق</title>
  <meta name="description" content="${description}" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="تسوّق" />
  <meta property="og:title" content="متجر ${storeName} | تسوّق" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:url" content="${url}" />
  <meta property="og:locale" content="ar_EG" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="متجر ${storeName} | تسوّق" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${imageUrl}" />

  <meta http-equiv="refresh" content="0;url=${url}" />
  <script>window.location.href = '${url}';</script>
</head>
<body></body>
</html>`,
      {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'public, max-age=3600, s-maxage=3600',
        },
      }
    );
  } catch {
    return;
  }
}
