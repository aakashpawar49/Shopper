import { useSearchParams } from "react-router-dom";
import { HiChevronDown } from "react-icons/hi2";

const SortOptions = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleSortChange = (e) => {
    const sortBy = e.target.value;
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (sortBy) next.set("sortBy", sortBy);
      else next.delete("sortBy");
      return next;
    });
  };

  return (
    <div className="relative">
      <select
        id="sort"
        aria-label="Sort products"
        value={searchParams.get("sortBy") || ""}
        onChange={handleSortChange}
        className="cursor-pointer appearance-none rounded-full border border-gray-300 bg-white py-2 pl-4 pr-10 text-sm font-medium transition hover:border-gray-950 focus:border-gray-950 focus:outline-none focus:ring-4 focus:ring-gray-950/10"
      >
        <option value="">Sort: Default</option>
        <option value="priceAsc">Price: Low to High</option>
        <option value="priceDesc">Price: High to Low</option>
        <option value="popularity">Popularity</option>
      </select>
      <HiChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
    </div>
  );
};

export default SortOptions;
