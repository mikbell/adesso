// adesso-main/tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		// Aggiungi i percorsi a tutti i tuoi file che usano classi Tailwind
		"./packages/frontend/index.html",
		"./packages/frontend/src/**/*.{js,ts,jsx,tsx}",
		"./packages/dashboard/index.html",
		"./packages/dashboard/src/**/*.{js,ts,jsx,tsx}",
		"./packages/ui-components/src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
