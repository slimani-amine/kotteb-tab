module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			height: {
				'13vh': '13vh',
				'85vh': '85vh',
				'1vh': '1vh',
				'100vh': '100vh',
			},
			width: {
				'100vw': '100vw',
			},
		},
	},
	plugins: [
		function ({ addVariant }) {
			addVariant('children', '& > *')
		},
	],
}
