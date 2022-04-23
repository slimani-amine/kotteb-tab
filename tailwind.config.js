module.exports = {
	content: ['./src/**/*.{js,jsx,ts,tsx}'],
	theme: {
		extend: {
			height: {
				'14vh': '14vh',
				'85vh': '85vh',
				'1vh': '1vh',
			},
		},
	},
	plugins: [
		function ({ addVariant }) {
			addVariant('children', '& > *')
		},
	],
}
