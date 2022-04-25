import { useWeatherData } from '../Hooks'

export const Weather = () => {
	const [weatherData, weatherError] = useWeatherData()

	return (
		<section className='text-white ml-2'>
			{Boolean(weatherData && !weatherError) && (
				<div className='text-xl'>
					<span>
						{weatherData.weather.map((data, idx) => (
							<>
								<img
									src={`http://openweathermap.org/img/wn/${data.icon}.png`}
									alt={data.description}
									className='inline'
									key={idx}
								/>
								<span>...{data.description} </span>
							</>
						))}
					</span>
					<span>{weatherData.name}, </span>
					<span>
						{(weatherData.main.temp - 273.15).toFixed(2)}°C{' '}
					</span>
				</div>
			)}
		</section>
	)
}
