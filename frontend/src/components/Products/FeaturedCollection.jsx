import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";
import featured from "../../assets/featured.webp";
import Reveal from "../Common/Reveal";

const FeaturedCollection = () => {
  return (
    <section className="px-4 py-16 lg:px-0">
      <Reveal className="relative mx-auto flex max-w-6xl flex-col-reverse items-center overflow-hidden rounded-3xl bg-green-50 lg:flex-row">
        {/* Slowly drifting colour blobs behind the content */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 animate-blob rounded-full bg-emerald-200/70 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 left-1/3 h-96 w-96 animate-blob rounded-full bg-amber-200/60 blur-3xl"
          style={{ animationDelay: "-6s" }}
        />

        {/* Text */}
        <div className="relative p-8 text-center lg:w-1/2 lg:p-14 lg:text-left">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-emerald-700">Comfort and Style</p>
          <h2 className="mb-6 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Apparel made for your{" "}
            <span className="font-display font-medium italic text-emerald-800">everyday</span> life.
          </h2>
          <p className="mb-8 text-lg text-gray-600">
            Discover high-quality, comfortable clothing that effortlessly blends fashion and function.
            Designed to make you look and feel great every day.
          </p>
          <Link to="/collections/all" className="btn-dark btn-shine group">
            Shop Now
            <HiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Image */}
        <div className="relative overflow-hidden lg:w-1/2 lg:self-stretch">
          <img
            src={featured}
            alt="Featured collection"
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[1500ms] ease-out hover:scale-105 lg:rounded-r-3xl"
          />
          <span className="absolute right-5 top-5 animate-float rounded-full bg-white/90 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-lg backdrop-blur">
            Everyday Essentials
          </span>
        </div>
      </Reveal>
    </section>
  );
};

export default FeaturedCollection;
