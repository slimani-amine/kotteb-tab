/**
 * hook uses:
 * @params - method, url(api), etc
 *
 * @returns response, loading and error state from the api
 *
 */

import axios, {Method, AxiosError} from 'axios'

import { useState, useEffect } from 'react'

interface props {
	method : Method;
	url: string;
}

interface axiosState{
	response?:object|undefined;
	loading?: Boolean;
	error?: AxiosError|undefined|unknown;
}

export const useAxios = ({ method, url } : props) : [response?: object, loading?: Boolean, error?: object|unknown]=> {
	const [data, setData] = useState<axiosState>({
		response: undefined,
		loading: true,
		error: undefined,
	})

	async function action({ method, url }: props) {
		try {
			const res = await axios.request({ method, url })
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
		action({ method, url })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [method, url])

	const { response, loading, error } = data

	return [response, loading, error]
}
