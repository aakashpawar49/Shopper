import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";
import heroImg from "../../assets/rabbit-hero.webp";

// Each headline line slides up from behind a mask, one after the other
const HeadlineLine = ({ children, delay, className = "" }) => (
  <span className="block overflow-hidden pb-2">
    <span className={`block animate-mask-up ${className}`} style={{ animationDelay: `${delay}ms` }}>
      {children}
    </span>
  </span>
);

const Hero = () => {
  const scrollToNewArrivals = () =>
    document.getElementById("new-arrivals")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section className="relative h-[560px] overflow-hidden bg-gray-900 md:h-[680px] lg:h-[calc(100vh-7rem)] lg:max-h-[860px] lg:min-h-[640px]">
      {/* Slow zoom-out on load */}
      <img
        src={heroImg}
        alt="Models wearing vacation outfits"
        fetchPriority="high"
        className="absolute inset-0 h-full w-full animate-ken-burns object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />

      <div className="relative flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <p
          className="mb-6 animate-fade-up rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.35em] backdrop-blur-md"
          style={{ animationDelay: "150ms" }}
        >
          New Season Collection
        </p>

        <h1 className="mb-6 text-6xl font-black uppercase leading-[0.85] tracking-tighter md:text-8xl lg:text-9xl">
          <HeadlineLine delay={300}>Vacation</HeadlineLine>
          <HeadlineLine delay={450} className="font-display font-medium normal-case italic tracking-normal">
            Ready
          </HeadlineLine>
        </h1>

        <p
          className="mb-9 max-w-md animate-fade-up text-sm text-white/85 md:text-lg"
          style={{ animationDelay: "700ms" }}
        >
          Explore our vacation outfits with fast worldwide shipping.
        </p>

        <div className="flex animate-fade-up flex-wrap justify-center gap-3" style={{ animationDelay: "850ms" }}>
          <Link to="/collections/all" className="btn-light btn-shine group">
            Shop Now
            <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <button
            type="button"
            onClick={scrollToNewArrivals}
            className="btn-outline text-white hover:border-white hover:bg-white hover:text-gray-950"
          >
            New Arrivals
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 md:block" aria-hidden="true">
        <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white/60 pt-2">
          <span className="h-2 w-1 animate-scroll-dot rounded-full bg-white" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
