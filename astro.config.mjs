// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

export default defineConfig({
  site: "https://tipsypastels.github.io",
  base: "/beta",

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});