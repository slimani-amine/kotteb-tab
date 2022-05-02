import { useState, useEffect } from 'react'

export const useLocalStorage = (key, initialValue) => {
	const jsonString = localStorage.getItem(key)

	const initialState = () => {
		if (jsonString !== null) return JSON.parse(jsonString)
		return initialValue
	}

	const [value, setValue] = useState(initialState)

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value))
	}, [key, value])

	return [value, setValue]
}
