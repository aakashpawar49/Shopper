import { IoMdClose } from "react-icons/io";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import CartContents from "../Cart/CartContents";
import useOverlay from "../../hooks/useOverlay";

const CartDrawer = ({ open, onClose }) => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const guestId = useSelector((state) => state.auth.guestId);
  const cart = useSelector((state) => state.cart.cart);
  useOverlay(open, onClose);

  const items = cart?.products ?? [];
  const itemCount = items.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    navigate(user ? "/checkout" : "/login?redirect=checkout");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* `inert` keeps keyboard focus out of the drawer while it's closed */}
      <aside
        inert={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed right-0 top-0 z-50 flex h-full w-[88%] max-w-md flex-col bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          open ? "translate-x-0 shadow-2xl" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b px-6 py-5">
          <h2 className="text-lg font-semibold">
            Your Cart <span className="font-normal text-gray-400">({itemCount})</span>
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="rounded-full p-2 transition duration-300 hover:rotate-90 hover:bg-gray-100"
          >
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {items.length > 0 ? (
            <CartContents cart={cart} userId={user?._id} guestId={guestId} />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-5 grid h-20 w-20 animate-float place-items-center rounded-full bg-gray-100">
                <HiOutlineShoppingBag className="h-9 w-9 text-gray-400" />
              </div>
              <p className="mb-1 text-lg font-semibold">Your cart is empty</p>
              <p className="mb-6 text-sm text-gray-500">Looks like you haven&apos;t added anything yet.</p>
              <Link to="/collections/all" onClick={onClose} className="btn-dark btn-shine">
                Start shopping
              </Link>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t bg-gray-50/80 px-6 py-5">
            <div className="mb-4 flex justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>₹{(cart.totalPrice ?? 0).toLocaleString()}</span>
            </div>
            <button type="button" onClick={handleCheckout} className="btn-dark btn-shine w-full">
              Checkout
            </button>
            <p className="mt-3 text-center text-xs text-gray-500">
              Shipping, taxes and discount codes calculated at checkout.
            </p>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
