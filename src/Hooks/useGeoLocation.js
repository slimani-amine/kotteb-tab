import { useState, useEffect } from 'react'

/**
 * hook uses geoLocation of user
 *
 * @returns current latitude and longitude
 *
 */

export const useGeoLocation = () => {
	const [geoArea, setGeoArea] = useState({
		latitude: 0,
		longitude: 0,
	})

	useEffect(
		() =>
			navigator.geolocation.getCurrentPosition(pos =>
				setGeoArea({
					latitude: pos.coords.latitude,
					longitude: pos.coords.longitude,
				})
			),
		[]
	)

	const { latitude, longitude } = geoArea

	return { latitude, longitude }
}
