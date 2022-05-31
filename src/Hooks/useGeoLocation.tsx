import { useState, useEffect } from 'react'

/**
 * hook uses geoLocation of user
 *
 * @returns current latitude and longitude
 *
 */
interface GeoLocation {
	latitude: string  | number;
	longitude: string | number;
}


export const useGeoLocation = () => {
	const [geoArea, setGeoArea] = useState<GeoLocation>({
		latitude: 0,
		longitude: 0,
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
