import axios from 'axios'
import { Fragment, useEffect, useState } from 'react'

import { QUOTES_URL } from './../urls'

export const Quotes = () => {
	const [quote, setQuote] = useState()
	const [error, setError] = useState()

	async function getRandomQuotes() {
		try {
			const response = await axios.get(QUOTES_URL)
			setQuote(response.data)
		} catch (error) {
			setError(error)
		}
	}

	useEffect(() => {
		getRandomQuotes()
	}, [])
	return (
		<Fragment>
			{!error && (
				<p>
					{quote?.content} --{quote?.author}
				</p>
			)}
		</Fragment>
	)
}
