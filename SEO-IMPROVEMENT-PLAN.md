# SEO Improvement Plan — Tasawwaq Store

## Stage 1 — Fix Sitemap & Vercel Config (Urgent)

### Steps
1. Split the current `public/sitemap.xml` (which is a Vercel JSON config, not a real sitemap):
   - Move the Vercel route/header config INSIDE `vercel.json` (merge it)
   - Convert `public/sitemap.xml` to a real XML sitemap with all static URLs
   
2. For dynamic URLs (products, categories, sellers), add a backend endpoint:
   - `/api/sitemap` returns XML with all dynamic URLs
   - `vercel.json` proxies `/sitemap.xml` → `/api/sitemap` for static, or
   - Use a build-time script to generate the full sitemap

3. Update `public/robots.txt`:
   - Sitemap URL is already there ✅ (just needs to work after fix)

4. Submit new sitemap in Google Search Console

### Files affected
- `vercel.json` — merge rules from current `sitemap.xml`
- `public/sitemap.xml` — replace with real XML
- Backend — add `/api/sitemap` endpoint (optional if using build-time)

---

## Stage 2 — Core Web Vitals & Performance

### Steps
1. Image optimization:
   - Add `loading="lazy"` to all product/category images
   - Add `width` & `height` attributes to prevent CLS
   - Convert to WebP format (Cloudinary can do this)
   
2. Code splitting:
   - Lazy load seller/admin routes (not needed for initial page load)

3. Add `<link rel="preload">` for:
   - Arabic fonts
   - OG image
   - Critical CSS

4. Check Google PageSpeed Insights & fix any red flags

### Files affected
- `src/components/product/ProductCard.jsx` — add lazy loading
- `src/components/product/ProductGrid.jsx` — add lazy loading
- `index.html` — add preload links
- `src/router.jsx` — add `React.lazy()` for heavy routes

---

## Stage 3 — Search Console & Indexing

### Steps
1. Verify Google Search Console access (meta tag is there ✅)
2. Submit sitemap after Stage 1 is done
3. Monitor index coverage for 1-2 weeks
4. Fix any indexing errors found
5. Request re-indexing for high-priority pages

### Files affected
- None (monitoring only)

---

## Stage 4 — Content & On-Page SEO

### Steps
1. Home page improvements:
   - Better H1 with keywords
   - Intro paragraph describing what Tasawwaq is
   - Links to popular categories/products
   
2. Category pages:
   - Add category descriptions (SEO-friendly)
   - Internal links to subcategories
   
3. Seller store pages:
   - Unique meta descriptions per seller
   - Add seller description to store page

4. Static pages:
   - Update "About" page with rich content
   - Update "How to Sell" with detailed guide
   - Each page should be at least 300 words of unique content

### Files affected
- `src/pages/customer/HomePage.jsx`
- `src/pages/customer/CategoryProductsPage.jsx` (add description)
- `src/pages/customer/SellerStorePage.jsx` (add description)
- `src/pages/static/AboutPage.jsx`
- `src/pages/static/HowToSellPage.jsx`

---

## Stage 5 — Off-Page & Monitoring

### Steps
1. Register on:
   - Google Business Profile
   - Business directories (yellowpages.eg, etc.)
   - Social media (Facebook, Instagram, Twitter/X)
   
2. Enable social sharing buttons:
   - WhatsApp share on product pages
   - Facebook/Twitter share buttons
   
3. Set up monthly SEO monitoring:
   - Google Search Console (index status)
   - Google Analytics (organic traffic)
   - PageSpeed Insights (Core Web Vitals)
   - Rank tracking for top keywords

### Files affected
- `src/pages/customer/ProductDetailsPage.jsx` — add social share buttons (already has WhatsApp)
- Backlink building (external)

---

## Quick Wins (Do in 1 day)

| Task | Time | Impact |
|------|------|--------|
| Fix sitemap.xml + Vercel merge | 30 min | HIGH |
| Add lazy loading to images | 15 min | MEDIUM |
| Add width/height to images | 15 min | MEDIUM |
| Better H1 on homepage | 10 min | MEDIUM |
| Category descriptions | 20 min | MEDIUM |
| Submit sitemap to Google SC | 5 min | HIGH |

## Long-term

| Task | Timeline |
|------|----------|
| Backlink building | 3-6 months |
| Content creation (blog/articles) | Ongoing |
| Monitor & iterate | Monthly |
