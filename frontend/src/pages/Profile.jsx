import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HiArrowRightOnRectangle } from "react-icons/hi2";
import MyOrdersPage from "./MyOrdersPage";
import { logout } from "../redux/slices/authSlice";
import { clearCart } from "../redux/slices/cartSlice";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-10 md:px-6">
      <div className="flex flex-col gap-6 md:flex-row">
        {/* Account card */}
        <aside className="h-fit w-full animate-fade-up rounded-2xl border border-gray-100 p-6 shadow-sm md:sticky md:top-24 md:w-1/3 lg:w-1/4">
          <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-rabbit-red to-amber-400 text-2xl font-bold uppercase text-white shadow-lg shadow-rabbit-red/30">
            {user.name?.charAt(0) || "?"}
          </div>
          <h1 className="mb-1 text-2xl font-bold">{user.name}</h1>
          <p className="mb-2 break-all text-gray-500">{user.email}</p>
          {user.role === "admin" && (
            <span className="mb-4 inline-block rounded-full bg-gray-950 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white">
              Admin
            </span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-red-200 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
          >
            <HiArrowRightOnRectangle className="h-5 w-5" /> Logout
          </button>
        </aside>

        {/* Orders */}
        <div className="w-full animate-fade-up md:w-2/3 lg:w-3/4" style={{ animationDelay: "120ms" }}>
          <MyOrdersPage embedded />
        </div>
      </div>
    </div>
  );
};

export default Profile;
