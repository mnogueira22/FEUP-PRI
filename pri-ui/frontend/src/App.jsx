import React, { useState, useCallback } from 'react';
import './App.css';
import Card from './components/card';

function App() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
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
      setCurrentPage(1); // Reset to first page when new search is performed
    } catch (error) {
      console.error('Search failed:', error);
      alert(`Search failed: ${error.message}`);
    }
  }, []);

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
      </div>

      <div className="card-container">
        {currentResults.length > 0 ? (
          currentResults.map((result, index) => (
            <Card 
              key={index}
              name={result.name}
              date={result.date}
              location={`${result.circuit}, ${result.country}`}
            />
          ))
        ) : (
          <p>
		  </p>
        )}
      </div>

      {searchResults.length > resultsPerPage && (
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
    </>
  );
}

export default App;
