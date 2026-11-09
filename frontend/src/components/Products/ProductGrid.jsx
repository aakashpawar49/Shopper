import { Link } from "react-router-dom";
import { HiOutlineFaceFrown } from "react-icons/hi2";
import ProductCard from "./ProductCard";
import { ProductGridSkeleton } from "../Common/Skeletons";

const ProductGrid = ({ products, loading, error, skeletonCount = 8 }) => {
  if (loading) return <ProductGridSkeleton count={skeletonCount} />;

  if (error) {
    return <p className="py-16 text-center text-red-600">Couldn&apos;t load products: {error}</p>;
  }

  if (!products?.length) {
    return (
      <div className="flex animate-fade-in flex-col items-center py-20 text-center">
        <HiOutlineFaceFrown className="mb-4 h-12 w-12 text-gray-300" />
        <p className="mb-1 text-lg font-semibold">No products found</p>
        <p className="mb-6 text-sm text-gray-500">Try removing a filter or searching for something else.</p>
        <Link to="/collections/all" className="btn-outline">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
      {products.map((product, index) => (
        <ProductCard key={product._id} product={product} index={index} />
      ))}
    </div>
  );
};

export default ProductGrid;
