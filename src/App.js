import { useAxios, useLocalStorage } from './Hooks'

import { useEffect, useState } from 'react'

import { UNSPLASH_API } from './Urls/index'

import { v4 as uuid } from 'uuid'

import { TeenyiconsMenuSolid } from './Icons'

import {
	Loader,
	DateTime,
	Weather,
	Quotes,
	Reminders,
	Todos,
	Focus,
} from './Components'

export default function App() {
	const [selectedImage, setSelectedImage] = useLocalStorage(
		'selectedImage',
		''
	)
	const [nebulaImages, setNebulaImages] = useState([])

	const [displayHeader, setDisplayHeader] = useState(true)

	const [response, loading, error] = useAxios({
		method: 'get',
		url: UNSPLASH_API,
	})

	useEffect(() => {
		const fetchedImages = response?.results?.map(img => ({
			...img.urls,
			id: uuid(),
		}))

		if (!selectedImage) {
			setSelectedImage(fetchedImages?.[0])
		}

		setNebulaImages(fetchedImages)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [response])

	const clickImgHandler = img => {
		if (img.id === selectedImage.id) {
			return null
		}

		setSelectedImage(img)

		const remaningImages = nebulaImages.filter(
			images => images.id !== img.id
		)

		setNebulaImages([img, ...remaningImages])
	}

	return (
		<div className='grid bg-black font-mono'>
			{!error && loading && <Loader />}

			<header
				className={`${
					Boolean(!displayHeader)
						? 'hidden'
						: 'grid grid-cols-10 gap-1 h-13vh order-1 mt-2'
				} `}>
				{nebulaImages?.map((img, idx) => (
					<button key={idx} onClick={() => clickImgHandler(img)}>
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
						src={selectedImage?.regular}
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

								<Reminders />

								<Todos />
							</div>

							<div className='text-white text-xl mt-auto mr-2 self-end mb-4 grid'>
								<Focus />

								<Quotes />
							</div>
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
