import React, { useState } from 'react'
import useFetchJobs from './useFetchJobs'
import { Container, Spinner } from 'react-bootstrap'
import Job from './components/Job'
import JobsPagination from './components/JobsPagination'
import SearchForm from './components/SearchForm'

function App() {
	const [params, setParams] = useState({})
	const [page, setPage] = useState(1)
	const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page)

	function handleParamChange(e) {
		const param = e.target.name
		const value = e.target.value
		setPage(1)
		setParams((prevParams) => {
			return { ...prevParams, [param]: value }
		})
	}

	return (
		<Container className="my-4">
			<h1 className="mb-4">GitHub Jobs</h1>
			<SearchForm params={params} onParamChange={handleParamChange} />
			{!loading && (
				<JobsPagination
					page={page}
					setPage={setPage}
					hasNextPage={hasNextPage}
				/>
			)}
			{loading && <Spinner animation="border" />}
			{error && <h1>Error. Try Refreshing.</h1>}
			{jobs.map((job) => {
				return <Job key={job.id} job={job} />
			})}
			{!loading && (
				<JobsPagination
					page={page}
					setPage={setPage}
					hasNextPage={hasNextPage}
				/>
			)}
		</Container>
	)
}

export default App
