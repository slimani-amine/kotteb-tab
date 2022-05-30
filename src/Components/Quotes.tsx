import { useAxios } from '../Hooks'

import { Fragment } from 'react'

import { QUOTES_URL } from '../Urls/index'

// interface QuoteType{
// 	content: string,
// 	author: string,
// }

// interface Quote{
// 	quote: QuoteType,
// 	loading: Boolean,
// 	error: strin
// }

export const Quotes = () => {
	const [quote, loading, error] = useAxios({
		method: 'get',
		url: QUOTES_URL,
	})

	return (
		<Fragment>
			{Boolean(!error && !loading) && (
				<p>
					{quote?.content} --{quote?.author}
				</p>
			)}
		</Fragment>
	)
}
