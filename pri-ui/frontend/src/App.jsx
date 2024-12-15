import React, { useState, useCallback } from 'react';
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
  const resultsPerPage = 18;

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
    } catch (error) {
      console.error('Search failed:', error);
      alert(`Search failed: ${error.message}`);
    }
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
    } else {
      alert('Please enter a search term.');
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
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
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
        </div>

        <div className="main-content">
          {/* Sidebar Section */}
          {!selectedCard && (
            <div className="sidebar">
              <div>
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
              </div>

              <div>
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
            </div>
          )}

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
                <p>No results found</p>
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
