import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Hero from "../components/Layout/Hero";
import BrandMarquee from "../components/Layout/BrandMarquee";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import FeatureSection from "../components/Products/FeatureSection";
import GenderCollection from "../components/Products/GenderCollectionSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import SectionHeading from "../components/Common/SectionHeading";
import { ProductDetailsSkeleton } from "../components/Common/Skeletons";
import { fetchProductsByFilters } from "../redux/slices/productSlice";
import api from "../lib/api";

const Home = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);
  const [bestSeller, setBestSeller] = useState(null);
  const [bestSellerFailed, setBestSellerFailed] = useState(false);

  useEffect(() => {
    const request = dispatch(fetchProductsByFilters({ gender: "Women", category: "Top Wear", limit: 8 }));
    return () => request.abort();
  }, [dispatch]);

  // The best-seller response is the full product, so it is handed straight to
  // ProductDetails instead of being fetched a second time by ID.
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/products/best-seller", { signal: controller.signal })
      .then(({ data }) => setBestSeller(data))
      .catch((err) => {
        if (controller.signal.aborted) return;
        console.error("Best seller fetch failed:", err.message);
        setBestSellerFailed(true);
      });
    return () => controller.abort();
  }, []);

  return (
    <>
      <Hero />
      <GenderCollection />
      <BrandMarquee />
      <NewArrivals />

      {!bestSellerFailed && (
        <section className="bg-gray-50 px-4 py-16">
          <SectionHeading
            eyebrow="Most loved"
            title="Best Seller"
            subtitle="The piece everyone keeps coming back for."
          />
          {bestSeller ? (
            <ProductDetails product={bestSeller} badge="Best Seller" titleAs="h3" />
          ) : (
            <ProductDetailsSkeleton />
          )}
        </section>
      )}

      <section className="container mx-auto px-4 py-16 md:px-6">
        <SectionHeading eyebrow="Trending now" title="Top Wear for Women" />
        <ProductGrid products={products} loading={loading} error={error} />
        {!loading && products.length > 0 && (
          <div className="mt-12 text-center">
            <Link to="/collections/all?gender=Women&category=Top Wear" className="btn-outline">
              View all
            </Link>
          </div>
        )}
      </section>

      <FeaturedCollection />
      <FeatureSection />
    </>
  );
};

export default Home;
