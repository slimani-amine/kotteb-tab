import { useState, useEffect } from 'react'

export function useDateTime() {
	const event = new Date()

	const today = event
		.toLocaleDateString('en-us', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
		.split(',')
		.join('')

	const timeNow = event.toLocaleTimeString('en-us')

	const newDate = [today, timeNow]

	const [date, setDate] = useState(newDate)

	useEffect(() => {
		const timer = setInterval(() => setDate(newDate), 1000)
		return () => clearInterval(timer)
	})

	return { date }
}
