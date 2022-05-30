import { useLocalStorage } from '../Hooks'

import { RiFocus2Line } from '../Icons'

export const Focus = () => {
	const [focus, setFocus] = useLocalStorage('focusToday', '')

	return (
		<section className='flex'>
			<label
				htmlFor='focus-input'
				className='bg-inherit w-11/12 h-fit mb-2 mr-2 border-2 border-solid border-white relative'>
				<input
					id='focus-input'
					className='p-1 text-white w-full bg-inherit'
					value={focus}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFocus(e.target.value)}
					autoComplete='off'
					placeholder='Focus of the day'
				/>
			</label>

			<RiFocus2Line
				className='cursor-pointer'
				onClick={() => setFocus('')}
			/>
		</section>
	)
}
