import axios from 'axios'
import { useEffect, useState } from 'react'

import { QUOTES_URL } from './../urls'

export const Quotes = () => {
	const [quote, setQuote] = useState()

	async function getRandomQuotes() {
		try {
			const response = await axios.get(QUOTES_URL)
			setQuote(response.data)
		} catch (error) {
			console.log(error)
		}
	}

	useEffect(() => {
		getRandomQuotes()
	}, [])
	return (
		<p>
			{quote?.content} --{quote?.author}
		</p>
	)
}
