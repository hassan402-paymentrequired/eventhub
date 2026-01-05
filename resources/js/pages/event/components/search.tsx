import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = [
    'Rock concerts near me',
    'Food festivals this weekend',
    'Tech conferences',
    'Art exhibitions',
    'Sports events'
  ];

  const filteredSuggestions = suggestions?.filter(s =>
    s?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="relative flex-1 max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e?.target?.value);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="Search events, venues, or artists..."
          className="w-full pl-12 pr-12 py-3 bg-card border-2 border-primary font-medium text-primary placeholder:text-muted-foreground focus:outline-none focus:border-accent brutalist-shadow"
        />
        {searchQuery && (
          <button
            onClick={() => {
              setSearchQuery('');
              setShowSuggestions(false);
            }}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
            aria-label="Clear search"
          >
            <X size={20} />
          </button>
        )}
      </div>
      {/* Autocomplete Suggestions */}
      {showSuggestions && searchQuery && filteredSuggestions?.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border-2 border-primary brutalist-shadow z-10">
          {filteredSuggestions?.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchQuery(suggestion);
                setShowSuggestions(false);
              }}
              className="w-full text-left px-4 py-3 hover:bg-concrete transition-colors border-b border-concrete last:border-b-0 font-medium text-primary"
            >
              <Search size={16} className="inline mr-2 text-muted-foreground" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;