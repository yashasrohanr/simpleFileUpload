import React, { useState } from "react";

const SearchFiles = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/search?query=${query}`);
      const data = await response.json();

      if (response.ok) {
        setResults(data);
      } else {
        setError(data.message || "Something went wrong");
      }
    } catch (err) {
      setError("Failed to fetch results");
    }

    setLoading(false);
  };

  return (
    <div>
      <h2>Search Files</h2>
      <input
        type="text"
        placeholder="Enter file name..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {results.map((file, index) => (
          <li key={index}>
            {file._name} ({file.storageType})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchFiles;
