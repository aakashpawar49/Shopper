import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Link key={index} to={`/product/${product?._id}`} className="block">
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
            <div className="w-full aspect-[4/5] mb-4">
              <img
                src={product.images?.[0]?.url || "/placeholder.jpg"}
                alt={product.images?.[0]?.altText || product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-sm font-medium mb-2">{product.name}</h3>
            <p className="text-gray-600 font-semibold text-sm tracking-tight">
              ₹ {product.price}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;