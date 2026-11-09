import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { fetchUserOrders } from "../redux/slices/orderSlice";
import { TableRowsSkeleton } from "../components/Common/Skeletons";
import { formatDate, formatPrice } from "../lib/format";

// `embedded` drops the page padding when shown inside the profile page
const MyOrdersPage = ({ embedded = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.orders.orders);
  const loading = useSelector((state) => state.orders.loading);
  const error = useSelector((state) => state.orders.error);

  useEffect(() => {
    const request = dispatch(fetchUserOrders());
    return () => request.abort();
  }, [dispatch]);

  const openOrder = (orderId) => navigate(`/order/${orderId}`);

  return (
    <div className={embedded ? "" : "container mx-auto px-4 py-10 md:px-6"}>
      <h2 className="mb-6 text-2xl font-bold">My Orders</h2>

      {error ? (
        <p className="rounded-lg bg-red-50 p-4 text-red-600">Couldn&apos;t load your orders: {error}</p>
      ) : !loading && orders.length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-300 py-16 text-center">
          <HiOutlineShoppingBag className="mb-4 h-12 w-12 animate-float text-gray-300" />
          <p className="mb-1 text-lg font-semibold">No orders yet</p>
          <p className="mb-6 text-sm text-gray-500">When you place an order, it will show up here.</p>
          <Link to="/collections/all" className="btn-dark btn-shine">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Shipping To</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <TableRowsSkeleton rows={3} columns={7} />
              ) : (
                orders.map((order, index) => (
                  <tr
                    key={order._id}
                    tabIndex={0}
                    onClick={() => openOrder(order._id)}
                    onKeyDown={(e) => e.key === "Enter" && openOrder(order._id)}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-fade-in cursor-pointer transition-colors hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                  >
                    <td className="px-4 py-3">
                      <img
                        src={order.orderItems[0]?.image || "/placeholder.jpg"}
                        alt={order.orderItems[0]?.name || "Order item"}
                        loading="lazy"
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      {order.shippingAddress
                        ? `${order.shippingAddress.city}, ${order.shippingAddress.country}`
                        : "N/A"}
                    </td>
                    <td className="px-4 py-3">{order.orderItems.length}</td>
                    <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-900">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          order.isPaid ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {order.isPaid ? "Paid" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
