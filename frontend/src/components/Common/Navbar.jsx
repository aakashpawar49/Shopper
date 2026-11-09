import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { HiOutlineUser, HiOutlineShoppingBag, HiBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import useScrolledPast from "../../hooks/useScrolledPast";
import useOverlay from "../../hooks/useOverlay";

const NAV_LINKS = [
  { label: "Men", to: "/collections/all?gender=Men" },
  { label: "Women", to: "/collections/all?gender=Women" },
  { label: "Top Wear", to: "/collections/all?category=Top Wear" },
  { label: "Bottom Wear", to: "/collections/all?category=Bottom Wear" },
];

// Total number of items in the cart. Returning a number means the navbar
// only re-renders when the count changes, not on every cart update.
const selectCartCount = (state) =>
  state.cart.cart?.products?.reduce((total, item) => total + item.quantity, 0) || 0;

// A link is active when we're on its page and every query param it sets matches
const isLinkActive = (to, location) => {
  const [path, query = ""] = to.split("?");
  if (location.pathname !== path) return false;
  const current = new URLSearchParams(location.search);
  return [...new URLSearchParams(query)].every(([key, value]) => current.get(key) === value);
};

const Navbar = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const cartItemCount = useSelector(selectCartCount);
  const isAdmin = useSelector((state) => state.auth.user?.role === "admin");
  const location = useLocation();
  const scrolled = useScrolledPast(8);

  const closeCart = useCallback(() => setCartOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useOverlay(menuOpen, closeMenu);

  return (
    <>
      <div
        className={`transition-all duration-300 ${
          scrolled
            ? "bg-white/80 shadow-[0_8px_30px_rgba(0,0,0,0.06)] backdrop-blur-lg"
            : "border-b border-gray-200 bg-white"
        }`}
      >
        <nav
          className={`container mx-auto flex items-center justify-between px-6 transition-all duration-300 ${
            scrolled ? "py-3" : "py-4"
          }`}
        >
          {/* Logo */}
          <Link to="/" className="group text-2xl font-black tracking-tight">
            Shopper
            <span className="inline-block text-rabbit-red transition-transform duration-300 group-hover:-translate-y-1">
              .
            </span>
          </Link>

          {/* Links (desktop) */}
          <div className="hidden space-x-8 md:flex">
            {NAV_LINKS.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                className={`link-underline text-sm font-medium uppercase tracking-wide transition-colors ${
                  isLinkActive(to, location) ? "active text-black" : "text-gray-600 hover:text-black"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-full bg-gray-950 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-rabbit-red"
              >
                Admin
              </Link>
            )}
            <Link to="/profile" aria-label="Account" className="text-gray-700 transition hover:scale-110 hover:text-black">
              <HiOutlineUser className="h-6 w-6" />
            </Link>
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              aria-label={`Open cart (${cartItemCount} items)`}
              className="relative text-gray-700 transition hover:scale-110 hover:text-black"
            >
              <HiOutlineShoppingBag className="h-6 w-6" />
              {cartItemCount > 0 && (
                // Keyed on the count so the pop animation replays whenever it changes
                <span
                  key={cartItemCount}
                  className="absolute -right-2 -top-2 grid h-5 min-w-5 animate-pop place-items-center rounded-full bg-rabbit-red px-1 text-[10px] font-bold text-white"
                >
                  {cartItemCount}
                </span>
              )}
            </button>
            <SearchBar />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="text-gray-700 md:hidden"
            >
              <HiBars3BottomRight className="h-6 w-6" />
            </button>
          </div>
        </nav>
      </div>

      <CartDrawer open={cartOpen} onClose={closeCart} />

      {/* Mobile navigation */}
      <div
        aria-hidden="true"
        onClick={closeMenu}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 md:hidden ${
          menuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        inert={!menuOpen}
        aria-label="Menu"
        className={`fixed left-0 top-0 z-50 h-full w-3/4 bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-1/2 md:hidden ${
          menuOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-6">
          <span className="text-xl font-black">
            Menu<span className="text-rabbit-red">.</span>
          </span>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="Close menu"
            className="rounded-full p-2 transition duration-300 hover:rotate-90 hover:bg-gray-100"
          >
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <nav className="space-y-1 px-6">
          {NAV_LINKS.map(({ label, to }, index) => (
            <Link
              key={label}
              to={to}
              onClick={closeMenu}
              style={{ transitionDelay: menuOpen ? `${150 + index * 70}ms` : "0ms" }}
              className={`block border-b border-gray-100 py-4 text-2xl font-semibold transition-all duration-500 hover:pl-2 hover:text-rabbit-red ${
                menuOpen ? "translate-x-0 opacity-100" : "-translate-x-6 opacity-0"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Navbar;
