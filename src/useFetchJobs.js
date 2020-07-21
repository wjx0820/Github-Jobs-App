import { useReducer, useEffect } from 'react'
import axios from 'axios'

const ACTIONS = {
	MAKE_REQUEST: 'make-request',
	GET_DATA: 'get-data',
	ERROR: 'error',
}

function reducer(state, action) {
	switch (action.type) {
		case ACTIONS.MAKE_REQUEST:
			return { loading: true, jobs: [] }
		case ACTIONS.GET_DATA:
			return { ...state, loading: false, jobs: action.payload.jobs }
		case ACTIONS.ERROR:
			return { ...state, loading: false, error: action.payload.error, jobs: [] }
		default:
			return state
	}
}

// act as a proxy to solve CORS issue
const CORS_URL = `https://cors-anywhere.herokuapp.com`

const BASE_URL = `https://jobs.github.com/positions.json`

const URL = CORS_URL + `/` + BASE_URL

console.log(`URL`, URL)

export default function useFetchJobs(params, page) {
	const [state, dispatch] = useReducer(reducer, {
		jobs: [],
		loading: true,
	})

	useEffect(() => {
		const cancelToken = axios.CancelToken.source()
		dispatch({ type: ACTIONS.MAKE_REQUEST })
		axios
			.get(URL, {
				cancelToken: cancelToken.token,
				params: { markdown: true, page: page, ...params },
			})
			.then((res) => {
				dispatch({ type: ACTIONS.GET_DATA, payload: { jobs: res.data } })
			})
			.catch((e) => {
				// ignore cancel error, only check errors that occur not because of canceling
				if (axios.isCancel(e)) return
				dispatch({ type: ACTIONS.ERROR, payload: { error: e } })
			})

		return () => {
			cancelToken.cancel()
		}
	}, [params, page])

	return state
}
