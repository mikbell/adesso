import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [
		react(),
		tailwindcss({
			content: [
				"./index.html",
				"./src/**/*.{js,ts,jsx,tsx}",
				"../../packages/ui-components/**/*.{js,ts,jsx,tsx}",
				"../../packages/core-logic/**/*.{js,ts,jsx,tsx}",
			],
		}),
	],
});
