import axios from 'axios'

import { useEffect, useState } from 'react'

import { URL } from './urls'

import { v4 as uuid } from 'uuid'

import {
	TeenyiconsMenuSolid,
	MdiFountainPen,
	IcTwotoneAdd,
} from './Icons/Icons'

import { Loader } from './Components/Loader'

import { DateTime } from './Components/DateTime'

import { Weather } from './Components/Weather'

import { Quotes } from './Components/Quotes'

export default function App() {
	const [selectedImage, setSelectedImage] = useState(() =>
		JSON.parse(localStorage.getItem('selectedImage'))
	)
	const [nebulaImages, setNebulaImages] = useState()

	const [displayHeader, setDisplayHeader] = useState(true)

	const [loading, setLoading] = useState(false)

	localStorage.setItem('selectedImage', JSON.stringify(selectedImage))

	const imageURL = pageNo =>
		Boolean(pageNo) ? `${URL}&&page=${pageNo}&&per_page=${9}` : URL

	async function imageFetcher(pageNo) {
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

			setNebulaImages(fetchedImages)

			setLoading(true)

			setSelectedImage(fetchedImages[0])

			setTimeout(() => setLoading(false), 2000)
		}
	}

	const clickImgHandler = img => {
		if (img.id === selectedImage.id) {
			return null
		} else {
			setLoading(true)
			setSelectedImage(img)
			setTimeout(() => setLoading(false), 2000)
		}
	}

	useEffect(() => {
		getImages()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div className='grid bg-black font-mono'>
			{loading && <Loader />}
			<header
				className={`${
					Boolean(!displayHeader)
						? 'hidden'
						: 'grid grid-cols-10 gap-1 h-13vh order-1 mt-2'
				} `}>
				{nebulaImages?.map(img => (
					<button onClick={() => clickImgHandler(img)}>
						<img
							src={img.thumb}
							alt='header-imgs'
							loading='eager'
							className='aspect-square h-full w-full z-10 hover:scale-100'
						/>
					</button>
				))}
			</header>

			<main className='order-3'>
				<div className='grid children:row-span-full children:col-span-full'>
					<img
						src={selectedImage.full}
						alt='bg-img'
						loading='eager'
						className={`${
							Boolean(displayHeader) ? 'h-85vh' : 'h-100vh'
						} w-full `}
					/>
					<section className='flex'>
						<div className='self-end m-3 w-1/2'>
							<Weather />
							<DateTime />
						</div>
						<div className='flex flex-col items-end w-1/2 h-full'>
							<div>
								<TeenyiconsMenuSolid
									width='1.5rem'
									height='1.5rem'
									pathfill='white'
									className='mt-5 mr-5  cursor-pointer'
									onClick={() => setDisplayHeader(prev => !prev)}
								/>
								<IcTwotoneAdd
									width='1.5rem'
									height='1.5rem'
									pathfill='white'
									className='mt-5 mr-5  cursor-pointer'
								/>
								<MdiFountainPen
									width='1.5rem'
									height='1.5rem'
									pathfill='white'
									className='mt-5 mr-5  cursor-pointer'
								/>
							</div>
							<Quotes />
						</div>
					</section>
				</div>
			</main>

			<footer
				className={`${
					Boolean(displayHeader) ? 'order-2 h-1vh bg-black' : 'hidden'
				}`}></footer>
		</div>
	)
}
