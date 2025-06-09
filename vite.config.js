// vite.config.js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [tailwindcss()],

	build: {
		lib: {
			entry: "src/sonix-player.js",
			name: "SonixPlayer",
			fileName: (format) => `sonix-player.${format}.js`,
			formats: ["es", "umd"],
		},

		rollupOptions: {
			external: ["ionicons"],
			output: {
				globals: {
					ionicons: "ionicons",
				},
				assetFileNames: (assetInfo) => {
					if (assetInfo.name === "sonix-player.css") return "sonix-player.css";
					return assetInfo.name;
				},
			},
		},
	},
});
