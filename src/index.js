import React, { useState } from "react"
import { createStore } from "redux"
import ReactDOM from "react-dom"
import SearchField from "react-search-field"

import { Provider, connect, useSelector, useDispatch } from "react-redux"

import "./styles.css"

const axios = require("axios")

function rootReducer(state = [], query) {
  return state.concat(query)
}

function App() {
  // React Hooks declarations
  const [queries, setQueries] = useState("")
  const [results, setResults] = useState([])
  const [errors, setErrors] = useState("")
  const [searches, setSearches] = useState([])

  // React-Redux section
  const reduxSearches = useSelector(state => state.queries)
  const dispatch = useDispatch(query => query)

  /**
   * A hit returned by HackerNews API:
   * @typedef {Component} Hit
   * @property {string} created_at Timestamp in format "2017-05-01T01:55:04.000Z"
   * @property {string} title
   * @property {string} url
   * @property {string} author
   * @property {integer} points
   */

  const Hit = ({ created_at, title, url, author, points }) => (
    <li>
      <a href="{url}">{title}</a> by {author} ({points} points) on{" "}
      {// Make timestamp readable by converting
      // "2017-05-01T01:55:04.000Z" to
      // "2017-05-01 at 01:55:04"
      created_at.replace("T", " at ").replace(".000Z", "")}
    </li>
  )

  const Search = ({ query }) => <li>{query}</li>

  const searchHackerNews = function accessAPI(query) {
    const encodedURI = window.encodeURI(
      // relevance-ordered
      `https://hn.algolia.com/api/v1/search?query=${query}`
      // or: date-ordered
      // `https://hn.algolia.com/api/v1/search_by_date?query=${query}`
    )

    function handleError(error) {
      console.warn(error)
      setErrors(error.toString())
      return null
    }

    const updateResults = hits => {
      // Update results state:
      setResults(hits)
    }

    const resultsFromAPI = axios
      .get(encodedURI)
      .then(({ data }) => {
        updateResults(data.hits)
      })
      .catch(handleError)
  }

  const handleClick = input => {
    searchHackerNews(input)

    // Save search term state to React Hooks
    setSearches(searches.concat(input))

    // Save search term state using Redux
    dispatch({ type: "ADD_SEARCH" })
  }

  return (
    <div className="App">
      <h1>HackerNews API React / Redux Example</h1>
      <p>{errors}</p>
      <h2>Previous searches: (React Hooks)</h2>
      {searches.map((query, i) => (
        <Search
          query={query}
          // Prevent duplicate keys by appending index:
          key={query + i}
        />
      ))}
      <h2>Previous searches: (Redux)</h2>
      {useSelector(state => state).map((query, i) => (
        <Search
          query={query[0]}
          // Prevent duplicate keys by appending index:
          key={query + i}
        />
      ))}
      <form>
        <SearchField
          placeholder="Search for..."
          classNames="search-field"
          onEnter={handleClick}
          onSearchClick={handleClick}
        />
        <ul className="searchResults">
          {results.map((hit, i) => (
            <Hit
              // HackerNews search hit returns 5 elements
              created_at={hit.created_at}
              title={hit.title}
              url={hit.url}
              author={hit.author}
              points={hit.points}
              // Prevent duplicate keys by appending index:
              key={hit.title + i}
            />
          ))}
        </ul>
      </form>
    </div>
  )
}

export default connect()(App)

const rootElement = document.getElementById("root")

// Create store for Redux
const store = createStore(rootReducer)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
)
