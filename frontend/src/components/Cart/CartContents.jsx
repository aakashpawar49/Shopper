import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HiOutlineTrash, HiMinus, HiPlus } from "react-icons/hi2";
import { toast } from "sonner";
import { removeFromCart, updateCartItemQuantity } from "../../redux/slices/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();
  const busy = useSelector((state) => state.cart.loading);

  if (!cart?.products?.length) {
    return <p className="py-6 text-gray-500">Your cart is empty.</p>;
  }

  const itemKey = (item) => ({
    productId: item.productId,
    size: item.size,
    color: item.color,
    guestId,
    userId,
  });

  const changeQuantity = (item, delta) => {
    const quantity = item.quantity + delta;
    if (quantity < 1) return;
    dispatch(updateCartItemQuantity({ ...itemKey(item), quantity }))
      .unwrap()
      .catch((error) => toast.error(error.message));
  };

  const removeItem = (item) => {
    dispatch(removeFromCart(itemKey(item)))
      .unwrap()
      .then(() => toast.success(`${item.name} removed from cart`))
      .catch((error) => toast.error(error.message));
  };

  return (
    <ul className="divide-y divide-gray-100">
      {cart.products.map((item, index) => (
        <li
          key={`${item.productId}-${item.size}-${item.color}`}
          className="flex animate-fade-up gap-4 py-5"
          style={{ animationDelay: `${index * 60}ms` }}
        >
          <Link to={`/product/${item.productId}`} className="shrink-0 overflow-hidden rounded-lg">
            <img
              src={item.image || "/placeholder.jpg"}
              alt={item.name}
              loading="lazy"
              className="h-24 w-20 object-cover transition duration-500 hover:scale-110"
            />
          </Link>
          <div className="flex min-w-0 flex-1 flex-col">
            <div className="flex items-start justify-between gap-2">
              <h4 className="truncate font-medium">{item.name}</h4>
              <p className="shrink-0 font-semibold">
                ₹{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
            <p className="mt-0.5 text-xs text-gray-500">
              Size: {item.size} · Color: {item.color}
            </p>
            <div className="mt-auto flex items-center justify-between pt-3">
              <div className="flex items-center rounded-full border border-gray-200">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  disabled={busy || item.quantity <= 1}
                  onClick={() => changeQuantity(item, -1)}
                  className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-gray-100 disabled:opacity-40"
                >
                  <HiMinus className="h-3.5 w-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  disabled={busy}
                  onClick={() => changeQuantity(item, 1)}
                  className="grid h-8 w-8 place-items-center rounded-full transition hover:bg-gray-100 disabled:opacity-40"
                >
                  <HiPlus className="h-3.5 w-3.5" />
                </button>
              </div>
              <button
                type="button"
                aria-label={`Remove ${item.name}`}
                disabled={busy}
                onClick={() => removeItem(item)}
                className="rounded-full p-2 text-gray-400 transition hover:bg-red-50 hover:text-rabbit-red disabled:opacity-40"
              >
                <HiOutlineTrash className="h-5 w-5" />
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default CartContents;
