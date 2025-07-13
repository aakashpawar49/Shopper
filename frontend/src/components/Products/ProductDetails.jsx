import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice";
import { addToCart } from "../../redux/slices/cartSlice";
import ProductGrid from "./ProductGrid";

const ProductDetails = ({ productId, readonly = false }) => {
  const { id: paramId } = useParams();
  const dispatch = useDispatch();
  const {
    productDetails,
    similarProducts,
    loading,
    error,
  } = useSelector((state) => state.products);
  const { user, guestId } = useSelector((state) => state.auth);

  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const actualId = productId || paramId;

  useEffect(() => {
    if (!actualId || actualId === "undefined") return;
    dispatch(fetchProductDetails(actualId));
    if (!readonly) dispatch(fetchSimilarProducts({ id: actualId }));
  }, [dispatch, actualId, readonly]);

  useEffect(() => {
    if (productDetails?.images?.length > 0) {
      setMainImage(productDetails.images[0].url);
    }
  }, [productDetails]);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      toast.error("Select both color and size.");
      return;
    }

    setIsAdding(true);
    dispatch(
      addToCart({
        productId: actualId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .unwrap()
      .then(() => toast.success("Added to cart!"))
      .catch((err) => toast.error("Failed to add: " + err))
      .finally(() => setIsAdding(false));
  };

  if (loading || !productDetails) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-600">Error: {error}</p>;

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Thumbnails */}
          <div className="hidden md:flex flex-col space-y-4">
            {productDetails.images.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={img.altText || "Thumb"}
                onClick={() => setMainImage(img.url)}
                className={`w-20 h-20 object-cover cursor-pointer border rounded ${
                  mainImage === img.url ? "border-black" : "border-gray-300"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          <img
            src={mainImage}
            alt="Main"
            className="w-full md:w-1/2 rounded-lg object-cover"
          />

          {/* Product Info */}
          <div className="md:w-1/2 space-y-4">
            <h1 className="text-2xl font-bold">{productDetails.name}</h1>
            <p className="text-lg text-gray-600 line-through">
              ₹{productDetails.originalPrice}
            </p>
            <p className="text-xl text-gray-800">₹{productDetails.price}</p>
            <p className="text-gray-600">{productDetails.description}</p>

            {!readonly && (
              <>
                {/* Color */}
                <div>
                  <p>Color:</p>
                  <div className="flex gap-2">
                    {productDetails.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full border ${
                          selectedColor === color
                            ? "border-4 border-black"
                            : "border-2 border-gray-300"
                        }`}
                        style={{
                          backgroundColor: color.toLowerCase().replace(/\s/g, ""),
                        }}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <p>Size:</p>
                  <div className="flex gap-2">
                    {productDetails.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded border ${
                          selectedSize === size ? "bg-black text-white" : ""
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    -
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={handleAddToCart}
                  disabled={isAdding}
                  className="w-full mt-4 bg-black text-white py-2 rounded hover:bg-gray-900"
                >
                  {isAdding ? "Adding..." : "Add to Cart"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {!readonly && similarProducts?.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl text-center mb-4">You May Also Like</h2>
          <ProductGrid products={similarProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
