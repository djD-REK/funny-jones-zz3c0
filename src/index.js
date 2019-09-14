import React, { useState, Fragment } from "react"
import ReactDOM from "react-dom"

import "./styles.css"

const axios = require("axios")

function App() {
  const [queryState, setQueryState] = useState("")
  const [resultsState, setResultsState] = useState([])
  const [errorState, setErrorState] = useState("")

  const searchHackerNews = function accessAPI(query) {
    const encodedURI = window.encodeURI(
      // relevance-ordered
      `https://hn.algolia.com/api/v1/search?query=${query}`
      // or: date-ordered
      // `https://hn.algolia.com/api/v1/search_by_date?query=${query}`
    )

    function handleError(error) {
      console.warn(error)
      setErrorState(error.toString())
      return null
    }

    // Example "hit" returned by HackerNews API:
    // Object {created_at: "2017-05-01T01:55:04.000Z",
    // title: "“A closure is a poor man’s object; an object is a poor man’s closure” (2003)",
    // url: "http://people.csail.mit.edu/gregs/ll1-discuss-archive-html/msg03277.html",
    // author: "noblethrasher", points: 289…}
    const formatHit = ({ created_at, title, url, author, points }) => (
      <li>
        <a href="{url}">{title}</a> by {author} ({points} points) on{" "}
        {// Make timestamp readable by converting
        // "2017-05-01T01:55:04.000Z" to
        // "2017-05-01 at 01:55:04"
        created_at.replace("T", " at ").replace(".000Z", "")}
      </li>
    )

    const updateResults = hits => {
      let completeResults = ""
      console.log(formatHit(hits[0]))
      //hits.map(hit => (completeResults += hit));
      //hits.reduce(completeResults, hit)
      setResultsState(formatHit(hits[0]))
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
      <p>{errorState}</p>
      <form>
        <input
          placeholder="Search for..."
          ref={input => setQueryState(input)}
          onChange={input => searchHackerNews(input)}
        />
        <ul>{resultsState}</ul>
      </form>
    </div>
  )
}

const rootElement = document.getElementById("root")
ReactDOM.render(<App />, rootElement)
