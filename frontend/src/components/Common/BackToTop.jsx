import { HiArrowUp } from "react-icons/hi2";
import useScrolledPast from "../../hooks/useScrolledPast";

// Floating button that appears after scrolling down
const BackToTop = () => {
  const visible = useScrolledPast(700);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-6 right-6 z-30 grid h-12 w-12 place-items-center rounded-full bg-gray-950 text-white shadow-xl
        transition-all duration-500 hover:-translate-y-1 hover:bg-rabbit-red
        ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"}`}
    >
      <HiArrowUp className="h-5 w-5" />
    </button>
  );
};

export default BackToTop;
