import React, { useState, useCallback, useEffect } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCard, setSelectedCard] = useState(null);
  const [circuits, setCircuits] = useState({});
  const [years, setYears] = useState({});
  const [selectCircuit, setSelectCircuit] = useState('');
  const [selectYear, setSelectYear] = useState('');
  const [previousSearches, setPreviousSearches] = useState([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [isInputFocused, setIsInputFocused] = useState(false); // Added state for input focus
  const resultsPerPage = 20;
  
  const performSearch = useCallback(async (searchQuery, order) => {
    try {
      const response = await fetch(`http://localhost:3000/solr-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery, sort: `date ${order}` }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const results = await response.json();
      setSearchResults(results.results || []);

      // Count occurrences of circuits
      const circuitCount = results.results.reduce((acc, result) => {
        const circuit = result.circuit;
        acc[circuit] = (acc[circuit] || 0) + 1;
        return acc;
      }, {});

      setCircuits(circuitCount);

      // Count occurrences of years
      const yearCount = results.results.reduce((acc, result) => {
        const dateStr = result.date;
        const year = new Date(dateStr).getFullYear();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
      }, {});

      setYears(yearCount);

      setCurrentPage(1);

      // Save the search query if it's not already in the list
      if (searchQuery !== '*' && !previousSearches.includes(searchQuery)) {
        setPreviousSearches(prev => [...prev, searchQuery]);
      }
    } catch (error) {
      console.error('Search failed:', error);
      alert(`Search failed: ${error.message}`);
    }
  }, [previousSearches]);

  useEffect(() => {
    performSearch('*', sortOrder);
  }, []);

  const handleCardClick = (card) => {
    setSelectedCard(card);
  };

  const handleBack = () => {
    setSelectedCard(null);
  };

  const handleSearch = () => {
    if (query.trim()) {
      performSearch(query, sortOrder);
      setAutocompleteSuggestions([]); // Clear suggestions after search
    }
  };

  const handleCircuitChange = (e) => {
    setSelectCircuit(e.target.value);
  };

  const handleYearChange = (e) => {
    setSelectYear(e.target.value);
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    if (query.trim()) {
      performSearch(query, newSortOrder);
    }
  };

  const handleQueryChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Generate autocomplete suggestions
    const suggestions = previousSearches.filter(search =>
      search.toLowerCase().startsWith(value.toLowerCase())
    );
    setAutocompleteSuggestions(suggestions);
  };

  const handleAutocompleteSelect = (selectedQuery) => {
    setQuery(selectedQuery);
    performSearch(selectedQuery, sortOrder);
    setAutocompleteSuggestions([]); // Clear suggestions after selection
  };

  const handleInputFocus = () => setIsInputFocused(true); // Added focus handler
  const handleInputBlur = () => {
    // Delay hiding suggestions to allow for clicks on the suggestions
    setTimeout(() => setIsInputFocused(false), 200);
  }; // Added blur handler

  const filteredResults = (selectCircuit || selectYear)
    ? searchResults.filter(result =>
      (!selectCircuit || result.circuit === selectCircuit) &&
      (!selectYear || new Date(result.date).getFullYear() === parseInt(selectYear))
    )
    : searchResults;

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const currentResults = filteredResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <>
      <div className="search-engine-container">
        <div className="logo-container">
          <img src="./src/assets/f1logo2.webp" className="logo" alt="F1 Search Engine Logo" />
        </div>
        <h1>F1 Search Engine</h1>
        <div className="search-bar-container">
          <input
            type="text"
            className="search-bar"
            placeholder="Search F1 races ..."
            value={query}
            onChange={handleQueryChange}
            onFocus={handleInputFocus} // Added focus event handler
            onBlur={handleInputBlur} // Added blur event handler
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
          {isInputFocused && autocompleteSuggestions.length > 0 && ( // Updated condition for rendering suggestions
            <ul className="autocomplete-list">
              {autocompleteSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleAutocompleteSelect(suggestion)}>
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>
        <p className="tagline">Your gate into the F1 World!</p>
        <div className="sort-container">
          <label>
            Sort by Date:
            <select value={sortOrder} onChange={handleSortChange}>
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
          <label>
            Filter by Circuit:
            <select value={selectCircuit} onChange={handleCircuitChange}>
              <option value="">All Circuits</option>
              {Object.entries(circuits).map(([circuit, count], index) => (
                <option key={index} value={circuit}>
                  {circuit}: {count}
                </option>
              ))}
            </select>
          </label>
          <label>
            Filter by Year:
            <select value={selectYear} onChange={handleYearChange}>
              <option value="">All Years</option>
              {Object.entries(years).map(([year, count], index) => (
                <option key={index} value={year}>
                  {year}: {count}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="main-content">

          {/* Main Results Section */}
          <div className="card-container">
            {selectedCard ? (
              <div className="card-detail">
                <h2>{selectedCard.name}</h2>
                <p><strong>Date</strong>: {selectedCard.date.split("T")[0]}</p>
                <p><strong>Location</strong>: {selectedCard.circuit}, {selectedCard.country}</p>
                <p><strong>Round</strong>: {selectedCard.round}</p>
                <p><strong>Drivers</strong>: {selectedCard.drivers && selectedCard.drivers.length > 0 ? selectedCard.drivers.join(", ") : "No drivers listed"}</p>
                <p><strong>Weather Condition</strong>: {selectedCard.weather_condition}</p>
                <p><strong>Summary</strong>: {selectedCard.summary}</p>
                <button onClick={handleBack}>Back</button>
              </div>
            ) : (
              currentResults.length > 0 ? (
                currentResults.map((result, index) => (
                  <div
                    className="card"
                    key={index}
                    onClick={() => handleCardClick(result)}
                  >
                    <h3>{result.name}</h3>
                    <p>Date: {result.date.split("T")[0]}</p>
                    <p>Location: {result.circuit}, {result.country}</p>
                  </div>
                ))
              ) : (
                null
              )
            )}
          </div>
        </div>

        {/* Pagination Section */}
        {!selectedCard && searchResults.length > resultsPerPage && (
          <div className="pagination-container">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
            >
              Previous
            </button>
            <span>{currentPage} / {totalPages}</span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;

