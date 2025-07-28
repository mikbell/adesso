import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
	plugins: [
		react(),
		tailwindcss({
			content: [
				"./index.html",
				"./src/**/*.{js,ts,jsx,tsx}",
				"../ui-components/src/**/*.{js,ts,jsx,tsx}",
				"../core-logic/src/**/*.{js,ts,jsx,tsx}",
			],
		}),
	],

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@ui": path.resolve(__dirname, "../ui-components/src"),
		},
	},
});
