import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tsconfigPaths from "vite-tsconfig-paths";
import flowbiteReact from "flowbite-react/plugin/vite";

// Import built-in Node modules for path resolution
import path from "path";
import { fileURLToPath } from "url";

// Recreate __dirname and __filename for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  // Check if the current environment is production
  const isProduction = mode === "production";

  return {

    // Define the base path for the application
    // The app will be served at http://localhost:3000/route/
    // base: "/route/",

    plugins: [
      react(),
      tsconfigPaths(),
      flowbiteReact(),
    ],

    resolve: {
      alias: {
        // Standard alias for absolute imports using the recreated __dirname
        // "@": path.resolve(__dirname, "./src"),
      },
    },

    server: {
      port: 3000,
      host: "0.0.0.0",
      open: true, // Automatically opens the app in the browser
      cors: true, // Enables CORS for local development
    },

    build: {
      outDir: "dist",
      // Generate sourcemaps only in development
      sourcemap: !isProduction,
      chunkSizeWarningLimit: 500,
    },

    esbuild: {
      // Automatically remove console.log and debugger statements in production
      drop: isProduction ? ["console", "debugger"] : [],
    },
  };
});
