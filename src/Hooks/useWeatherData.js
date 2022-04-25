/**
 * hook uses geoLocation hook and weather api
 *
 * @returns weatherdata of the current location
 *
 */

import axios from 'axios'

import { useGeoLocation } from '../Hooks'

import { useEffect, useState } from 'react'

export const useWeatherData = () => {
	const { REACT_APP_WEATHER_KEY } = process.env

	const [weatherData, setWeatherData] = useState()

	const [weatherError, setError] = useState()

	const { latitude, longitude } = useGeoLocation()

	const WHEATHER_API = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${REACT_APP_WEATHER_KEY}`

	async function getWeatherData() {
		try {
			const response = await axios.get(WHEATHER_API)

			setWeatherData(response.data)
		} catch (error) {
			setError(weatherError)
		}
	}

	useEffect(() => {
		getWeatherData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [latitude, longitude])

	return [weatherData, weatherError]
}
