import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { TbBrandMeta } from "react-icons/tb";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { FiPhoneCall } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi2";
import api, { getErrorMessage } from "../../lib/api";

const SHOP_LINKS = [
  { label: "Men's Top Wear", to: "/collections/all?gender=Men&category=Top Wear" },
  { label: "Women's Top Wear", to: "/collections/all?gender=Women&category=Top Wear" },
  { label: "Men's Bottom Wear", to: "/collections/all?gender=Men&category=Bottom Wear" },
  { label: "Women's Bottom Wear", to: "/collections/all?gender=Women&category=Bottom Wear" },
];

const SUPPORT_LINKS = ["Contact Us", "About Us", "FAQs", "Features"];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com", Icon: TbBrandMeta },
  { label: "Instagram", href: "https://www.instagram.com", Icon: IoLogoInstagram },
  { label: "X (Twitter)", href: "https://twitter.com", Icon: RiTwitterXLine },
];

const linkClass =
  "inline-flex items-center gap-1 text-gray-400 transition-all duration-300 hover:translate-x-1 hover:text-white";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/api/subscribe", { email });
      toast.success(data?.message || "Thanks for subscribing!");
      setEmail("");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative overflow-hidden bg-gray-950 pt-16 text-gray-300">
      <div className="container mx-auto grid grid-cols-1 gap-10 px-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Newsletter */}
        <div className="lg:col-span-1">
          <h3 className="mb-4 text-lg font-semibold text-white">Newsletter</h3>
          <p className="mb-3 text-sm text-gray-400">
            Be the first to hear about new products, exclusive events, and online offers.
          </p>
          <p className="mb-5 text-sm font-medium text-white">
            Sign up and get <span className="text-rabbit-red">10% off</span> your first order.
          </p>
          <form onSubmit={handleSubscribe} className="group flex overflow-hidden rounded-full bg-white/5 ring-1 ring-white/10 transition focus-within:ring-white/40">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              className="w-full bg-transparent px-5 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              aria-label="Subscribe"
              className="m-1 grid shrink-0 place-items-center rounded-full bg-rabbit-red px-4 text-white transition hover:bg-white hover:text-gray-950 disabled:opacity-60"
            >
              {submitting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              )}
            </button>
          </form>
        </div>

        {/* Shop */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Shop</h3>
          <ul className="space-y-3 text-sm">
            {SHOP_LINKS.map(({ label, to }) => (
              <li key={label}>
                <Link to={to} className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Support</h3>
          <ul className="space-y-3 text-sm">
            {SUPPORT_LINKS.map((label) => (
              <li key={label}>
                <Link to="#" className={linkClass}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow us */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-white">Follow us</h3>
          <div className="mb-6 flex items-center gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full bg-white/5 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:bg-rabbit-red hover:text-white hover:ring-rabbit-red"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <p className="text-sm text-gray-500">Call Us</p>
          <a href="tel:0123456789" className="mt-1 inline-flex items-center gap-2 text-white transition hover:text-rabbit-red">
            <FiPhoneCall />
            0123-456-789
          </a>
        </div>
      </div>

      {/* Oversized wordmark fading into the background */}
      <p
        aria-hidden="true"
        className="pointer-events-none mt-14 select-none bg-gradient-to-b from-white/15 to-transparent bg-clip-text text-center text-[22vw] font-black uppercase leading-[0.8] tracking-tighter text-transparent"
      >
        Shopper
      </p>

      <div className="border-t border-white/10">
        <p className="container mx-auto px-6 py-6 text-center text-xs tracking-wide text-gray-500">
          © {new Date().getFullYear()}, CompileTab. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
