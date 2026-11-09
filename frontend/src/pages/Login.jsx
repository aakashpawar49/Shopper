import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import loginImage from "../assets/login.webp";
import { loginUser } from "../redux/slices/authSlice";
import useAuthRedirect from "../hooks/useAuthRedirect";
import AuthShell, { AuthField, PasswordField, SubmitButton } from "../components/Common/AuthShell";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const redirect = useAuthRedirect();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    <AuthShell
      image={loginImage}
      imageAlt="Login to your account"
      title="Welcome back 👋"
      subtitle="Enter your email and password to sign in"
      quote="Style that moves with you."
      onSubmit={handleSubmit}
    >
      <AuthField
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
      />
      <PasswordField
        id="password"
        label="Password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
      />
      {error && (
        <p role="alert" className="mb-4 animate-fade-in rounded-lg bg-red-50 px-4 py-2.5 text-center text-sm text-red-600">
          {error}
        </p>
      )}
      <SubmitButton loading={loading}>{loading ? "Signing in…" : "Sign In"}</SubmitButton>
      <p className="mt-6 text-center text-sm text-gray-600">
        Don&apos;t have an account?{" "}
        <Link
          to={`/register?redirect=${encodeURIComponent(redirect)}`}
          className="link-underline font-semibold text-gray-950"
        >
          Register
        </Link>
      </p>
    </AuthShell>
  );
};

export default Login;
