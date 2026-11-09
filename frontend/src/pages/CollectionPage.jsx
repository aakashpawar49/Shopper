import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiAdjustmentsHorizontal, HiXMark } from "react-icons/hi2";
import FilterSidebar from "../components/Products/FilterSidebar";
import SortOptions from "../components/Products/SortOptions";
import ProductGrid from "../components/Products/ProductGrid";
import { fetchProductsByFilters } from "../redux/slices/productSlice";
import useOverlay from "../hooks/useOverlay";

const FILTER_LABELS = {
  search: "Search",
  category: "Category",
  gender: "Gender",
  color: "Color",
  size: "Size",
  material: "Material",
  brand: "Brand",
  maxPrice: "Max price",
};

// Page title from the active filters, e.g. "Women's Top Wear"
const getTitle = (params) => {
  const search = params.get("search");
  if (search) return `Results for “${search}”`;
  const gender = params.get("gender");
  const category = params.get("category");
  if (gender && category) return `${gender}'s ${category}`;
  if (gender) return `${gender}'s Collection`;
  if (category) return category;
  return "All Collection";
};

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.products);
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = useCallback(() => setIsSidebarOpen(false), []);
  useOverlay(isSidebarOpen, closeSidebar);

  // Refetch whenever the filters in the URL change. Aborting the previous
  // request means a slow, outdated response can never overwrite a newer one.
  const queryString = searchParams.toString();
  useEffect(() => {
    const filters = Object.fromEntries(new URLSearchParams(queryString));
    const request = dispatch(fetchProductsByFilters({ collection, ...filters }));
    return () => request.abort();
  }, [dispatch, collection, queryString]);

  const activeFilters = [...searchParams].filter(([key]) => FILTER_LABELS[key]);

  const removeFilter = (key) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete(key);
      if (key === "maxPrice") next.delete("minPrice");
      return next;
    });

  return (
    <div className="container mx-auto flex flex-col px-4 py-8 lg:flex-row lg:gap-10 lg:px-6">
      {/* Mobile backdrop */}
      <div
        aria-hidden="true"
        onClick={closeSidebar}
        className={`fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden ${
          isSidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Filters: slide-in drawer on mobile, sticky column on desktop */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 overflow-y-auto bg-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:sticky lg:bottom-auto lg:top-24 lg:z-0 lg:h-[calc(100vh-7rem)] lg:w-64 lg:shrink-0 lg:translate-x-0 lg:shadow-none ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={closeSidebar}
          aria-label="Close filters"
          className="absolute right-3 top-3 rounded-full p-2 transition hover:rotate-90 hover:bg-gray-100 lg:hidden"
        >
          <HiXMark className="h-5 w-5" />
        </button>
        <FilterSidebar />
      </aside>

      <div className="min-w-0 flex-grow">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="animate-fade-up text-3xl font-bold tracking-tight md:text-4xl">
              {getTitle(searchParams)}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {loading ? "Loading products…" : `${products.length} product${products.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium transition hover:border-gray-950 lg:hidden"
            >
              <HiAdjustmentsHorizontal className="h-5 w-5" /> Filters
            </button>
            <SortOptions />
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-2">
            {activeFilters.map(([key, value]) => (
              <button
                key={key}
                type="button"
                onClick={() => removeFilter(key)}
                className="group inline-flex animate-scale-in items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium transition hover:bg-gray-950 hover:text-white"
              >
                {FILTER_LABELS[key]}: {key === "maxPrice" ? `₹${value}` : value.replaceAll(",", ", ")}
                <HiXMark className="h-3.5 w-3.5 transition-transform group-hover:rotate-90" />
              </button>
            ))}
            <button
              type="button"
              onClick={() => setSearchParams({})}
              className="link-underline ml-1 text-xs font-semibold text-gray-600 hover:text-black"
            >
              Clear all
            </button>
          </div>
        )}

        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
