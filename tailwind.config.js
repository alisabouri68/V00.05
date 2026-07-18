const flowbiteReact = require("flowbite-react/plugin/tailwindcss");
 import { rthmThemePlugin } from "./src/THME/config.ts";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx,json}",
    ".flowbite-react\\class-list.json",
    "./node_modules/primereact/**/*.{js,ts,jsx,tsx}",
  ],
  important: false,
  darkMode: "class",
  theme: {},
  plugins: [
    require("flowbite/plugin"),
    require("tailwind-scrollbar"),
    flowbiteReact,
    rthmThemePlugin
    // custom theme plugin
    // require("./src/THME/config.ts"),
  ],
};
