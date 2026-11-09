import { Link } from "react-router-dom";
import { HiArrowRight } from "react-icons/hi2";
import mensCollectionImage from "../../assets/mens-collection.webp";
import womensCollectionImage from "../../assets/womens-collection.webp";
import Reveal from "../Common/Reveal";

// Gender values must match the backend exactly ("Women" / "Men")
const COLLECTIONS = [
  {
    title: "Women's Collection",
    tagline: "Effortless everyday style",
    image: womensCollectionImage,
    to: "/collections/all?gender=Women",
  },
  {
    title: "Men's Collection",
    tagline: "Sharp. Relaxed. Yours.",
    image: mensCollectionImage,
    to: "/collections/all?gender=Men",
  },
];

const GenderCollectionSection = () => {
  return (
    <section className="px-4 py-16 md:px-8 lg:px-12">
      <div className="container mx-auto grid gap-6 md:grid-cols-2">
        {COLLECTIONS.map(({ title, tagline, image, to }, index) => (
          <Reveal key={title} delay={index * 150}>
            <Link to={to} className="group relative block h-[460px] overflow-hidden rounded-2xl md:h-[640px]">
              <img
                src={image}
                alt={title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-white/75 transition duration-500 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
                  {tagline}
                </p>
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">{title}</h2>
                <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider">
                  <span className="link-underline">Shop Now</span>
                  <HiArrowRight className="transition-transform duration-300 group-hover:translate-x-2" />
                </span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export default GenderCollectionSection;
