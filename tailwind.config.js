/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				accent: "var(--color-accent)",
				primary: "var(--color-primary)",
				secondary: "var(--color-secondary)",
			},
		},
	},
	plugins: [],
};
