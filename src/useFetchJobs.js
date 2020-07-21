import { useReducer, useEffect } from 'react'
import axios from 'axios'

const ACTIONS = {
	MAKE_REQUEST: 'make-request',
	GET_DATA: 'get-data',
	ERROR: 'error',
	UPDATE_HAS_NEXT_PAGE: 'update-has-next-page',
}

function reducer(state, action) {
	switch (action.type) {
		case ACTIONS.MAKE_REQUEST:
			return { loading: true, jobs: [] }
		case ACTIONS.GET_DATA:
			return { ...state, loading: false, jobs: action.payload.jobs }
		case ACTIONS.ERROR:
			return { ...state, loading: false, error: action.payload.error, jobs: [] }
		case ACTIONS.UPDATE_HAS_NEXT_PAGE:
			return { ...state, hasNextPage: action.payload.hasNextPage }
		default:
			return state
	}
}

// act as a proxy to solve CORS issue
const CORS_URL = `https://cors-anywhere.herokuapp.com`

const BASE_URL = `https://jobs.github.com/positions.json`

const URL = CORS_URL + `/` + BASE_URL

export default function useFetchJobs(params, page) {
	const [state, dispatch] = useReducer(reducer, {
		jobs: [],
		loading: true,
	})

	useEffect(() => {
		const cancelToken1 = axios.CancelToken.source()
		dispatch({ type: ACTIONS.MAKE_REQUEST })
		axios
			.get(URL, {
				cancelToken: cancelToken1.token,
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

		// send another request to check if nextpage exist
		const cancelToken2 = axios.CancelToken.source()
		axios
			.get(URL, {
				cancelToken: cancelToken2.token,
				params: { markdown: true, page: page + 1, ...params },
			})
			.then((res) => {
				dispatch({
					type: ACTIONS.UPDATE_HAS_NEXT_PAGE,
					payload: { hasNextPage: res.data.length !== 0 },
				})
			})
			.catch((e) => {
				// ignore cancel error, only check errors that occur not because of canceling
				if (axios.isCancel(e)) return
				dispatch({ type: ACTIONS.ERROR, payload: { error: e } })
			})

		return () => {
			cancelToken1.cancel()
			cancelToken2.cancel()
		}
	}, [params, page])

	return state
}
