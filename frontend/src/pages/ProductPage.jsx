import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import SectionHeading from "../components/Common/SectionHeading";
import { fetchSimilarProducts } from "../redux/slices/productSlice";

const ProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const similarProducts = useSelector((state) => state.products.similarProducts);

  useEffect(() => {
    const request = dispatch(fetchSimilarProducts({ id }));
    return () => request.abort();
  }, [dispatch, id]);

  return (
    <>
      <ProductDetails productId={id} />
      {similarProducts.length > 0 && (
        <section className="container mx-auto px-6 pb-20 pt-10">
          <SectionHeading eyebrow="Curated for you" title="You May Also Like" />
          <ProductGrid products={similarProducts} />
        </section>
      )}
    </>
  );
};

export default ProductPage;
