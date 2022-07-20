import { useLocalStorage } from '../Hooks'

import { RiFocus2Line } from '../Icons'

export const Focus = () => {
	const [focus, setFocus] = useLocalStorage('focusToday', '')

	return (
		<section className='flex'>
			<label
				htmlFor='focus-input'
				className= {`${focus ? 'border-0' : 'border-2 border-solid border-white '} bg-inherit w-11/12 h-fit mr-2 relative`}>
				{focus ? <div><p>Focus of the day: </p><p>{focus}</p></div> : (
					<input
					id='focus-input'
					className={`${focus && 'border-0'  } p-1 text-white w-full bg-inherit`}
					onKeyDown={(e) => e.code === "Enter" && ((e.target)as HTMLInputElement).value !== '' && setFocus(((e.target)as HTMLInputElement).value)}
					autoComplete='off'
					placeholder='Focus of the day'
				/>
				)}
				
			</label>

			<RiFocus2Line
				className='cursor-pointer'
				onClick={() => setFocus('')}
			/>
		</section>
	)
}
