import { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineEye, HiOutlineEyeSlash } from "react-icons/hi2";

// Two-column layout shared by the login and register pages: the form on the
// left and a slowly zooming photo on the right (desktop only).
const AuthShell = ({ image, imageAlt, title, subtitle, quote, onSubmit, children }) => {
  return (
    <div className="flex min-h-[calc(100vh-7rem)]">
      <div className="flex w-full items-center justify-center p-6 md:w-1/2 md:p-12">
        <form
          onSubmit={onSubmit}
          className="w-full max-w-md animate-fade-up rounded-2xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/60 md:p-10"
        >
          <Link to="/" className="mb-8 block text-center text-2xl font-black tracking-tight">
            Shopper<span className="text-rabbit-red">.</span>
          </Link>
          <h2 className="mb-2 text-center text-2xl font-bold">{title}</h2>
          <p className="mb-8 text-center text-sm text-gray-500">{subtitle}</p>
          {children}
        </form>
      </div>

      <div className="relative hidden w-1/2 overflow-hidden bg-gray-900 md:block">
        <img src={image} alt={imageAlt} className="absolute inset-0 h-full w-full animate-ken-burns object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <p
          className="absolute inset-x-10 bottom-12 animate-fade-up font-display text-4xl font-medium italic leading-tight text-white lg:text-5xl"
          style={{ animationDelay: "400ms" }}
        >
          {quote}
        </p>
      </div>
    </div>
  );
};

// Labelled input used by the auth forms
export const AuthField = ({ id, label, ...inputProps }) => (
  <div className="mb-4">
    <label htmlFor={id} className="label">
      {label}
    </label>
    <input id={id} className="input" {...inputProps} />
  </div>
);

// Password input with a show/hide toggle
export const PasswordField = ({ id, label, ...inputProps }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="mb-4">
      <label htmlFor={id} className="label">
        {label}
      </label>
      <div className="relative">
        <input id={id} type={visible ? "text" : "password"} className="input pr-11" {...inputProps} />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-900"
        >
          {visible ? <HiOutlineEyeSlash className="h-5 w-5" /> : <HiOutlineEye className="h-5 w-5" />}
        </button>
      </div>
    </div>
  );
};

// Submit button with a spinner while the request runs
export const SubmitButton = ({ loading, children }) => (
  <button type="submit" disabled={loading} className="btn-dark btn-shine mt-2 w-full">
    {loading && (
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
    )}
    {children}
  </button>
);

export default AuthShell;
