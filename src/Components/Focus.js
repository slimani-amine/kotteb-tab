import { useState } from 'react'

import {
	RiFocus2Line,
	IcTwotoneCheckCircle,
	OouiTrash,
} from '../Icons'

export const Focus = () => {
	const [focus, setFocus] = useState(() =>
		localStorage.getItem('focusToday')
	)

	const [readOnly, setReadOnly] = useState(Boolean(focus))

	const toggleStorage = () => {
		if (readOnly) {
			localStorage.setItem('focusToday', '')
			setFocus('')
			setReadOnly(false)
		} else {
			if (focus.length < 1) return
			localStorage.setItem('focusToday', focus)
			setReadOnly(true)
		}
	}

	return (
		<section className='flex'>
			<div className='bg-inherit w-11/12 h-fit mb-2 mr-2 border-2 border-solid border-white relative'>
				{!readOnly ? (
					<label htmlFor='focus-input'>
						<input
							id='focus-input'
							className='p-1 text-white w-full bg-inherit '
							value={focus === null ? '' : focus}
							onChange={e => setFocus(e.target.value)}
							autoComplete='off'
							placeholder='Focus of the day'
						/>
					</label>
				) : (
					<p className='p-1 text-white w-full bg-inherit'>{focus}</p>
				)}

				<button
					className='block absolute left-[93%] top-[10%]'
					onClick={toggleStorage}>
					{!readOnly ? <IcTwotoneCheckCircle /> : <OouiTrash />}
				</button>
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
