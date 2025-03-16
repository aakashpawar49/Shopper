import { Link } from "react-router-dom";
import mensCollectionImage from "../../assets/mens-collection.webp";
import womensCollectionImage from "../../assets/womens-collection.webp";

const GenderCollectionSection = () => {
  return (
    <section className="py-16 px-4 md:px-8 lg:px-12">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Women's Collection */}
        <div className="relative flex-1">
          <img
            src={womensCollectionImage}
            alt="Women's Collection"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-black bg-opacity-50 text-white p-4">
            <h2 className="text-2xl font-bold mb-3">Women's Collection</h2>
            <Link to="/collections/all?gender=women" className="underline">
              Shop Now
            </Link>
          </div>
        </div>

        {/* Men's Collection */}
        <div className="relative flex-1">
          <img
            src={mensCollectionImage}
            alt="Men's Collection"
            className="w-full h-[700px] object-cover"
          />
          <div className="absolute bottom-8 left-8 bg-black bg-opacity-50 text-white p-4">
            <h2 className="text-2xl font-bold mb-3">Men's Collection</h2>
            <Link to="/collections/all?gender=men" className="underline">
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollectionSection;