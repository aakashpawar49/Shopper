import { useCallback, useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { HiArrowRight } from "react-icons/hi2";
import { Link } from "react-router-dom";
import api from "../../lib/api";
import { formatPrice } from "../../lib/format";
import SectionHeading from "../Common/SectionHeading";

const NewArrivals = () => {
  const scrollRef = useRef(null);
  // Drag state lives in a ref: it changes on every mouse move and the UI
  // doesn't need to re-render for it.
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [isDragging, setIsDragging] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/products/new-arrivals", { signal: controller.signal })
      .then(({ data }) => setNewArrivals(Array.isArray(data) ? data : []))
      .catch((error) => {
        if (!controller.signal.aborted) console.error("New arrivals fetch failed:", error.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, []);

  const updateScrollButtons = useCallback(() => {
    const container = scrollRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollWidth > Math.ceil(container.scrollLeft + container.clientWidth));
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return undefined;
    updateScrollButtons();
    container.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);
    return () => {
      container.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [newArrivals, updateScrollButtons]);

  const handleMouseDown = (e) => {
    drag.current = {
      active: true,
      startX: e.pageX,
      scrollLeft: scrollRef.current.scrollLeft,
      moved: false,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!drag.current.active) return;
    const distance = e.pageX - drag.current.startX;
    if (Math.abs(distance) > 5) drag.current.moved = true;
    scrollRef.current.scrollLeft = drag.current.scrollLeft - distance;
  };

  const stopDragging = () => {
    if (!drag.current.active) return;
    drag.current.active = false;
    setIsDragging(false);
  };

  // A drag shouldn't count as a click on the card under the cursor
  const handleClickCapture = (e) => {
    if (drag.current.moved) {
      e.preventDefault();
      drag.current.moved = false;
    }
  };

  const scroll = (direction) => {
    const container = scrollRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.8 * (direction === "left" ? -1 : 1);
    container.scrollBy({ left: amount, behavior: "smooth" });
  };

  if (!loading && newArrivals.length === 0) return null;

  return (
    <section id="new-arrivals" className="scroll-mt-20 px-4 py-16 lg:px-0">
      <div className="container mx-auto mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          align="left"
          className="!mb-0"
          eyebrow="Just dropped"
          title="Explore New Arrivals"
          subtitle="Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion."
        />
        <div className="flex shrink-0 gap-2">
          {[
            { direction: "left", enabled: canScrollLeft, Icon: FiChevronLeft },
            { direction: "right", enabled: canScrollRight, Icon: FiChevronRight },
          ].map(({ direction, enabled, Icon }) => (
            <button
              key={direction}
              type="button"
              aria-label={`Scroll ${direction}`}
              onClick={() => scroll(direction)}
              disabled={!enabled}
              className="grid h-12 w-12 place-items-center rounded-full border border-gray-300 transition duration-300 hover:border-gray-950 hover:bg-gray-950 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-current"
            >
              <Icon className="text-xl" />
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollRef}
        className={`no-scrollbar container mx-auto flex gap-6 overflow-x-auto pb-2 ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab snap-x snap-mandatory"
        }`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        onClickCapture={handleClickCapture}
      >
        {loading
          ? Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="skeleton h-[460px] min-w-[85%] rounded-2xl sm:min-w-[48%] md:h-[520px] lg:min-w-[31%]" />
            ))
          : newArrivals.map((product, index) => (
              <Link
                key={product._id}
                to={`/product/${product._id}`}
                draggable={false}
                style={{ animationDelay: `${index * 80}ms` }}
                className="group relative min-w-[85%] animate-fade-up snap-start overflow-hidden rounded-2xl sm:min-w-[48%] lg:min-w-[31%]"
              >
                <img
                  src={product.images?.[0]?.url || "/placeholder.jpg"}
                  alt={product.images?.[0]?.altText || product.name}
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                  className="h-[460px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 md:h-[520px]"
                />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
                  New
                </span>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 pt-20 text-white">
                  <h4 className="font-semibold">{product.name}</h4>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-white/90">{formatPrice(product.price)}</p>
                    <span className="inline-flex translate-x-3 items-center gap-1 text-sm font-medium opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                      View <HiArrowRight />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </section>
  );
};

export default NewArrivals;
