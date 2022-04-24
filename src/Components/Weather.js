import axios from 'axios'

import { useGeoLocation } from '../Hooks/useGeoLocation'

import { useEffect, useState } from 'react'

export const Weather = () => {
	const { REACT_APP_WEATHER_KEY } = process.env

	const [weatherData, setWeatherData] = useState()

	const [error, setError] = useState()

	const { latitude, longitude } = useGeoLocation()

	const WHEATHER_API = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${REACT_APP_WEATHER_KEY}`

	async function getWeatherData() {
		try {
			const response = await axios.get(WHEATHER_API)
			setWeatherData(response.data)
		} catch (error) {
			setError(error)
		}
	}

	console.log(weatherData)

	useEffect(() => {
		getWeatherData()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [latitude, longitude])

	return (
		<section className='text-white ml-2'>
			{Boolean(weatherData && !error) && (
				<div className='text-xl'>
					<span>
						{weatherData.weather.map(data => (
							<>
								<img
									src={`http://openweathermap.org/img/wn/${data.icon}.png`}
									alt={data.description}
									className='inline'
								/>
								<span>...{data.description} </span>
							</>
						))}
					</span>
					<span>{weatherData.name}, </span>
					<span>
						{(weatherData.main.temp - 273.15).toFixed(2)}°C{' '}
					</span>
					{/* <img className='in' alt={weatherData.}/> */}
				</div>
			)}
		</section>
	)
}
