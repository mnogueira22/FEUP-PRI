import React, { useState, useCallback } from 'react';
import './App.css';
import Card from './components/card';

function App() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCard, setSelectedCard] = useState(null);
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
      console.log(results)
      setCurrentPage(1); // Reset to first page when new search is performed
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

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    if (query.trim()) {
      performSearch(query, newSortOrder);
    }
  };

  const totalPages = Math.ceil(searchResults.length / resultsPerPage);
  const currentResults = searchResults.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <>
      <div className="search-engine-container">
        {!selectedCard && (
          <>
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
          </>
        )}

        <div className="card-container">
          {selectedCard ? (
            <div className="card-detail">
              <h2>{selectedCard.name}</h2>
              <p> <strong> Date </strong>: {selectedCard.date.split("T")[0]}</p>
              <p><strong> Location </strong>: {selectedCard.circuit}, {selectedCard.country}</p>
              <p><strong> Round </strong>: {selectedCard.round}</p>
              <p><strong> Drivers </strong>: {selectedCard.drivers && selectedCard.drivers.length > 0 ? selectedCard.drivers.join(", ") : "No drivers listed"}</p>
              <p><strong> Weather Condition </strong>: {selectedCard.weather_condition}</p>
              <p><strong> Summary </strong>: {selectedCard.summary}</p>
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
              <p>No results found.</p>
            )
          )}
        </div>

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
