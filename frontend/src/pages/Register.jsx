import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import register from "../assets/register.webp";
import { registerUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import { mergeCart } from "../redux/slices/cartSlice";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, guestId, loading, error } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);

    // Get redirect parameter and check if it's checkout or something
    const redirect = new URLSearchParams(location.search).get("redirect") ||  "/";
    const isCheckoutRedirect = redirect.includes("checkout");

    useEffect(() => {
        if (user) {
            if (cart?.products.length > 0 && guestId) {
                dispatch(mergeCart({ guestId, user })).then(() => {
                    navigate(isCheckoutRedirect ? "/checkout" : "/" );
                });
            } else {
                navigate(isCheckoutRedirect ? "/checkout" : "/" );
            }
        }
    }, [user, guestId, cart, navigate, isCheckoutRedirect, dispatch]);
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(registerUser({ name, email, password }));
    };

    return (
        <div className="flex">
            {/* Left Section: Form */}
            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
                <form 
                    onSubmit={handleSubmit} 
                    className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
                >
                    <div className="flex justify-center mb-6">
                        <h2 className="text-xl font-medium">Shopper</h2>
                    </div>
                    <h2 className="text-2xl font-bold text-center mb-6">
                        Hey there! 👋
                    </h2>
                    <p className="text-center mb-6">
                        Enter your details to create an account
                    </p>

                    {/* Name Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full p-2 border border-gray-300 rounded focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                            placeholder="Enter your Name"
                        />
                    </div>

                    {/* Email Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)} 
                            className="w-full p-2 border border-gray-300 rounded focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                            placeholder="Enter your email address"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-4">
                        <label className="block text-sm font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} 
                            className="w-full p-2 border border-gray-300 rounded focus:border-gray-500 focus:ring-2 focus:ring-gray-300"
                            placeholder="Enter your password"
                        />
                    </div>

                    {/* Sign Up Button */}
                    <button 
                        type="submit"
                        className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800 transition duration-200"
                    >
                        { loading? "Loading..." : "Sign Up" }
                    </button>
                    <p className="mt-6 text-center text-sm">
                        Don't have an account?{" "}
                        <Link to={`/login?redirect=${encodeURIComponent(redirect)}`}
                        className="text-blue-500 hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>

            {/* Right Section: Image */}
            <div className="hidden md:block w-1/2 bg-gray-800">
                <div className="h-full flex flex-col justify-center items-center">
                    <img
                        src={register}
                        alt="Login to Account"
                        className="h-full w-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Register;