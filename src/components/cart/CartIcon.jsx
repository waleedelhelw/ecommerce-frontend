import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import useCart from '../../hooks/useCart';

const CartIcon = () => {
  const { cartCount } = useCart();

  return (
    <Link to="/cart" className="relative p-2 text-gray-600 hover:text-blue-600">
      <FiShoppingCart size={22} />
      {cartCount > 0 && (
        <span className="absolute -top-1 -left-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {cartCount}
        </span>
      )}
    </Link>
  );
};

export default CartIcon;