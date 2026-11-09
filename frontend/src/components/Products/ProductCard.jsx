import { memo, useState } from "react";
import { Link } from "react-router-dom";
import Reveal from "../Common/Reveal";
import { formatPrice } from "../../lib/format";

const ProductCard = ({ product, index = 0 }) => {
  const [primary, secondary] = product.images ?? [];
  // The second photo is only requested once the card is hovered, so grids
  // don't download two images per product up front.
  const [showAlternate, setShowAlternate] = useState(false);

  return (
    <Reveal delay={(index % 4) * 90}>
      <Link
        to={`/product/${product._id}`}
        className="group block"
        onMouseEnter={() => secondary && setShowAlternate(true)}
      >
        <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl bg-gray-100">
          <img
            src={primary?.url || "/placeholder.jpg"}
            alt={primary?.altText || product.name}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition duration-700 ease-out group-hover:scale-105"
          />
          {showAlternate && (
            <img
              src={secondary.url}
              alt=""
              aria-hidden="true"
              decoding="async"
              className="absolute inset-0 h-full w-full scale-105 object-cover opacity-0 transition duration-700 ease-out group-hover:scale-100 group-hover:opacity-100"
            />
          )}
          <span className="absolute inset-x-4 bottom-4 translate-y-4 rounded-full bg-white/95 py-2.5 text-center text-xs font-semibold uppercase tracking-wider opacity-0 shadow-lg backdrop-blur transition duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            View product
          </span>
        </div>
        <h3 className="mb-1 truncate text-sm font-medium transition-colors group-hover:text-rabbit-red">
          {product.name}
        </h3>
        <p className="text-sm font-semibold tracking-tight text-gray-900">{formatPrice(product.price)}</p>
      </Link>
    </Reveal>
  );
};

export default memo(ProductCard);
