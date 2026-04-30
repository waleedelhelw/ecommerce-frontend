import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/formatPrice';
import useCart from '../../hooks/useCart';

const CartSummary = ({
  showCheckout = true,
  shippingCost = 0,
  codFee = 0,
  showShipping = false,
}) => {
  const { cartItems, cartTotal } = useCart();
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const grandTotal = cartTotal + shippingCost + codFee;

  return (
    <div className="bg-white rounded-xl border p-6 sticky top-20">
      <h3 className="text-lg font-bold mb-4">ملخص الطلب</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">المنتجات ({itemCount})</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>

        {showShipping ? (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">الشحن</span>
            <span className={shippingCost === 0 ? 'text-green-600' : ''}>
              {shippingCost === 0 ? 'مجاني' : formatPrice(shippingCost)}
            </span>
          </div>
        ) : (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">الشحن</span>
            <span className="text-gray-400">يُحدد عند الطلب</span>
          </div>
        )}

        {codFee > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">رسوم الدفع عند الاستلام</span>
            <span className="text-orange-600">{formatPrice(codFee)}</span>
          </div>
        )}
      </div>

      <hr className="my-4" />

      <div className="flex justify-between font-bold text-lg mb-6">
        <span>الإجمالي</span>
        <span className="text-blue-600">
          {formatPrice(showShipping ? grandTotal : cartTotal)}
        </span>
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