import { useEffect, useState } from 'react'

import axios from 'axios'

import { URL } from './urls'

import { v4 as uuid } from 'uuid'

export default function App() {
	const [selectedImage, setSelectedImage] = useState(() =>
		JSON.parse(localStorage.getItem('selectedImage'))
	)
	const [nebulaImages, setNebulaImages] = useState()

	localStorage.setItem('selectedImage', JSON.stringify(selectedImage))

	const imageURL = pageNo =>
		Boolean(pageNo) ? `${URL}&&page=${pageNo}&&per_page=${9}` : URL

	async function imageFetcher(pageNo) {
		console.log(pageNo, imageURL(pageNo))
		const response = await axios.get(imageURL(pageNo))
		const data = await response.data.results

		const results = data.map(img => ({
			...img.urls,
			id: uuid(),
		}))
		return results
	}

	async function getImages() {
		if (selectedImage) {
			const pageNo = Math.floor(Math.random() * 200) + 1
			const fetchedImages = await imageFetcher(pageNo)
			setNebulaImages([selectedImage, ...fetchedImages])
		} else {
			const fetchedImages = await imageFetcher(false)

			console.log(fetchedImages[0])

			setNebulaImages(fetchedImages)

			localStorage.setItem(
				'selectedImage',
				JSON.stringify(fetchedImages[0])
			)
		}
	}

	useEffect(() => {
		getImages()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	console.log(selectedImage)
	return (
		<div className='grid bg-black '>
			<header className='grid grid-cols-10 gap-1 h-14vh order-1'>
				{nebulaImages?.map(img => (
					<button onClick={() => setSelectedImage(img)}>
						<img
							src={img.thumb}
							alt={img.thumb}
							loading='eager'
							className='aspect-square h-full w-full'
						/>
					</button>
				))}
			</header>
			<main className='order-3'>
				<div className='grid children:row-span-full children:col-span-full'>
					<img
						src={selectedImage.regular}
						alt='bg-img'
						className='h-85vh w-full'
					/>
				</div>
			</main>
			<footer className='order-2 h-1vh bg-black'></footer>
		</div>
	)
}
