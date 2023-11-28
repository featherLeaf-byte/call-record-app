import { useState } from 'react'
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from '@nextui-org/react'
function Home({ calls }) {
  const [array, setArray] = useState(calls)
  const [search, setSearch] = useState('')
  const [result, setResult] = useState([])
  const columns = [
    'Call ID',
    'Agent',
    'Call Duration',
    'Call Silent Time',
    'Team',
    'QA score',
  ]
  function DownloadToCSV() {
    let csv = 'id,agent,audio_length,team, qa score' + '\n'
    array.forEach((element) => {
      csv =
        csv +
        element.id +
        ',' +
        element.agent +
        ',' +
        element.audio_length +
        ',' +
        element.team +
        ',' +
        element.qa +
        '\n'
    })
    const url = window.URL.createObjectURL(new Blob([csv]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `calls.csv`)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  }
  function handleSearchInput(event) {
    setSearch(event.target.value)
  }
  function handleReset() {
    setArray(calls)
    setResult([])
  }
  function handleSearch() {
    const resultItems = []
    array.forEach((element) => {
      if (element.agent.toLowerCase() === search.toLowerCase()) {
        resultItems.push(element)
      }
    })
    if (resultItems != undefined) {
      setResult(resultItems)
    }
  }
  function sortAscendingOutput() {
    setArray(
      [...array].sort((a, b) => {
        let fa = a.agent.toLowerCase(),
          fb = b.agent.toLowerCase()

        if (fa < fb) {
          return -1
        }
        if (fa > fb) {
          return 1
        }
        return 0
      })
    )
  }
  function sortDescendingOutput() {
    setArray(
      [...array].sort((a, b) => {
        let fa = a.agent.toLowerCase(),
          fb = b.agent.toLowerCase()

        if (fa > fb) {
          return -1
        }
        if (fa < fb) {
          return 1
        }
        return 0
      })
    )
  }
  return (
    <>
      <div>
        <div class="card">
          <div class="card-header">Work Trial Assignment</div>
          <div class="card-body">
            <h5 class="card-title">Call Record Application</h5>
            <p class="card-text">
              Nextjs Web-application that fetches data from a local json-server.
              Allows for searching, sorting and exporting data.
            </p>
          </div>
        </div>
        <div className="m-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            onChange={handleSearchInput}
          />
          <div className="btn-section">
            <button className="btn btn-primary mt-3" onClick={handleSearch}>
              Search
            </button>
            <button className="btn btn-success mt-3" onClick={DownloadToCSV}>
              Download CSV
            </button>
          </div>
        </div>
        <button className="btn btn-secondary m-3" onClick={sortAscendingOutput}>
          Sort Ascending
        </button>
        <button
          className="btn btn-secondary m-3"
          onClick={sortDescendingOutput}
        >
          Sort Descending
        </button>
        <div>
          <SearchResultsComponents result={result} columns={columns} />
        </div>
        <TableComponent
          columns={columns}
          array={array}
          handleSearch={handleSearch}
          DownloadToCSV={DownloadToCSV}
          sortAscendingOutput={sortAscendingOutput}
          sortDescendingOutput={sortDescendingOutput}
          handleSearchInput={handleSearchInput}
          handleReset={handleReset}
        />
      </div>
    </>
  )
}
export default Home
export async function getStaticProps() {
  const url = 'http://localhost:4000/calls'
  const response = await fetch(url)
  const calls = await response.json()
  return {
    props: { calls: calls },
  }
}
function TableComponent({ columns, array, handleReset }) {
  return (
    <div>
      <Table
        aria-label="Example table with dynamic content"
        className="table table-dark table-striped"
      >
        <TableHeader>
          {columns.map((column, index) => {
            return <TableColumn key={index}>{column}</TableColumn>
          })}
        </TableHeader>
        <TableBody>
          {array.map((call) => (
            <TableRow key={call.id}>
              <TableCell>{call.id}</TableCell>
              <TableCell>{call.agent}</TableCell>
              <TableCell>{call.audio_length}</TableCell>
              <TableCell>silent time</TableCell>
              <TableCell>{call.team}</TableCell>
              <TableCell>{call.qa}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="m-3">
        <button className="btn btn-danger" onClick={handleReset}>
          Reset
        </button>
      </div>
    </div>
  )
}
function SearchResultsComponents({ result, columns }) {
  return (
    <div className="m-3">
      {result.map((element, index) => {
        return (
          <div key={index} className="mb-3">
            <div>
              <strong>{columns[0]}</strong>:&nbsp;{element.id}
            </div>
            <div>
              <strong>{columns[1]}</strong>:&nbsp;{element.agent}
            </div>
            <div>
              <strong>{columns[2]}</strong>:&nbsp;{element.audio_length}
            </div>
            <div>
              <strong>{columns[3]}</strong>:&nbsp;{element.team}
            </div>
            <div>
              <strong>{columns[4]}</strong>:&nbsp;{element.qa}
            </div>
          </div>
        )
      })}
    </div>
  )
}
