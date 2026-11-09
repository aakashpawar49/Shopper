import { useCallback, useState } from "react";
import { createPortal } from "react-dom";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import useOverlay from "../../hooks/useOverlay";

const POPULAR_SEARCHES = ["T-Shirt", "Jeans", "Jacket", "Linen", "Hoodie", "Shorts"];

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const close = useCallback(() => setIsOpen(false), []);
  useOverlay(isOpen, close);

  // The collection page reads ?search= and fetches the results itself
  const goToResults = (term) => {
    const query = term.trim();
    if (!query) return;
    navigate(`/collections/all?search=${encodeURIComponent(query)}`);
    setIsOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    goToResults(searchTerm);
  };

  return (
    <>
      <button
        type="button"
        aria-label="Search"
        onClick={() => setIsOpen(true)}
        className="text-gray-700 transition hover:scale-110 hover:text-black"
      >
        <HiMagnifyingGlass className="h-6 w-6" />
      </button>

      {/* Rendered into <body> so the overlay isn't clipped by the blurred navbar */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search products">
            <div className="absolute inset-0 animate-fade-in bg-black/40 backdrop-blur-sm" onClick={close} />
            <form onSubmit={handleSearch} className="relative animate-slide-down bg-white shadow-2xl">
              <div className="container mx-auto flex items-center gap-4 px-6 pt-6">
                <HiMagnifyingGlass className="h-6 w-6 shrink-0 text-gray-400" />
                <input
                  type="search"
                  autoFocus
                  placeholder="Search for products…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="min-w-0 flex-1 bg-transparent py-2 text-lg outline-none placeholder:text-gray-400 md:text-2xl"
                />
                <button type="submit" className="btn-dark hidden sm:inline-flex">
                  Search
                </button>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close search"
                  className="rounded-full p-2 text-gray-600 transition duration-300 hover:rotate-90 hover:bg-gray-100"
                >
                  <HiMiniXMark className="h-6 w-6" />
                </button>
              </div>
              <div className="container mx-auto flex flex-wrap items-center gap-2 px-6 pb-6 pt-4 text-sm">
                <span className="mr-1 text-gray-500">Popular:</span>
                {POPULAR_SEARCHES.map((term, index) => (
                  <button
                    key={term}
                    type="button"
                    onClick={() => goToResults(term)}
                    style={{ animationDelay: `${120 + index * 50}ms` }}
                    className="animate-fade-up rounded-full border border-gray-200 px-3 py-1 text-gray-700 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </form>
          </div>,
          document.body
        )}
    </>
  );
};

export default SearchBar;
