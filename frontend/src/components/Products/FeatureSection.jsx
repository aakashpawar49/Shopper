import { 
    HiShoppingBag,
    HiArrowPath,
    HiOutlineCreditCard
} from "react-icons/hi2";

const FeatureSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        
        {/* Feature - 1 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full bg-gray-200 mb-4">
            <HiShoppingBag className="text-3xl text-gray-700"/>
          </div>
          <h4 className="tracking-tighter font-semibold mb-2">FREE INTERNATIONAL SHIPPING</h4>
          <p className="text-gray-600 text-sm tracking-tighter mt-1">
            On all orders over $200.00
          </p>
        </div>

        {/* Feature - 2 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full bg-gray-200 mb-4">
            <HiArrowPath className="text-3xl text-gray-700"/>
          </div>
          <h4 className="tracking-tighter font-semibold mb-2">45 DAYS RETURN</h4>
          <p className="text-gray-600 text-sm tracking-tighter mt-1">
            Money back guarantee
          </p>
        </div>

        {/* Feature - 3 */}
        <div className="flex flex-col items-center">
          <div className="p-4 rounded-full bg-gray-200 mb-4">
            <HiOutlineCreditCard className="text-3xl text-gray-700"/>
          </div>
          <h4 className="tracking-tighter font-semibold mb-2">SECURE CHECKOUT</h4>
          <p className="text-gray-600 text-sm tracking-tighter mt-1">
            100% secured checkout process.
          </p>
        </div>

      </div>
    </section>
  );
};

export default FeatureSection;