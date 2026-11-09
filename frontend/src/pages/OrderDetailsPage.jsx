import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { HiArrowLeft } from "react-icons/hi2";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import PageLoader from "../components/Common/PageLoader";
import { formatDate, formatPrice } from "../lib/format";

const StatusPill = ({ ok, okText, pendingText }) => (
  <span
    className={`rounded-full px-3 py-1 text-xs font-semibold ${
      ok ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
    }`}
  >
    {ok ? okText : pendingText}
  </span>
);

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const orderDetails = useSelector((state) => state.orders.orderDetails);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);

  useEffect(() => {
    const request = dispatch(fetchOrderDetails(id));
    return () => request.abort();
  }, [dispatch, id]);

  // Ignore details left over from a previously viewed order
  const order = orderDetails?._id === id ? orderDetails : null;

  if (error) return <p className="py-20 text-center text-red-600">Couldn&apos;t load this order: {error}</p>;
  if (loading || !order) return <PageLoader />;

  return (
    <div className="container mx-auto max-w-5xl px-4 py-10 md:px-6">
      <Link to="/my-orders" className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black">
        <HiArrowLeft className="transition-transform group-hover:-translate-x-1" /> Back to My Orders
      </Link>

      <div className="animate-fade-up rounded-2xl border border-gray-100 p-6 shadow-sm md:p-8">
        {/* Order info */}
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <h1 className="text-xl font-bold md:text-2xl">Order #{order._id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex flex-wrap items-start gap-2">
            <StatusPill ok={order.isPaid} okText="Paid" pendingText="Payment pending" />
            <StatusPill ok={order.isDelivered} okText="Delivered" pendingText="Delivery pending" />
          </div>
        </div>

        {/* Payment and shipping */}
        <div className="mb-8 grid gap-6 rounded-xl bg-gray-50 p-5 sm:grid-cols-2">
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Payment</h4>
            <p>Method: {order.paymentMethod}</p>
            <p>Status: {order.isPaid ? "Paid" : "Unpaid"}</p>
          </div>
          <div>
            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Shipping</h4>
            {order.shippingMethod && <p>Method: {order.shippingMethod}</p>}
            <p>
              {order.shippingAddress?.address && `${order.shippingAddress.address}, `}
              {order.shippingAddress?.city}, {order.shippingAddress?.country}
            </p>
          </div>
        </div>

        {/* Products */}
        <h4 className="mb-4 text-lg font-semibold">Products</h4>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Unit Price</th>
                <th className="px-4 py-3">Quantity</th>
                <th className="px-4 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {order.orderItems.map((item) => (
                <tr key={`${item.productId}-${item.size}-${item.color}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image || "/placeholder.jpg"}
                        alt={item.name}
                        loading="lazy"
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                      <Link to={`/product/${item.productId}`} className="link-underline font-medium text-gray-900">
                        {item.name}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">{formatPrice(item.price)}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3} className="px-4 pt-4 text-right font-semibold text-gray-900">
                  Total
                </td>
                <td className="px-4 pt-4 text-right text-lg font-bold text-gray-900">
                  {formatPrice(order.totalPrice)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
