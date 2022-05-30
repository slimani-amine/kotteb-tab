import { useState, useEffect } from 'react'
// TypeScript guesses we return an array of mixed types, 
// not specific types for each index in the array so we use 
// tuples here and add type annotation to the return type
export const useLocalStorage = (key: string, initialValue?:string): [string, React.Dispatch<React.SetStateAction<string>>] => {
	const jsonString = localStorage.getItem(key)

	const initialState = () => {
		if (jsonString !== null) return JSON.parse(jsonString)
		return initialValue
	}

	const [value, setValue] = useState<string>(initialState)

	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(value))
	}, [key, value])

	return [value, setValue] 
}
