import { Link } from 'react-router-dom';
import { FiChevronLeft, FiHome } from 'react-icons/fi';

/**
 * ✅ مكون Breadcrumb محسّن للـ SEO و Accessibility
 *
 * @param {Array} items - قائمة العناصر [{ label, link }]
 * @param {boolean} showHome - إظهار رابط الرئيسية تلقائياً (افتراضي: true)
 *
 * مثال الاستخدام:
 * <Breadcrumb items={[
 *   { label: 'المنتجات', link: '/products' },
 *   { label: product.name }
 * ]} />
 */
const Breadcrumb = ({ items = [], showHome = true }) => {
  // ✅ إضافة الرئيسية تلقائياً لو مش موجودة
  const breadcrumbItems =
    showHome && items[0]?.link !== '/'
      ? [{ label: 'الرئيسية', link: '/', isHome: true }, ...items]
      : items;

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav
      aria-label="مسار التنقل"
      className="mb-6 overflow-x-auto scrollbar-hide"
    >
      <ol className="flex items-center gap-2 text-sm flex-nowrap min-w-0">
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1;

          return (
            <li
              key={index}
              className="flex items-center gap-2 flex-shrink-0"
            >
              {/* ✅ السهم بين العناصر */}
              {index > 0 && (
                <FiChevronLeft
                  size={14}
                  className="text-gray-400 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {/* ✅ العنصر نفسه */}
              {item.link && !isLast ? (
                <Link
                  to={item.link}
                  className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap"
                >
                  {item.isHome && (
                    <FiHome size={14} aria-hidden="true" />
                  )}
                  <span>{item.label}</span>
                </Link>
              ) : (
                <span
                  className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-[300px]"
                  aria-current="page"
                  title={item.label}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumb;