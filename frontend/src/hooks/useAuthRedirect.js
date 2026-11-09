import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { mergeCart } from "../redux/slices/cartSlice";

// Shared by the login and register pages. Once a user is logged in, merge the
// guest cart into their account (if it has items) and send them on to
// checkout or the home page. Returns the ?redirect= value for cross-links.
const useAuthRedirect = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const user = useSelector((state) => state.auth.user);
    const guestId = useSelector((state) => state.auth.guestId);
    const hasCartItems = useSelector((state) => state.cart.cart?.products?.length > 0);

    const redirect = new URLSearchParams(location.search).get("redirect") || "/";
    const destination = redirect.includes("checkout") ? "/checkout" : "/";

    useEffect(() => {
        if (!user) return;
        if (hasCartItems && guestId) {
            dispatch(mergeCart({ guestId, user })).finally(() => navigate(destination));
        } else {
            navigate(destination);
        }
    }, [user, guestId, hasCartItems, destination, dispatch, navigate]);

    return redirect;
};

export default useAuthRedirect;
