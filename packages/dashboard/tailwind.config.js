// packages/dashboard/tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}", // Scansiona i file del frontend
		"../../packages/ui-components/**/*.{js,ts,jsx,tsx}", // Scansiona i file di ui-components
		"../../packages/core-logic/**/*.{js,ts,jsx,tsx}", // Scansiona i file di core-logic (se contengono classi)
	],
	theme: {
		extend: {},
	},
	plugins: [],
};
