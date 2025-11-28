import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useRouter } from "@/i18n/routing";

const AutocompleteSearch = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    // Function to handle clicks outside the search component
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (searchTerm.length < 1) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`https://new-api.openinfo.uz/api/v2/home/autofill/?name=${searchTerm}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
          setShowResults(true);
        } else {
          console.error("Error fetching data");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(() => {
      fetchResults();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleItemClick = result => {
    // You can handle the selection here
    router.push(`/organizations/${result.id}`, { scroll: false });
    console.log("Selected:", result);
    setSearchTerm(result.full_name_text);
    setShowResults(false);
  };

  return (
    <div className="w-full max-w-xl px-8" ref={searchRef}>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 scale-75 text-white/80" />

        <input
          type="text"
          placeholder="Search"
          className="w-full h-8 pl-4 pr-10 py-0
             rounded-full
             border border-white/20
             bg-white/10
             text-white
             placeholder-white/60
             focus:outline-none
             focus:ring-2 focus:ring-white/30"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onFocus={() => searchTerm.length > 0 && setShowResults(true)}
        />

        {isLoading && (
          <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {showResults && results.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-default rounded-xl shadow-lg max-h-60 overflow-y-auto">
            {results.map(result => (
              <div
                key={result.id}
                className="flex items-center p-3 hover:bg-gray-100 cursor-pointer border-b border-default"
                onClick={() => handleItemClick(result)}
              >
                <div className="text-sm">{result.full_name_text}</div>
              </div>
            ))}
          </div>
        )}

        {showResults && searchTerm && results.length === 0 && !isLoading && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-default rounded-xl shadow-lg p-3 text-center text-gray-500">
            No results found
          </div>
        )}
      </div>
    </div>
  );
};

export default AutocompleteSearch;
