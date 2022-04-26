import { Fragment } from 'react'

import { useAxios, useGeoLocation } from '../Hooks'

import { WEATHER_API } from '../Urls/index'

export const Weather = () => {
	const { REACT_APP_WEATHER_KEY } = process.env

	const { latitude, longitude } = useGeoLocation()

	const SUPER_WEATHER_API = `${WEATHER_API}?lat=${latitude}&lon=${longitude}&appid=${REACT_APP_WEATHER_KEY}`

	const [weatherData, loading, weatherError] = useAxios({
		method: 'get',
		url: SUPER_WEATHER_API,
	})

	return (
		<section className='text-white ml-2'>
			{Boolean(weatherData && !weatherError && !loading) && (
				<div className='text-xl'>
					<Fragment>
						{weatherData.weather.map((data, idx) => (
							<Fragment>
								<img
									src={`http://openweathermap.org/img/wn/${data.icon}.png`}
									alt={data.description}
									className='inline'
									key={idx}
								/>
								<span>...{data.description} </span>
							</Fragment>
						))}
					</Fragment>
					<span>{weatherData.name}, </span>
					<span>
						{(weatherData.main.temp - 273.15).toFixed(2)}°C{' '}
					</span>
				</div>
			)}
		</section>
	)
}
