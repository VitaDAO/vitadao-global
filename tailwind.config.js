/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      "vita-yellow": "#ffdd35",
      "vita-purple": "#6256ec",
      black: "#000000",
      white: "#ffffff",
      gray: {
        200: "#f8f8f8",
        400: "#f1f1f1",
        600: "#cdcdcd",
        800: "#a4a4a4",
      },
      "tag-yellow": "#fff9ae",
      "tag-turquoise": "#41f4d4",
      "tag-sky": "#95e5ff",
      "tag-pink": "#fec0e8",
    },
    fontSize: {
      sm: ["0.875rem", { lineHeight: "1.225rem" }],
      base: ["1rem", { lineHeight: "1.5rem" }],
      lg: ["1.5rem", { lineHeight: "1.75rem" }],
      // TODO Change hn denomination to t-shirt sizes for better separation of
      // concerns and less confusion
      h4: ["1.5rem", { lineHeight: "1.8rem", letterSpacing: "-0.015rem" }],
      h3: ["2rem", { lineHeight: "2.4rem", letterSpacing: "-0.02rem" }],
      h2: ["2.5rem", { lineHeight: "3rem", letterSpacing: "-0.025rem" }],
      h1: ["4rem", { lineHeight: "4.4rem", letterSpacing: "-0.08rem" }],
    },
    fontFamily: {
      "tt-hoves": "TT Hoves, sans-serif",
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          hover: "hsl(var(--primary-hover))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
          hover: "hsl(var(--secondary-hover))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        marquee: {
          from: { translate: "0" },
          to: { translate: "-50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/container-queries"),
  ],
};
