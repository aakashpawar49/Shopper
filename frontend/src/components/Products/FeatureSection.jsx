import { HiShoppingBag, HiArrowPath, HiOutlineCreditCard } from "react-icons/hi2";
import Reveal from "../Common/Reveal";

const FEATURES = [
  { Icon: HiShoppingBag, title: "Free International Shipping", text: "On all orders over ₹200.00" },
  { Icon: HiArrowPath, title: "45 Days Return", text: "Money back guarantee" },
  { Icon: HiOutlineCreditCard, title: "Secure Checkout", text: "100% secured checkout process" },
];

const FeatureSection = () => {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
        {FEATURES.map(({ Icon, title, text }, index) => (
          <Reveal key={title} delay={index * 120}>
            {/* Hover effects live on an inner element so they don't inherit the reveal delay */}
            <div className="group flex h-full flex-col items-center rounded-2xl border border-gray-100 p-8 text-center transition duration-500 hover:-translate-y-1 hover:border-transparent hover:shadow-xl hover:shadow-gray-200/70">
              <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-gray-100 text-gray-700 transition duration-500 group-hover:rotate-[360deg] group-hover:bg-rabbit-red group-hover:text-white">
                <Icon className="text-3xl" />
              </div>
              <h4 className="mb-2 text-sm font-bold uppercase tracking-wider">{title}</h4>
              <p className="text-sm text-gray-500">{text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
