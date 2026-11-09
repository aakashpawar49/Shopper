import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { HiLockClosed } from "react-icons/hi2";
import { createCheckout } from "../../redux/slices/checkoutSlice";
import api, { getErrorMessage } from "../../lib/api";
import { formatPrice } from "../../lib/format";

// Shipping form fields, laid out in rows
const ADDRESS_ROWS = [
  [
    { name: "firstName", label: "First Name", autoComplete: "given-name" },
    { name: "lastName", label: "Last Name", autoComplete: "family-name" },
  ],
  [{ name: "address", label: "Address", autoComplete: "street-address" }],
  [
    { name: "city", label: "City", autoComplete: "address-level2" },
    { name: "postalCode", label: "Postal Code", autoComplete: "postal-code" },
  ],
  [{ name: "country", label: "Country", autoComplete: "country-name" }],
  [{ name: "phone", label: "Phone", autoComplete: "tel", type: "tel" }],
];

const Spinner = () => (
  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
);

const Step = ({ number, label, active, done }) => (
  <div className="flex items-center gap-2">
    <span
      className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold transition duration-500 ${
        active || done ? "bg-gray-950 text-white" : "bg-gray-200 text-gray-500"
      }`}
    >
      {done ? "✓" : number}
    </span>
    <span className={`text-sm font-medium ${active || done ? "text-gray-950" : "text-gray-400"}`}>{label}</span>
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.auth.user);
  const [checkoutId, setCheckoutId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const hasItems = cart?.products?.length > 0;

  useEffect(() => {
    if (!hasItems) navigate("/");
  }, [hasItems, navigate]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    if (Object.values(shippingAddress).some((value) => !value.trim())) {
      toast.error("Please fill in all the shipping address details.");
      return;
    }

    setCreating(true);
    try {
      const checkout = await dispatch(
        createCheckout({
          checkoutItems: cart.products,
          shippingAddress,
          paymentMethod: "Stripe",
          totalPrice: cart.totalPrice,
        })
      ).unwrap();
      setCheckoutId(checkout._id);
    } catch (error) {
      toast.error(`Couldn't start checkout: ${error.message}`);
    } finally {
      setCreating(false);
    }
  };

  const handleStripePayment = async () => {
    setRedirecting(true);
    try {
      const { data } = await api.post(
        "/api/payment/stripe/create-checkout-session",
        { items: cart.products, price: cart.totalPrice, checkoutId, shippingAddress },
        { requiresAuth: true }
      );
      if (!data?.url) throw new Error("Stripe did not return a checkout URL");
      window.location.assign(data.url);
    } catch (error) {
      console.error("Stripe payment error:", error);
      toast.error(`Failed to start Stripe payment: ${getErrorMessage(error)}`);
      setRedirecting(false);
    }
  };

  if (!hasItems) return null;

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-10 lg:grid-cols-2">
      {/* Shipping and payment */}
      <div className="animate-fade-up">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Checkout</h1>
        <div className="mb-8 flex items-center gap-3">
          <Step number={1} label="Delivery" active={!checkoutId} done={Boolean(checkoutId)} />
          <span className="h-px flex-1 bg-gray-200">
            <span
              className={`block h-px bg-gray-950 transition-all duration-700 ${checkoutId ? "w-full" : "w-0"}`}
            />
          </span>
          <Step number={2} label="Payment" active={Boolean(checkoutId)} />
        </div>

        <form onSubmit={handleCreateCheckout}>
          <h3 className="mb-4 text-lg font-semibold">Contact Details</h3>
          <div className="mb-6">
            <label htmlFor="email" className="label">Email</label>
            <input id="email" type="email" value={user?.email ?? ""} className="input" disabled />
          </div>

          <h3 className="mb-4 text-lg font-semibold">Delivery</h3>
          {ADDRESS_ROWS.map((row) => (
            <div key={row[0].name} className={`mb-4 grid gap-4 ${row.length > 1 ? "grid-cols-2" : ""}`}>
              {row.map(({ name, label, autoComplete, type = "text" }) => (
                <div key={name}>
                  <label htmlFor={name} className="label">{label}</label>
                  <input
                    id={name}
                    name={name}
                    type={type}
                    autoComplete={autoComplete}
                    value={shippingAddress[name]}
                    onChange={handleFieldChange}
                    disabled={Boolean(checkoutId)}
                    className="input"
                    required
                  />
                </div>
              ))}
            </div>
          ))}

          <div className="mt-8">
            {!checkoutId ? (
              <button type="submit" disabled={creating} className="btn-dark btn-shine w-full">
                {creating && <Spinner />}
                {creating ? "Saving details…" : "Continue to Payment"}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleStripePayment}
                disabled={redirecting}
                className="btn-dark btn-shine w-full animate-scale-in !bg-indigo-600 hover:!bg-indigo-700"
              >
                {redirecting ? <Spinner /> : <HiLockClosed className="h-4 w-4" />}
                {redirecting ? "Redirecting to Stripe…" : "Pay with Card (via Stripe)"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Order summary */}
      <aside
        className="h-fit animate-fade-up rounded-2xl bg-gray-50 p-6 lg:sticky lg:top-24"
        style={{ animationDelay: "120ms" }}
      >
        <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>
        <ul className="mb-4 divide-y divide-gray-200 border-y border-gray-200">
          {cart.products.map((product) => (
            <li key={`${product.productId}-${product.size}-${product.color}`} className="flex items-start justify-between gap-4 py-4">
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <img
                    src={product.image || "/placeholder.jpg"}
                    alt={product.name}
                    className="h-24 w-20 rounded-lg object-cover"
                  />
                  <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-gray-950 px-1 text-xs font-bold text-white">
                    {product.quantity}
                  </span>
                </div>
                <div>
                  <h4 className="font-medium">{product.name}</h4>
                  <p className="text-sm text-gray-500">Size: {product.size}</p>
                  <p className="text-sm text-gray-500">Color: {product.color}</p>
                </div>
              </div>
              <p className="font-semibold">{formatPrice(product.price * product.quantity)}</p>
            </li>
          ))}
        </ul>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(cart.totalPrice)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-semibold text-emerald-600">FREE</span>
          </div>
        </div>
        <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(cart.totalPrice)}</span>
        </div>
      </aside>
    </div>
  );
};

export default Checkout;
