/**
 * hook uses:
 * @params - method, url(api), etc
 *
 * @returns response, loading and error state from the api
 *
 */

import axios from 'axios'

import { useState, useEffect } from 'react'

export const useAxios = params => {
	const { method, url } = params

	const [data, setData] = useState({
		response: undefined,
		loading: true,
		error: '',
	})

	async function action(params) {
		try {
			const res = await axios.request(params)
			setData(prev => ({ ...prev, response: res.data }))
		} catch (error) {
			console.log(error) //For future reference
			setData(prev => ({ ...prev, error: error }))
		} finally {
			setTimeout(
				() => setData(prev => ({ ...prev, loading: false })),
				1000
			)
		}
	}

	useEffect(() => {
		action(params)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [method, url])

	const { response, loading, error } = data

	return [response, loading, error]
}
