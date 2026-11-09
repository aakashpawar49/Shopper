import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import registerImage from "../assets/register.webp";
import { registerUser } from "../redux/slices/authSlice";
import useAuthRedirect from "../hooks/useAuthRedirect";
import AuthShell, { AuthField, PasswordField, SubmitButton } from "../components/Common/AuthShell";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.auth.loading);
  const error = useSelector((state) => state.auth.error);
  const redirect = useAuthRedirect();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ name, email, password }));
  };

  return (
    <AuthShell
      image={registerImage}
      imageAlt="Create an account"
      title="Create your account ✨"
      subtitle="Join us for early access to new drops and offers"
      quote="Your wardrobe, reimagined."
      onSubmit={handleSubmit}
    >
      <AuthField
        id="name"
        label="Name"
        type="text"
        autoComplete="name"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
      />
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
        autoComplete="new-password"
        required
        minLength={6}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="At least 6 characters"
      />
      {error && (
        <p role="alert" className="mb-4 animate-fade-in rounded-lg bg-red-50 px-4 py-2.5 text-center text-sm text-red-600">
          {error}
        </p>
      )}
      <SubmitButton loading={loading}>{loading ? "Creating account…" : "Sign Up"}</SubmitButton>
      <p className="mt-6 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to={`/login?redirect=${encodeURIComponent(redirect)}`}
          className="link-underline font-semibold text-gray-950"
        >
          Login
        </Link>
      </p>
    </AuthShell>
  );
};

export default Register;
