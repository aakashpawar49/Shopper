import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

const CATEGORIES = ["Top Wear", "Bottom Wear"];
const GENDERS = ["Men", "Women"];
const COLORS = ["Red", "Blue", "Black", "Green", "Yellow", "Grey", "White", "Pink", "Beige", "Navy"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const MATERIALS = ["Cotton", "Wool", "Denim", "Polyester", "Silk", "Linen", "Viscose", "Fleece"];
const BRANDS = ["Urban Threads", "Nike", "Adidas", "Puma", "Levis", "Ray Ban"];
const PRICE_MAX = 1000;
const PRICE_DEBOUNCE_MS = 350;

const chipClass = (active) =>
  `rounded-full border px-4 py-1.5 text-sm transition duration-200 ${
    active ? "border-gray-950 bg-gray-950 text-white" : "border-gray-300 text-gray-700 hover:border-gray-950"
  }`;

const FilterGroup = ({ title, children }) => (
  <fieldset className="mb-7">
    <legend className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-500">{title}</legend>
    {children}
  </fieldset>
);

// The URL is the single source of truth for the filters: the sidebar reads
// from it and writes to it, and the collection page refetches when it changes.
const FilterSidebar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const getList = (key) => searchParams.get(key)?.split(",").filter(Boolean) ?? [];

  const urlMaxPrice = Number(searchParams.get("maxPrice")) || PRICE_MAX;
  const [maxPrice, setMaxPrice] = useState(urlMaxPrice);
  const [syncedMaxPrice, setSyncedMaxPrice] = useState(urlMaxPrice);
  const priceTimer = useRef(null);

  // Follow the URL when it changes elsewhere (e.g. "Clear all")
  if (urlMaxPrice !== syncedMaxPrice) {
    setSyncedMaxPrice(urlMaxPrice);
    setMaxPrice(urlMaxPrice);
  }

  useEffect(() => () => clearTimeout(priceTimer.current), []);

  // Apply changes to the current URL params, keeping the others (search, sort, ...)
  const updateParams = (changes) =>
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      Object.entries(changes).forEach(([key, value]) => {
        const text = Array.isArray(value) ? value.join(",") : String(value ?? "");
        if (text) next.set(key, text);
        else next.delete(key);
      });
      return next;
    });

  // Single-choice filters: clicking the selected option clears it
  const toggleSingle = (key, value) => updateParams({ [key]: searchParams.get(key) === value ? "" : value });

  // Multi-choice filters
  const toggleMulti = (key, value) => {
    const current = getList(key);
    updateParams({
      [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    });
  };

  // The slider updates instantly, but the URL (and the API request) only
  // changes once the user stops dragging.
  const handlePriceChange = (e) => {
    const value = Number(e.target.value);
    setMaxPrice(value);
    clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(() => {
      updateParams({ minPrice: "", maxPrice: value >= PRICE_MAX ? "" : value });
    }, PRICE_DEBOUNCE_MS);
  };

  const sizes = getList("size");
  const materials = getList("material");
  const brands = getList("brand");

  return (
    <div className="p-6 lg:px-0 lg:pt-2">
      <h3 className="mb-6 text-xl font-bold">Filters</h3>

      <FilterGroup title="Category">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={searchParams.get("category") === category}
              onClick={() => toggleSingle("category", category)}
              className={chipClass(searchParams.get("category") === category)}
            >
              {category}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Gender">
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((gender) => (
            <button
              key={gender}
              type="button"
              aria-pressed={searchParams.get("gender") === gender}
              onClick={() => toggleSingle("gender", gender)}
              className={chipClass(searchParams.get("gender") === gender)}
            >
              {gender}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Color">
        <div className="flex flex-wrap gap-2.5">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              title={color}
              aria-label={color}
              aria-pressed={searchParams.get("color") === color}
              onClick={() => toggleSingle("color", color)}
              className={`h-8 w-8 rounded-full border border-gray-300 transition duration-200 hover:scale-110 ${
                searchParams.get("color") === color ? "scale-110 ring-2 ring-gray-950 ring-offset-2" : ""
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Size">
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={sizes.includes(size)}
              onClick={() => toggleMulti("size", size)}
              className={`min-w-11 ${chipClass(sizes.includes(size))}`}
            >
              {size}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Material">
        {MATERIALS.map((material) => (
          <label key={material} className="flex cursor-pointer items-center gap-3 py-1 text-sm text-gray-700 hover:text-black">
            <input
              type="checkbox"
              checked={materials.includes(material)}
              onChange={() => toggleMulti("material", material)}
              className="h-4 w-4 rounded border-gray-300 accent-gray-950"
            />
            {material}
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Brand">
        {BRANDS.map((brand) => (
          <label key={brand} className="flex cursor-pointer items-center gap-3 py-1 text-sm text-gray-700 hover:text-black">
            <input
              type="checkbox"
              checked={brands.includes(brand)}
              onChange={() => toggleMulti("brand", brand)}
              className="h-4 w-4 rounded border-gray-300 accent-gray-950"
            />
            {brand}
          </label>
        ))}
      </FilterGroup>

      <FilterGroup title="Price Range">
        <input
          type="range"
          min={0}
          max={PRICE_MAX}
          step={10}
          value={maxPrice}
          onChange={handlePriceChange}
          aria-label="Maximum price"
          className="w-full cursor-pointer accent-gray-950"
        />
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span>₹0</span>
          <span className="font-semibold text-gray-950">
            {maxPrice >= PRICE_MAX ? `₹${PRICE_MAX}+` : `Up to ₹${maxPrice}`}
          </span>
        </div>
      </FilterGroup>
    </div>
  );
};

export default FilterSidebar;
