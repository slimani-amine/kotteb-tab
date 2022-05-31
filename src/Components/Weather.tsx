import { Fragment } from 'react'

import { useAxios, useGeoLocation } from '../Hooks'

import { WEATHER_API } from '../Urls/index'


interface WeatherData {
	weather?: [{
		icon?: string;
		description?: string;
	}];
	name?: string;
	main:{
		temp: number;
	}
}

export const Weather: React.FC = () => {
	const { REACT_APP_WEATHER_KEY } = process.env

	const { latitude, longitude } = useGeoLocation()

	const SUPER_WEATHER_API = `${WEATHER_API}?lat=${latitude}&lon=${longitude}&appid=${REACT_APP_WEATHER_KEY}`

	const [response, loading, weatherError] = useAxios({
		method: 'get',
		url: SUPER_WEATHER_API,
	})

	const weatherData = response as WeatherData


	return (
		<section className='text-white ml-2'>
			{Boolean(weatherData && !weatherError && !loading) && (
				<div className='text-xl'>
					<Fragment>
						{weatherData?.weather?.map((data, idx) => (
							<Fragment key={idx}>
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
					<span>{weatherData?.name}, </span>
					<span>
						{(weatherData?.main?.temp - 273.15).toFixed(2)}°C{' '}
					</span>
				</div>
			)}
		</section>
	)
}
