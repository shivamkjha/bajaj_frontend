import React, { useState } from "react";
import "./App.css";

function App() {
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState("");
  const [response, setResponse] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const parsedInput = JSON.parse(jsonInput);
      if (!parsedInput.data || !Array.isArray(parsedInput.data)) {
        setError('Invalid JSON format: "data" should be an array.');
        return;
      }

      setError("");

      const res = await fetch(
        "https://bajaj-backend-1-gj5b.onrender.com/bfhl",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(parsedInput),
        }
      );

      if (!res.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError("Invalid JSON format or API error.");
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setSelectedFilters(
      selectedFilters.includes(value)
        ? selectedFilters.filter((filter) => filter !== value)
        : [...selectedFilters, value]
    );
  };

  const renderFilteredResponse = () => {
    if (!response) return null;

    const filteredResponse = {};

    if (selectedFilters.includes("Numbers")) {
      filteredResponse.numbers = response.numbers;
    }
    if (selectedFilters.includes("Alphabets")) {
      filteredResponse.alphabets = response.alphabets;
    }
    if (selectedFilters.includes("Highest Lowercase Alphabet")) {
      filteredResponse.highest_lowercase_alphabet =
        response.highest_lowercase_alphabet;
    }

    return <pre>{JSON.stringify(filteredResponse, null, 2)}</pre>;
  };

  return (
    <div className="App">
      <h1>21BPS1333</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder="Enter JSON here..."
          rows="5"
        />
        <br />
        <button type="submit">Submit</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
      </form>

      {response && (
        <>
          <h2>Multi-Select Filter</h2>
          <div>
            <label>
              <input
                type="checkbox"
                value="Numbers"
                checked={selectedFilters.includes("Numbers")}
                onChange={handleFilterChange}
              />
              Numbers
            </label>
            <label>
              <input
                type="checkbox"
                value="Alphabets"
                checked={selectedFilters.includes("Alphabets")}
                onChange={handleFilterChange}
              />
              Alphabets
            </label>
            <label>
              <input
                type="checkbox"
                value="Highest Lowercase Alphabet"
                checked={selectedFilters.includes("Highest Lowercase Alphabet")}
                onChange={handleFilterChange}
              />
              Highest Lowercase Alphabet
            </label>
          </div>
          <h2>Filtered Response</h2>
          {renderFilteredResponse()}
        </>
      )}
    </div>
  );
}

export default App;
