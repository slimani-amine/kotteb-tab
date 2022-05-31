import { Fragment, useState } from 'react'
import { MdiFountainPen } from '../Icons'

export const Todos = () => {
	const [openModal, setOpenModal] = useState<Boolean>(false)
	return (
		<div className='flex flex-row self-end w-full h-full justify-between'>
			<Fragment>
				{openModal && (
					<div className='w-full bg-white h-full mt-5'>Heelo</div>
				)}
			</Fragment>
			<MdiFountainPen
				width='1.5rem'
				height='1.5rem'
				className='mt-5 mr-5 cursor-pointer '
				onClick={() => setOpenModal(true)}
			/>
		</div>
	)
}
