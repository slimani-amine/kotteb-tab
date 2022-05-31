import { SVGProps } from 'react'


const TeenyiconsMenuSolid = (props: SVGProps<SVGSVGElement>) => {

	return (
		<svg width='1em' height='1em' viewBox='0 0 15 15' {...props}>
			<title>Toggle Menu</title>
			<path
				fill="white"
				fillRule='evenodd'
				d='M15 2H0V1h15v1Zm0 4H0V5h15v1Zm0 4H0V9h15v1Zm0 4H0v-1h15v1Z'
				clipRule='evenodd'></path>
		</svg>
	)
}

const MdiFountainPen = (props: SVGProps<SVGSVGElement>) => {


	return (
		<svg width='1em' height='1em' viewBox='0 0 24 24' {...props}>
			<title>Todo</title>
			<path
				fill="white"
				d='m6.95 14.93l4.24-5.66l8.49-7.07c.39-.39 1.04-.39 1.41 0l.71.71c.39.37.39 1.02 0 1.41l-7.07 8.49l-5.66 4.24l-2.12-2.12m1.41 2.83l-2.12-2.12l-2.83 1.41L2 21.29l2.12-2.12c.2-.17.51-.17.71 0c.17.2.17.51 0 .71L2.71 22l4.24-1.41l1.41-2.83Z'></path>
		</svg>
	)
}

const IcTwotoneAdd = (props: SVGProps<SVGSVGElement>) => {

	return (
		<svg width='1em' height='1em' viewBox='0 0 24 24' {...props}>
			<title>Reminders</title>
			<path
				fill="white"
				d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z'></path>
		</svg>
	)
}

const RiFocus2Line = (props: SVGProps<SVGSVGElement>) => {
	
	return (
		<svg
			width='2.5rem'
			height='2.5rem'
			viewBox='0 0 24 24'
			{...props}>
			<title>Clear Focus</title>
			<path
				fill='white'
				d='M12 20a8 8 0 1 0 0-16a8 8 0 0 0 0 16zm0 2C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10zm0-6a4 4 0 1 0 0-8a4 4 0 0 0 0 8zm0 2a6 6 0 1 1 0-12a6 6 0 0 1 0 12zm0-4a2 2 0 1 1 0-4a2 2 0 0 1 0 4z'></path>
		</svg>
	)
}

const IcTwotoneCheckCircle = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width='1.5rem'
			height='1.5rem'
			viewBox='0 0 24 24'
			{...props}>
			<title>Save</title>
			<path
				fill='white'
				d='M12 4c-4.41 0-8 3.59-8 8s3.59 8 8 8s8-3.59 8-8s-3.59-8-8-8zm-2 13l-4-4l1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z'
				opacity='.3'></path>
			<path
				fill='currentColor'
				d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4l8-8z'></path>
		</svg>
	)
}

const OouiTrash = (props: SVGProps<SVGSVGElement>) => {
	return (
		<svg
			width='1.5rem'
			height='1.5rem'
			viewBox='0 0 20 20'
			{...props}>
			<title>Remove</title>
			<path
				fill='white'
				d='M17 2h-3.5l-1-1h-5l-1 1H3v2h14zM4 17a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5H4z'></path>
		</svg>
	)
}


function MdiLightDelete(props: SVGProps<SVGSVGElement>) {
	return (
	  <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" {...props}><path fill="white" d="M18 19a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7H4V4h4.5l1-1h4l1 1H19v3h-1v12ZM6 7v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2V7H6Zm12-1V5h-4l-1-1h-3L9 5H5v1h13ZM8 9h1v10H8V9Zm6 0h1v10h-1V9Z"></path></svg>
	)
  }

export {
	OouiTrash,
	IcTwotoneCheckCircle,
	RiFocus2Line,
	IcTwotoneAdd,
	MdiFountainPen,
	TeenyiconsMenuSolid,
	MdiLightDelete,
}
