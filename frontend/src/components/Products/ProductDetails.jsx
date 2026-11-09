import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { HiArrowPath, HiCheck, HiMinus, HiOutlineTruck, HiPlus, HiStar } from "react-icons/hi2";
import { fetchProductDetails } from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import { ProductDetailsSkeleton } from "../Common/Skeletons";
import { formatPrice } from "../../lib/format";

const Stars = ({ rating }) => (
  <div className="flex" aria-hidden="true">
    {Array.from({ length: 5 }, (_, i) => (
      <HiStar key={i} className={`h-4 w-4 ${i < Math.round(rating) ? "text-amber-400" : "text-gray-200"}`} />
    ))}
  </div>
);

const Spinner = () => (
  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
);

// Gallery, details and add-to-cart for one product
const ProductInfo = ({ product, badge, titleAs: Title }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const guestId = useSelector((state) => state.auth.guestId);

  const images = product.images?.length ? product.images : [{ url: "/placeholder.jpg", altText: product.name }];
  const [mainImage, setMainImage] = useState(images[0].url);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const zoomRef = useRef(null);
  const addedTimer = useRef(null);

  useEffect(() => () => clearTimeout(addedTimer.current), []);

  const outOfStock = product.countInStock === 0;
  const lowStock = product.countInStock > 0 && product.countInStock <= 5;

  // Zoom follows the cursor. The origin is set on the DOM node directly so
  // mouse moves don't re-render the component.
  const handleZoom = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    if (zoomRef.current) zoomRef.current.style.transformOrigin = `${x}% ${y}%`;
  };

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Please select a color and a size.");
      return;
    }
    setIsAdding(true);
    dispatch(
      addToCart({
        productId: product._id,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .unwrap()
      .then(() => {
        toast.success(`${product.name} added to cart`);
        setJustAdded(true);
        clearTimeout(addedTimer.current);
        addedTimer.current = setTimeout(() => setJustAdded(false), 2000);
      })
      .catch((error) => toast.error(`Couldn't add to cart: ${error.message}`))
      .finally(() => setIsAdding(false));
  };

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
        {/* Gallery */}
        <div className="flex animate-fade-in flex-col-reverse gap-4 md:flex-row">
          {images.length > 1 && (
            <div className="no-scrollbar flex shrink-0 gap-3 overflow-x-auto p-1 md:flex-col md:overflow-visible">
              {images.map((img, index) => (
                <button
                  key={img.url}
                  type="button"
                  onClick={() => setMainImage(img.url)}
                  aria-label={`Show image ${index + 1}`}
                  className={`shrink-0 overflow-hidden rounded-lg ring-2 ring-offset-2 transition duration-300 ${
                    mainImage === img.url ? "ring-gray-950" : "opacity-60 ring-transparent hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.altText || product.name}
                    loading="lazy"
                    className="h-20 w-16 object-cover md:h-24 md:w-20"
                  />
                </button>
              ))}
            </div>
          )}

          <div
            className="group relative flex-1 overflow-hidden rounded-2xl bg-gray-100 [@media(hover:hover)]:cursor-zoom-in"
            onMouseMove={handleZoom}
          >
            <img
              ref={zoomRef}
              key={mainImage}
              src={mainImage}
              alt={product.name}
              className="aspect-[4/5] h-full w-full animate-fade-in object-cover transition-transform duration-300 ease-out [@media(hover:hover)]:group-hover:scale-[1.8]"
            />
            {badge && (
              <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-rabbit-red px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="animate-fade-up md:pt-4" style={{ animationDelay: "120ms" }}>
          {product.brand && (
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-500">{product.brand}</p>
          )}
          <Title className="mb-3 text-3xl font-bold tracking-tight md:text-4xl">{product.name}</Title>

          {product.rating > 0 && (
            <div className="mb-4 flex items-center gap-2 text-sm">
              <Stars rating={product.rating} />
              <span className="text-gray-500">
                {product.rating.toFixed(1)}
                {product.numReviews > 0 && ` (${product.numReviews} reviews)`}
              </span>
            </div>
          )}

          <p className="mb-6 text-2xl font-semibold">{formatPrice(product.price)}</p>
          <p className="mb-8 leading-relaxed text-gray-600">{product.description}</p>

          {/* Color */}
          {product.colors?.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium">
                Color: <span className="font-normal text-gray-500">{selectedColor || "Select a color"}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    title={color}
                    aria-label={color}
                    aria-pressed={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-9 w-9 rounded-full border border-gray-300 transition duration-200 hover:scale-110 ${
                      selectedColor === color ? "scale-110 ring-2 ring-gray-950 ring-offset-2" : ""
                    }`}
                    style={{ backgroundColor: color.toLowerCase().replace(/\s/g, "") }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 text-sm font-medium">
                Size: <span className="font-normal text-gray-500">{selectedSize || "Select a size"}</span>
              </p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={selectedSize === size}
                    onClick={() => setSelectedSize(size)}
                    className={`min-w-12 rounded-lg border px-4 py-2 text-sm font-medium transition duration-200 ${
                      selectedSize === size
                        ? "border-gray-950 bg-gray-950 text-white"
                        : "border-gray-300 hover:border-gray-950"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {lowStock && (
            <p className="mb-4 flex items-center gap-2 text-sm font-medium text-rabbit-red">
              <span className="h-2 w-2 animate-pulse rounded-full bg-rabbit-red" />
              Only {product.countInStock} left in stock
            </p>
          )}

          {/* Quantity and add to cart */}
          <div className="mb-8 flex flex-col gap-3 sm:flex-row">
            <div className="flex items-center justify-between rounded-full border border-gray-300 px-1 sm:w-36">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-gray-100"
              >
                <HiMinus className="h-4 w-4" />
              </button>
              <span className="font-medium" aria-live="polite">
                {quantity}
              </span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQuantity((q) => q + 1)}
                className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-gray-100"
              >
                <HiPlus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding || outOfStock}
              className={`btn-shine flex-1 ${justAdded ? "btn-dark !bg-emerald-600" : "btn-dark"}`}
            >
              {outOfStock ? (
                "Out of stock"
              ) : isAdding ? (
                <>
                  <Spinner /> Adding…
                </>
              ) : justAdded ? (
                <>
                  <HiCheck className="h-5 w-5 animate-scale-in" /> Added to cart
                </>
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>

          {/* Perks and details */}
          <ul className="grid gap-3 border-t border-gray-200 pt-6 text-sm text-gray-600 sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <HiOutlineTruck className="h-5 w-5 text-gray-900" /> Free shipping over ₹200
            </li>
            <li className="flex items-center gap-2">
              <HiArrowPath className="h-5 w-5 text-gray-900" /> 45-day easy returns
            </li>
            {product.material && <li>Material: {product.material}</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Shows a product. Pass `productId` to load it, or `product` when the caller
// already has the data (the home page's best seller), which skips the request.
const ProductDetails = ({ productId, product: preloaded, badge, titleAs = "h1" }) => {
  const dispatch = useDispatch();
  const details = useSelector((state) => state.products.productDetails);
  const detailsError = useSelector((state) => state.products.detailsError);

  useEffect(() => {
    if (preloaded || !productId) return undefined;
    const request = dispatch(fetchProductDetails(productId));
    return () => request.abort();
  }, [dispatch, productId, preloaded]);

  // Ignore details left over from a previously viewed product
  const product = preloaded ?? (details?._id === productId ? details : null);

  if (!product) {
    if (detailsError) {
      return <p className="py-20 text-center text-red-600">Couldn&apos;t load this product: {detailsError}</p>;
    }
    return <ProductDetailsSkeleton />;
  }

  // Keyed by ID so selections reset when switching products
  return <ProductInfo key={product._id} product={product} badge={badge} titleAs={titleAs} />;
};

export default ProductDetails;
