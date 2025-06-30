import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiSearch,
  FiX,
  FiLoader,
  FiZap,
  FiTrendingUp,
  FiClock,
  FiFilter,
  FiChevronDown
} = FiIcons;

const IntelligentSearch = ({ onSearch, onClear, placeholder = "Ask me anything... 'I need help with career transition'", isLoading = false }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const inputRef = useRef(null);
  const suggestionTimeout = useRef(null);

  const popularQueries = [
    "I need help with career transition",
    "Looking for life coaching",
    "Need business strategy advice",
    "Want to improve leadership skills",
    "Seeking relationship counseling",
    "Need help with anxiety",
    "Want to start a business",
    "Looking for executive coaching"
  ];

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('wizardoo_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const handleSearch = async (searchQuery = query) => {
    if (!searchQuery.trim()) return;

    // Add to recent searches
    const updated = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('wizardoo_recent_searches', JSON.stringify(updated));

    setShowSuggestions(false);
    onSearch(searchQuery);
    
    // Focus back to input for better UX
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Show suggestions after user stops typing
    if (suggestionTimeout.current) {
      clearTimeout(suggestionTimeout.current);
    }

    if (value.length > 2) {
      suggestionTimeout.current = setTimeout(() => {
        setShowSuggestions(true);
      }, 300);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    onClear();
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const getSuggestions = () => {
    if (!query.trim()) return [];
    
    const filtered = popularQueries.filter(q => 
      q.toLowerCase().includes(query.toLowerCase()) && 
      q.toLowerCase() !== query.toLowerCase()
    );
    
    return filtered.slice(0, 3);
  };

  const currentSuggestions = getSuggestions();

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          {isLoading ? (
            <SafeIcon icon={FiLoader} className="h-5 w-5 text-purple-600 animate-spin" />
          ) : (
            <SafeIcon icon={FiSearch} className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowSuggestions(query.length > 2)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all duration-200 bg-white shadow-sm hover:shadow-md"
          disabled={isLoading}
        />

        {/* Clear Button */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <SafeIcon icon={FiX} className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* AI-Powered Badge */}
      <div className="flex items-center justify-center mt-2 mb-4">
        <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 rounded-full">
          <SafeIcon icon={FiZap} className="w-4 h-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-700">AI-Powered Search</span>
        </div>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (query.length > 2 || recentSearches.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* Smart Suggestions */}
            {currentSuggestions.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2 mb-3">
                  <SafeIcon icon={FiZap} className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-gray-700">Smart Suggestions</span>
                </div>
                <div className="space-y-2">
                  {currentSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(suggestion)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-purple-50 text-gray-700 hover:text-purple-700 transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center space-x-2 mb-3">
                  <SafeIcon icon={FiClock} className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                </div>
                <div className="space-y-2">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-800 transition-colors"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Queries */}
            {query.length <= 2 && (
              <div className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <SafeIcon icon={FiTrendingUp} className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-gray-700">Popular Searches</span>
                </div>
                <div className="space-y-2">
                  {popularQueries.slice(0, 4).map((query, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(query)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-green-50 text-gray-600 hover:text-green-700 transition-colors"
                    >
                      {query}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntelligentSearch;