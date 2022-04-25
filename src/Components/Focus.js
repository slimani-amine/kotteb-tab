import { useState } from 'react'
import {
	RiFocus2Line,
	IcTwotoneCheckCircle,
	OouiTrash,
} from './../Icons/Icons'

export const Focus = () => {
	const [focus, setFocus] = useState(() =>
		localStorage.getItem('focusToday')
	)

	const [readOnly, setReadOnly] = useState(Boolean(focus))

	const addToStorage = () => {
		if (focus.length < 1) return
		localStorage.setItem('focusToday', focus)
		setReadOnly(true)
	}

	const removeFromStorage = () => {
		localStorage.setItem('focusToday', '')
		setFocus('')
		setReadOnly(false)
	}
	return (
		<section className='flex'>
			<div className='bg-inherit w-11/12 h-fit mb-2 mr-2 border-2 border-solid border-white relative'>
				{!readOnly ? (
					<label htmlFor='focus-input'>
						<input
							id='focus-input'
							className='p-1 text-white w-full bg-inherit '
							value={focus}
							onChange={e => setFocus(e.target.value)}
							autoComplete='off'
							placeholder='Focus of the day'
						/>
					</label>
				) : (
					<p className='p-1 text-white w-full bg-inherit'>{focus}</p>
				)}

				{/* Make a single BTN IF POSSIBLE,  */}
				{/* Problem: e.target.value doesnt work (no text inside btn) and there are 2 seperate func */}

				{!readOnly ? (
					<button
						className='absolute left-[93%] top-[0%]'
						value='delete-focus'
						onClick={addToStorage}>
						<IcTwotoneCheckCircle
							className='inline-block'
							width='1.5rem'
							height='1.5rem'
							pathfill='dark'
						/>
					</button>
				) : (
					<button
						className='absolute left-[93%] top-[0%]'
						value='delete-focus'
						onClick={removeFromStorage}>
						<OouiTrash
							className='inline-block'
							width='1.5rem'
							height='1.5rem'
							pathfill='white'
						/>
					</button>
				)}
			</div>

			<RiFocus2Line
				width='2.5rem'
				height='2.5rem'
				pathfill='white'
				className='cursor-pointer'
			/>
		</section>
	)
}
