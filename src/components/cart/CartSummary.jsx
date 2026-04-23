import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import useCart from '../../hooks/useCart';

const CartSummary = ({ showCheckout = true }) => {
  const { cartItems, cartTotal } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="bg-white rounded-xl border p-6 sticky top-20">
      <h3 className="text-lg font-bold mb-4">ملخص الطلب</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">المنتجات ({itemCount})</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">الشحن</span>
          <span className="text-green-600">مجاني</span>
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex justify-between font-bold text-lg mb-6">
        <span>الإجمالي</span>
        <span className="text-blue-600">{formatPrice(cartTotal)}</span>
      </div>

      {showCheckout && (
        <div className="space-y-3">
          <Link to="/checkout" className="btn-primary w-full block text-center">
            إتمام الشراء
          </Link>
          <Link to="/products" className="btn-secondary w-full block text-center">
            متابعة التسوق
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartSummary;