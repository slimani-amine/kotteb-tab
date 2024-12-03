import { Fragment } from 'react';
import { useAxios } from '../Hooks'
import { QUOTES_URL } from '../Urls/index'

interface QuoteType{
	q: string;
	a: string;
}

export const Quotes = () => {

	const [quote, loading, error] = useAxios({
		method: 'get',
		url: QUOTES_URL,
	})

	const myquote= quote as QuoteType
	
	return (
		<Fragment>
			{Boolean(!error && !loading) && (
				<p>
					{myquote?.q} --{myquote?.a}
				</p>
			)}
		</Fragment>
	)
}
