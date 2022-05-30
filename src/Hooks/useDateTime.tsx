import { useState, useEffect } from 'react'

/**
 * hook uses Date object
 *
 * @returns date(long format) and time(12hrs Format including seconds)
 *
 */

export function useDateTime() {
	const event: Date = new Date()

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

	const [date, setDate] = useState <string[]>(newDate)

	useEffect(() => {
		const timer = setInterval(() => setDate(newDate), 1000)
		return () => clearInterval(timer)
	})

	const [day, time] = date

	return [day, time]
}
