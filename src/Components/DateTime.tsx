import React from 'react'
import { useDateTime } from '../Hooks'

export const DateTime: React.FC = () => {
	const [dateNow, timeNow] = useDateTime()

	return (
		<div className='text-white'>
			<p className='text-xl ml-2'>
				{dateNow}, {timeNow}
			</p>
		</div>
	)
}
