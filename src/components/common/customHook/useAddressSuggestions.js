import { useState, useRef, useEffect } from "react";

const useAddressSuggestions = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!query || query.length < 1) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setShowSuggestions(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
            query
          )}&limit=10&format=json&apiKey=${
            import.meta.env.VITE_GEOAPIFY_API_KEY
          }`
        );
        const result = await res.json();

        if (result.results && result.results.length > 0) {
          const addresses = result.results.map((item) => ({
            value: item.formatted,
            label: item.formatted,
          }));

          setSuggestions(addresses);
          setError(null);
          setShowSuggestions(addresses.length > 0);
        } else {
          setSuggestions([]);
          setError("No results found.");
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setSuggestions([]);
        setError("Failed to fetch address suggestions.");
        setShowSuggestions(false);
      }
    }, 500);
  }, [query]);

  return {
    query,
    setQuery,
    suggestions,
    error,
    showSuggestions,
    setShowSuggestions,
  };
};

export default useAddressSuggestions;
