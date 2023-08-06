/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			boxShadow: {
				card: '3px 4px 0px 1px'
			}
		}
	},
	plugins: []
}
