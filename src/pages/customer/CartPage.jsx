import { Link } from 'react-router-dom';
import SEO from '../../components/common/SEO';
import Breadcrumb from '../../components/common/Breadcrumb';
import CartItem from '../../components/cart/CartItem';
import CartSummary from '../../components/cart/CartSummary';
import EmptyState from '../../components/common/EmptyState';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import useCart from '../../hooks/useCart';

const CartPage = () => {
  const { cartItems, loading, clearCart } = useCart();

  if (loading) return <LoadingSpinner size="lg" />;

  return (
    <>
      <SEO
        title="سلة التسوق"
        description="راجع منتجاتك في سلة التسوق وأكمل عملية الشراء بسهولة على تسوّق."
        url="/cart"
        noindex={true}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: 'سلة التسوق' }]} />

        <h1 className="text-2xl font-bold mb-6">
          🛒 سلة التسوق ({cartItems.length} منتجات)
        </h1>

        {cartItems.length === 0 ? (
          <EmptyState
            icon="🛒"
            title="السلة فارغة"
            message="لم تضف أي منتجات للسلة بعد"
            action={
              <Link to="/products" className="btn-primary">
                تصفح المنتجات
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {cartItems.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
              <button onClick={clearCart} className="btn-danger mt-4 text-sm">
                🗑️ مسح السلة
              </button>
            </div>
            <div>
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CartPage;