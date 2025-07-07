import React, { useState } from 'react';
interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialQuery = '' }) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar" aria-label="Location search form">
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder="Enter city or airport name (e.g., London, LAX)"
        aria-label="Search for locations by city or airport name"
        className="search-input"
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
}

export default SearchBar;
