import { useState, useEffect } from 'react'

/**
 * hook uses geoLocation of user
 *
 * @returns current latitude and longitude
 *
 */
// interface GeoLocation{
// 	latitude: string,
// 	longitude: string,
// }


export const useGeoLocation = () => {
	const [geoArea, setGeoArea] = useState({
		latitude: '',
		longitude: '',
	})

	useEffect(
		() =>
			navigator.geolocation.getCurrentPosition(pos =>
				setGeoArea({
					latitude: pos.coords.latitude.toFixed(2),
					longitude: pos.coords.longitude.toFixed(2),
				})
			),
		[]
	)

	const { latitude, longitude } = geoArea

	return { latitude, longitude }
}
