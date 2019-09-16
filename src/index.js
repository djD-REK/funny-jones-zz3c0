import React, { useState, Fragment } from "react"
import ReactDOM from "react-dom"

import "./styles.css"

const axios = require("axios")

function App() {
  const [queries, setQueries] = useState("")
  const [results, setResults] = useState([])
  const [errors, setErrors] = useState("")

  // Example "hit" returned by HackerNews API:
  // Object {created_at: "2017-05-01T01:55:04.000Z",
  // title: "“A closure is a poor man’s object; an object is a poor man’s closure” (2003)",
  // url: "http://people.csail.mit.edu/gregs/ll1-discuss-archive-html/msg03277.html",
  // author: "noblethrasher", points: 289…}
  const Hit = ({ created_at, title, url, author, points }) => (
    <li>
      <a href="{url}">{title}</a> by {author} ({points} points) on{" "}
      {// Make timestamp readable by converting
      // "2017-05-01T01:55:04.000Z" to
      // "2017-05-01 at 01:55:04"
      created_at.replace("T", " at ").replace(".000Z", "")}
    </li>
  )

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
      setResults(hits)
    }

    const resultsFromAPI = axios
      .get(encodedURI)
      .then(({ data }) => {
        updateResults(data.hits)
      })
      .catch(handleError)
  }

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <p>{errors}</p>
      <form>
        <input
          placeholder="Search for..."
          ref={input => setQueries(input)}
          onChange={input => searchHackerNews(input)}
        />
        <ul class="searchResults">
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

const rootElement = document.getElementById("root")
ReactDOM.render(<App />, rootElement)
