import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";

const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleSearchToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        console.log("Search Term: ", searchTerm);
        setIsOpen(false);
    };

    return (
        <div className={`flex items-center justify-center w-full transition-all duration-300 
            ${isOpen ? "fixed inset-0 bg-white h-24 z-50" : "w-auto"}
        `}>
            {isOpen ? (
                <form onSubmit={handleSearch} className="relative flex items-center justify-center w-full">
                    {/* Close Button */}
                    <button 
                        type="button"
                        onClick={handleSearchToggle}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                    >
                        <HiMiniXMark className="h-6 w-6"/>
                    </button>

                    <div className="relative w-1/2">
                        <input 
                            type="text"
                            placeholder="Search" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="bg-gray-100 px-4 py-2 pl-10 pr-12 rounded-lg focus:ring-2 focus:ring-gray-400 w-full placeholder:text-gray-500"
                        />
                        {/* Search Icon */}
                        <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800">
                            <HiMagnifyingGlass className="h-6 w-6" />
                        </button>
                    </div>
                </form>
            ) : (
                <button onClick={handleSearchToggle}>
                    <HiMagnifyingGlass className="h-6 w-6"/>
                </button>
            )}
        </div>
    );
};

export default SearchBar;