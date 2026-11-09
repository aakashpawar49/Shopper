import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiCheck } from "react-icons/hi2";
import { clearCart } from "../redux/slices/cartSlice";
import { formatDate, formatPrice } from "../lib/format";

const estimatedDelivery = (createdAt) => {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 10);
  return formatDate(date);
};

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const checkout = useSelector((state) => state.checkout.checkout);

  useEffect(() => {
    if (checkout?._id) {
      dispatch(clearCart());
    } else {
      navigate("/my-orders");
    }
  }, [checkout, dispatch, navigate]);

  if (!checkout) return null;

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      {/* Animated success badge */}
      <div className="mb-8 flex flex-col items-center text-center">
        <div className="relative mb-6 grid h-20 w-20 place-items-center">
          <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/40" />
          <span className="relative grid h-20 w-20 animate-scale-in place-items-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30">
            <HiCheck className="h-10 w-10" />
          </span>
        </div>
        <h1 className="animate-fade-up text-3xl font-bold md:text-4xl">Thank you for your order!</h1>
        <p className="mt-2 animate-fade-up text-gray-500" style={{ animationDelay: "120ms" }}>
          We&apos;re getting it ready. You&apos;ll find it under My Orders.
        </p>
      </div>

      <div className="animate-fade-up rounded-2xl border border-gray-100 p-6 shadow-sm md:p-8" style={{ animationDelay: "200ms" }}>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <h2 className="text-lg font-semibold">Order #{checkout._id.slice(-8).toUpperCase()}</h2>
            <p className="text-sm text-gray-500">Order date: {formatDate(checkout.createdAt)}</p>
          </div>
          <p className="text-sm font-medium text-emerald-700">
            Estimated delivery: {estimatedDelivery(checkout.createdAt)}
          </p>
        </div>

        <ul className="mb-8 divide-y divide-gray-100">
          {checkout.checkoutItems.map((item) => (
            <li key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4 py-4">
              <img
                src={item.image || "/placeholder.jpg"}
                alt={item.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div>
                <h4 className="font-semibold">{item.name}</h4>
                <p className="text-sm text-gray-500">
                  {item.color} | {item.size}
                </p>
              </div>
              <div className="ml-auto text-right">
                <p className="font-medium">{formatPrice(item.price)}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </li>
          ))}
        </ul>

        <div className="grid gap-6 rounded-xl bg-gray-50 p-5 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Payment</h4>
            <p>{checkout.paymentMethod}</p>
          </div>
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Delivery</h4>
            <p>{checkout.shippingAddress.address}</p>
            <p>
              {checkout.shippingAddress.city}, {checkout.shippingAddress.country}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link to="/collections/all" className="btn-dark btn-shine">
          Continue shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
