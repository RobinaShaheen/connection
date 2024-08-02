import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        'watch': '480px', // Extra small devices (e.g. mobile phones)
        'mobile': '640px', // Small devices (e.g. mobile phones)
        'tablet': '768px', // Medium devices (e.g. tablets)
        'laptop': '1024px', // Large devices (e.g. laptops)
        'desktop': '1280px', // Extra large devices (e.g. desktops)
        'LED': '1536px', // 2x large devices
      },
    },
  },
  plugins: [],
};
export default config;
