# Product Requirements Document — تسوّق (Tasawwaq)

**Version:** 1.0.0
**Date:** May 2026
**Status:** Live (MVP)

---

## 1. Product Overview

Tasawwaq is a full-featured Arabic RTL e-commerce marketplace platform connecting buyers, sellers, and administrators in Egypt. It supports three user roles (Customer, Seller, SuperAdmin), guest order tracking, installment payments, FCM push notifications, Google OAuth, social sharing, and comprehensive order/return management.

**Tech Stack:** React 19, Vite 8, Tailwind CSS 4, React Router 7, Axios, Firebase, Recharts, react-helmet-async, Vercel (hosting + Edge Middleware)

**API Backend:** .NET 8 — `https://waleedecommerceapi.runasp.net/api`
**Site URL:** `https://www.tasawwaq.store`

---

## 2. Goals & Objectives

| Goal | Objective |
|------|-----------|
| Marketplace platform | Enable customers to browse, search, and purchase products from multiple sellers |
| Seller empowerment | Allow sellers to create stores, manage products/offers/orders, and receive payouts |
| Admin oversight | Centralized platform management, user moderation, financial review |
| Payment flexibility | Support COD, mobile wallets, bank transfers, and installment plans |
| Trust & transparency | Order tracking, return management, review system, WhatsApp notifications |
| SEO visibility | Server-side OG tags via Vercel Edge Middleware for social crawlers |
| Mobile-first | Responsive RTL design with mobile bottom navigation |

---

## 3. Target Audience

| Segment | Description |
|---------|-------------|
| **Customers** | Egyptian online shoppers wanting a local marketplace with diverse sellers, COD option, and installments |
| **Sellers** | Egyptian merchants/businesses wanting an online storefront with minimal setup |
| **Super Admins** | Platform operators managing the ecosystem, resolving disputes, and monitoring finances |

---

## 4. User Roles & Features

### 4.1 Customer

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| C-01 | Browse products | Product listing with search, category tabs, sort (newest/price/rating/name), pagination | P0 |
| C-02 | Product details | Image gallery, product info, reviews, related products, breadcrumbs | P0 |
| C-03 | Categories | Browse categories with colored cards, breadcrumb schema | P0 |
| C-04 | Offers | Browse active offers (Discount/BOGO), filter by type, countdown timers, share offer | P1 |
| C-05 | Seller stores | View seller storefront with banner, logo, product grid, search within store | P0 |
| C-06 | Cart | Add/remove items, update quantities, clear cart, cart summary | P0 |
| C-07 | Checkout | Full checkout: shipping address, governorate/city, payment method selection, COD/wallets/bank transfer, installment plan selection, seller payment methods | P0 |
| C-08 | Orders | List orders with pagination, view details, order timeline, cancel order, confirm delivery | P0 |
| C-09 | Payment management | View payments, upload receipts (bank transfer/wallet screenshots), track payment status | P0 |
| C-10 | Installments | View installment plan timeline, pay individual installments with receipt upload | P1 |
| C-11 | Returns | Initiate return within 14 days, track return status, ship return back | P0 |
| C-12 | Wishlist | Save products for later, manage wishlist | P1 |
| C-13 | Profile | View/edit name, phone, address, city, country, postal code | P0 |
| C-14 | Auth | Register (email or Google), login, verify email, change password | P0 |
| C-15 | Order tracking | WhatsApp share tracking link, public tracking page (no auth required) | P1 |
| C-16 | Notifications | Push notifications via FCM for order status updates | P2 |

### 4.2 Seller

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| S-01 | Seller registration | Register as seller with store name, description, business email, phone | P0 |
| S-02 | Dashboard | Stats (balance, products, orders, rating), performance charts, recent orders, share store | P0 |
| S-03 | Product management | CRUD products: name, description, price, stock, category, Cloudinary images, active toggle | P0 |
| S-04 | Offer management | CRUD offers: Discount % or BOGO, title, start/end dates, product selection | P1 |
| S-05 | Order management | List orders, update status (processing → shipped → delivered), tracking link, confirm/reject payments | P0 |
| S-06 | Returns | Approve/reject returns, escalate to admin, confirm received, process refund | P0 |
| S-07 | Finance dashboard | Earnings charts, transactions table with filters (type/status/date), transaction details modal | P1 |
| S-08 | Payouts | View balance, request payout (amount, payment method, notes), payout history | P1 |
| S-09 | Shipping zones | CRUD shipping zones (governorate, city, cost, estimated days), bulk import/export | P1 |
| S-10 | Payment methods | Manage own payment methods (VodafoneCash, InstaPay, BankTransfer, etc.) | P0 |
| S-11 | Guest orders | Create orders for walk-in/phone customers with tracking token | P1 |
| S-12 | Profile | Store profile (name, description, logo/banner, business info), payment mode toggle, partial payment toggle | P0 |
| S-13 | Notifications | Push notifications via FCM for new orders | P2 |

### 4.3 Super Admin

| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| A-01 | Dashboard | Stats cards, sales chart (30-day), recent orders, top-selling/rated products | P0 |
| A-02 | Seller management | List/approve/reject/suspend sellers, update commission rate, toggle self-payment mode | P0 |
| A-03 | Category management | CRUD categories | P0 |
| A-04 | Order management | View all orders, update status, manage payments (confirm/reject), manage installments | P0 |
| A-05 | Return management | View all returns (escalated tab), approve/reject, process refund | P0 |
| A-06 | Installment plans | CRUD installment plans (number, fee %, split configuration) | P1 |
| A-07 | User management | List all users, toggle active/inactive | P1 |
| A-08 | Review moderation | Approve/delete product reviews | P1 |
| A-09 | Payouts | Approve/reject seller payout requests, upload payout receipt | P1 |
| A-10 | Payment review | Review pending payment receipts, confirm/reject with reason | P0 |
| A-11 | Platform settings | Manage key-value settings (platform wallet numbers, bank accounts, etc.) | P1 |
| A-12 | Activity logs | View system logs (Create, Update, Delete, Login, Register) | P2 |
| A-13 | Shipping overview | View seller shipping zones by seller | P1 |

---

## 5. Functional Requirements

### 5.1 Authentication & Authorization
- Email/password registration and login
- Google OAuth integration
- Email verification via OTP (6-digit)
- JWT-based authentication with token refresh
- Role-based route guards (Customer, Seller, SuperAdmin)
- Seller sub-status handling (Pending/Approved/Suspended/Rejected)
- Protected routes redirect to login; role violations show 403

### 5.2 Product System
- Products belong to sellers under specific categories
- Cloudinary image upload (unsigned preset)
- Additional images support (array)
- Active/inactive toggle
- Offer merge: active offers displayed with discount badge, offer price, countdown
- `object-cover` for consistent image display

### 5.3 Offer System
- Types: Discount (X% off) and BOGO (Buy X Get Y)
- Offer form: product selection, title, description, start/end dates, type-specific fields
- Edit mode: product selection disabled
- Display: offer price with line-through original, discount badge, BOGO badge, countdown timer
- Share: WhatsApp, Facebook, copy link, native share

### 5.4 Cart & Checkout
- Server-side cart (API-based) with localStorage sync
- Shipping address with governorate/city selection
- Payment methods: CashOnDelivery, VodafoneCash, EtisalatCash, OrangeCash, InstaPay, BankTransfer
- Payment targets: Platform wallet or Seller direct
- Installment plan selection at checkout
- Seller payment method picker
- Validation and error handling

### 5.5 Order Management
- Order statuses: Pending → Processing → ReadyToShip → Shipped → Delivered
- Failure statuses: DeliveryFailed, ReturnedToSeller
- Order timeline component
- Tracking URL per order
- WhatsApp share with formatted message
- Guest order creation by sellers
- Public tracking page (no auth)

### 5.6 Payment System
- Payment statuses: Pending, WaitingConfirmation, Confirmed, Completed, Failed, Refunded
- Receipt upload for wallet/bank transfers
- COD: no receipt upload needed, no Pending payment record created
- Admin payment review queue
- Seller payment confirmation/rejection
- Installment payment: individual installments with due triggers

### 5.7 Return System
- 14-day return window from delivery
- Reasons: Defective, WrongItem, NotAsDescribed, DamagedInShipping, MissingParts, ChangedMind, Other
- Statuses: Pending → Approved/Rejected → Shipped → Received → Refunded/Cancelled/Escalated
- Multi-level: Customer creates → Seller handles → Admin resolves escalated
- Return timeline component
- Image upload for return evidence

### 5.8 Seller Finance
- Earnings charts (yearly breakdown)
- Transactions table with filters (type, status, date range, search, sort)
- Transaction details modal
- Balance display with payout request
- Payout history

### 5.9 Shipping Zones
- Per-seller governorate/city based zones
- Cost and estimated delivery days
- Bulk CSV import/export
- Activate/deactivate toggle

### 5.10 Notification System
- Firebase Cloud Messaging (FCM) push notifications
- Token registration on login, removal on logout
- Foreground message handler with swipeable toast and deep link navigation
- Seller notification polling (pending orders/payments every 30s)
- Admin notification polling

---

## 6. Non-Functional Requirements

### 6.1 Performance
| Metric | Target |
|--------|--------|
| Page load (Vercel edge) | < 2s |
| Build time | < 30s |
| API response (via backend) | < 500ms |
| Image optimization | Cloudinary automatic optimization |
| Chunk size | Code splitting via Vite; largest chunk < 120KB gzip |

### 6.2 SEO
- Vercel Edge Middleware for server-side OG tags (product, seller, category, static pages)
- Crawler detection: Googlebot, Bing, Yandex, Facebook, WhatsApp, Twitter, Telegram, LinkedIn, Slack, Discord, Pinterest
- Proper canonical URLs (`https://www.tasawwaq.store`)
- XML sitemap with 14 static URLs (future: dynamic sitemap via `/api/sitemap`)
- `robots.txt` with proper allow/disallow rules
- Structured data (JSON-LD): WebSite, Organization, WebPage schemas in `index.html`
- SEO component per page via `react-helmet-async` (title, description, keywords, noindex)
- Hreflang alternate tags (`ar_AR`, `en_US`)
- `noindex` on auth pages (login, register, register-seller)

### 6.3 Security
- JWT with refresh token rotation
- Route guards with role-based access
- Axios interceptor for token expiry handling
- Firebase FCM token on secure channel
- Cloudinary unsigned upload (configured to accept only images)
- Input validation on forms
- API calls go through backend (no direct DB access)

### 6.4 Reliability
- Graceful error states (ErrorMessage component with retry)
- Empty states (EmptyState component)
- Loading skeletons (Skeleton loaders for products, offers, tables)
- API timeout handling in middleware (5s AbortSignal)
- 30s cache for offer data in product service

### 6.5 Accessibility
- Arabic RTL layout (`dir="rtl"`)
- Tajawal font optimized for Arabic
- Color contrast for readability
- Responsive design (mobile, tablet, desktop)
- Noscript fallback message

### 6.6 Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (Android Chrome, iOS Safari)
- PWA-ready (manifest.json, service worker)

---

## 7. Technical Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Vercel (CDN + Edge)               │
│  ┌──────────────────────────────────────────────┐   │
│  │         Edge Middleware (middleware.js)        │   │
│  │  - Crawler detection                          │   │
│  │  - OG HTML for /products/:id, /sellers/:slug  │   │
│  │  - OG HTML for /categories/:id, static pages  │   │
│  └──────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────┐   │
│  │         Static SPA (dist/)                    │   │
│  │  - React 19 + Vite 8                          │   │
│  │  - Tailwind CSS 4                             │   │
│  │  - Client-side routing (React Router 7)       │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
                      │ API calls
                      ▼
┌─────────────────────────────────────────────────────┐
│           .NET 8 API (Backend)                       │
│  https://waleedecommerceapi.runasp.net/api           │
│  - Auth, Products, Categories, Sellers               │
│  - Orders, Payments, Installments                    │
│  - Returns, Reviews, Shipping Zones                  │
│  - Payouts, Settings, Notifications                  │
└─────────────────────────────────────────────────────┘
```

**Data Flow:**
1. Browser requests a page → Vercel serves `dist/index.html` (SPA shell)
2. SPA loads → React Router determines route → renders page component
3. Page component calls API service → Axios sends JWT-authenticated request to backend
4. Backend processes request → returns JSON
5. Frontend renders data with loading/error/empty states
6. For crawlers: Edge Middleware intercepts → fetches minimal API data → returns OG HTML

---

## 8. Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.5 | UI framework |
| react-dom | ^19.2.5 | DOM rendering |
| react-router-dom | ^7.14.1 | Client-side routing |
| axios | ^1.15.1 | HTTP client |
| tailwindcss | ^4.2.2 | Utility CSS framework |
| vite | ^8.0.9 | Build tool |
| @vitejs/plugin-react | ^6.0.1 | Vite React plugin |
| @tailwindcss/vite | ^4.2.2 | Tailwind Vite plugin |
| react-helmet-async | ^3.0.0 | Dynamic meta tags |
| react-hot-toast | ^2.6.0 | Toast notifications |
| react-icons | ^5.6.0 | Icon library |
| recharts | ^3.8.1 | Charts |
| firebase | ^12.13.0 | FCM push notifications |
| @react-oauth/google | ^0.13.5 | Google OAuth |
| eslint | ^9.39.4 | Linting |

---

## 9. Deployment

| Aspect | Configuration |
|--------|--------------|
| **Hosting** | Vercel |
| **Build command** | `npm run build` |
| **Output directory** | `dist/` |
| **Framework preset** | Vite |
| **Node version** | ≥ 20.19+ (Vercel auto-provides) |
| **Environment** | Production via `main` branch push |
| **Custom domain** | `www.tasawwaq.store` (CNAME to Vercel) |

---

## 10. Known Limitations & Future Roadmap

### Current Limitations
- No SSR — SPA-only; SEO relies on Vercel Edge Middleware for crawlers
- Static sitemap (14 URLs) — dynamic sitemap requires backend `/api/sitemap` endpoint
- No multi-language support (Arabic-only UI; English alternate in OG tags only)
- No PWA service worker for offline support
- No bundle analysis/size optimization
- No E2E tests

### Future Enhancements
| Feature | Priority | Notes |
|---------|----------|-------|
| Dynamic sitemap from backend API | High | Include all products, sellers, categories |
| Extend Edge Middleware with body content | Medium | Currently returns empty `<body>` |
| PWA with service worker | Medium | Offline support, install prompt |
| Bundle optimization | Low | Code splitting analysis, lazy loading audit |
| E2E testing | Low | Playwright or Cypress |
| Multi-language (EN) | Low | i18n library integration |

---

## 11. Glossary

| Term | Definition |
|------|------------|
| BOGO | Buy One Get One — offer type where buying X items gives Y free |
| COD | Cash On Delivery — pay on receipt |
| FCM | Firebase Cloud Messaging — push notification service |
| OG | Open Graph — meta tags for social sharing previews |
| OTP | One-Time Password — email verification code |
| PWA | Progressive Web App — installable web application |
| RTL | Right-To-Left — text direction for Arabic |
| SPA | Single Page Application — client-side rendered app |
| SSR | Server-Side Rendering — server generates HTML per request |
