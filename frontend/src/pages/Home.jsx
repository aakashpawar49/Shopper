import Hero from "../components/Layout/Hero";
import GenderCollection from "../components/Products/GenderCollectionSection"
import NewArrivals from "../components/Products/NewArrivals"
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";

const placeholderProducts = [
  {
    id: 1,
    name: "Product 1",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=2" }],
  },
  {
    id: 2,
    name: "Product 2",
    price: 150,
    images: [{ url: "https://picsum.photos/500/500?random=1" }],
  },
  {
    id: 3,
    name: "Product 3",
    price: 120,
    images: [{ url: "https://picsum.photos/500/500?random=4" }],
  },
  {
    id: 4,
    name: "Product 4",
    price: 180,
    images: [{ url: "https://picsum.photos/500/500?random=3" }],
  },
  {
    id: 5,
    name: "Product 5",
    price: 100,
    images: [{ url: "https://picsum.photos/500/500?random=7" }],
  },
  {
    id: 6,
    name: "Product 6",
    price: 150,
    images: [{ url: "https://picsum.photos/500/500?random=8" }],
  },
  {
    id: 7,
    name: "Product 7",
    price: 120,
    images: [{ url: "https://picsum.photos/500/500?random=9" }],
  },
  {
    id: 8,
    name: "Product 8",
    price: 180,
    images: [{ url: "https://picsum.photos/500/500?random=6" }],
  },
]

const Home = () => {
  return (
    <div>
        <Hero />
        <GenderCollection />
        <NewArrivals />

        {/* Best Seller */}
        <h2 className="text-3xl text-center font-bold mb-4">Best
          Seller</h2>
        <ProductDetails />

        <div className="container mx-auto">
          <h2 className="text-3xl text-center font-bold mb-4">
            Top Wear for Women 
          </h2>
          <ProductGrid products={placeholderProducts}/>
        </div>
    </div>
  )
}

export default Home;