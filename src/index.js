import React, { useState } from "react"
import ReactDOM from "react-dom"

import "./styles.css"

function App() {
  // React Hooks declarations
  const [searches, setSearches] = useState([])
  const [query, setQuery] = useState("")

  const handleClick = () => {
    // Add the search term to the list onClick of Search button
    // (Actually searching would require an API call here)

    // Save search term state to React Hooks
    setSearches(searches => [...searches, query]) // setSearches(searches.concat(query))
    // setSearches(searches.concat(query))
  }

  const updateQuery = ({ target }) => {
    // Update query onKeyPress of input box
    setQuery(target.value)
  }

  const keyPressed = ({ key }) => {
    // Capture search on Enter key
    if (key === "Enter") {
      handleClick()
    }
  }

  const submitHandler = e => {
    // Prevent form submission on Enter key
    e.preventDefault()
  }

  const Search = ({ query }) => <li>{query}</li>

  return (
    <div className="App">
      <h1>Add an item to an array in React State</h1>
      <h2>Previous searches: (React Hooks)</h2>
      <ul className="previousSearch">
        {searches.map((query, i) => (
          <Search
            query={query}
            // Prevent duplicate keys by appending index:
            key={query + i}
          />
        ))}
      </ul>

      <div className="break" />

      <form onSubmit={submitHandler}>
        <div>
          <input
            className="search-field-input"
            placeholder="Search for..."
            type="text"
            onChange={updateQuery}
            onKeyPress={keyPressed}
          />
          <button
            className="search-field-button"
            type="button"
            onClick={handleClick}
          >
            Search
          </button>
        </div>
      </form>
    </div>
  )
}

export default App

const rootElement = document.getElementById("root")

ReactDOM.render(<App />, rootElement)
