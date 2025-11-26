"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { FetchService } from "../../../lib/api/fetch.service";

interface ResultItem {
  id: number;
  full_name_text: string;
  logo?: string;
}

interface Props {
  value: ResultItem | null;
  onChange: (value: ResultItem | null) => void;
  placeholder?: string;
  className?: string;
}

export const AutocompleteSelect: React.FC<Props> = ({
  value,
  onChange,
  placeholder = "Наименование услуги",
  className = "w-full",
}) => {
  const [searchTerm, setSearchTerm] = useState(value?.full_name_text || "");
  const [results, setResults] = useState<ResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchTerm(value?.full_name_text || "");
  }, [value]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchTerm || searchTerm.length < 1) {
        setResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await FetchService.fetch<ResultItem[]>(`/api/v2/home/autofill/?name=${searchTerm}`);
        setResults(data);
        setShowResults(true);
      } catch (error) {
        console.error("Autocomplete fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delay = setTimeout(fetchResults, 300);
    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleSelect = (item: ResultItem) => {
    setSearchTerm(item.full_name_text);
    setShowResults(false);
    onChange(item);
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {/* Input Box */}
      <div className="flex items-center justify-between px-4 py-2 rounded-full bg-blue-50 text-sm text-gray-700 border border-gray-300 cursor-text select-none">
        <input
          type="text"
          placeholder={placeholder}
          className="bg-transparent outline-none w-full text-sm placeholder:text-gray-500"
          value={searchTerm}
          onChange={e => {
            setSearchTerm(e.target.value);
            if (value) onChange(null);
          }}
          onFocus={() => searchTerm.length > 0 && setShowResults(true)}
        />
        {isLoading ? (
          <div className="ml-2 w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        ) : (
          <Search className="w-4 h-4 ml-2 text-gray-500" />
        )}
      </div>

      {/* Dropdown */}
      {showResults && (
        <div className="absolute z-50 mt-1 py-1 bg-white border rounded-md shadow-lg max-h-64 overflow-auto text-sm min-w-[14rem]">
          {results.length > 0 ? (
            results.map(result => (
              <div
                key={result.id}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-blue-100"
                onClick={() => handleSelect(result)}
              >
                <span className="whitespace-nowrap">{result.full_name_text}</span>
              </div>
            ))
          ) : (
            <div className="px-4 py-3 text-center text-gray-500">Нет результатов</div>
          )}
        </div>
      )}
    </div>
  );
};
