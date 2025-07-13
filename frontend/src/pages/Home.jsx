import { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeatureSection from "../components/Products/FeatureSection";
import GenderCollection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../redux/slices/productSlice";
import axios from "axios";

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const [bestSeller, setBestSeller] = useState(null);

  useEffect(() => {
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );

    const fetchBestSeller = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSeller(data);
      } catch (err) {
        console.error("Best seller fetch failed:", err.message);
      }
    };

    fetchBestSeller();
  }, [dispatch]);

  return (
    <div>
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* Best Seller */}
      <section className="my-12">
        <h2 className="text-3xl font-bold text-center mb-4">Best Seller</h2>
        {bestSeller ? (
          <ProductDetails productId={bestSeller._id} readonly />
        ) : (
          <p className="text-center">Loading best seller product...</p>
        )}
      </section>

      {/* Top Wear Section */}
      <section className="my-12 container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-4">
          Top Wear for Women
        </h2>
        {loading ? (
          <p className="text-center">Loading products...</p>
        ) : error ? (
          <p className="text-center text-red-600">Error: {error}</p>
        ) : products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <p className="text-center">No products found.</p>
        )}
      </section>

      <FeaturedCollection />
      <FeatureSection />
    </div>
  );
};

export default Home;
