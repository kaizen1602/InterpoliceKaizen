import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
  
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        otra: resolve(__dirname, "otra.html"),
        /*  contact: resolve(__dirname, "contact.html"), */
      },
    },
  },

  server: {
    port: 8080,
  },

  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: [
          "import",
          "mixed-decls",
          "color-functions",
          "global-builtin",
        ],
      },
    },
  },
});