/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        `./src/components/**/*.{vue,js,ts}`,
        `./src/layouts/**/*.vue`,
        `./src/pages/**/*.vue`,
        `./src/locales/**/*.js`,
        `./src/composables/**/*.{js,ts}`,
        `./src/plugins/**/*.{js,ts}`,
        `./src/utils/**/*.{js,ts}`,
        `./src/App.{js,ts,vue}`,
        `./src/app.{js,ts,vue}`,
        `./src/Error.{js,ts,vue}`,
        `./src/error.{js,ts,vue}`,
        `./src/app.config.{js,ts}`,
    ],
    darkMode: "media", // or 'class'
    theme: {
        extend: {
            colors: {
                "cl-main": {
                    300: "#024CDC",
                    400: "#013AAA",
                    500: "#012977",
                    600: "#012262",
                    700: "#011c51",
                },

                "cl-blue-shade": {
                    500: "#65B9FF",
                },

                "cl-light-blue-shade": {
                    400: "#EDF7FF",
                    500: "#E3F2FF",
                },

                "cl-text": {
                    500: "#161616",
                },

                "cl-accent": {
                    500: "#FFDA89",
                },

                "cl-gray": {
                    500: "#F6F8FA",
                },

                "cl-passive-text": {
                    500: "#6C6C6C",
                },

                "cl-red": {
                    500: "#EA4335",
                },
            },

            fontSize: {
                "size_10/16": ["0.625rem", { lineHeight: "1.2" }],
                "size_11/16": ["0.6875rem", { lineHeight: "1.2" }],
                "size_12/16": ["0.75rem", { lineHeight: "1.2" }],
                "size_13/16": ["0.8125rem", { lineHeight: "1.2" }],
                "size_14/16": ["0.875rem", { lineHeight: "1.2" }],
                "size_15/16": ["0.9375rem", { lineHeight: "1.2" }],
                size_base: ["1rem", { lineHeight: "1.2rem" }],
                "size_17/16": ["1.0625rem", { lineHeight: "1.2" }],
                "size_18/16": ["1.125rem", { lineHeight: "1.2" }],
                "size_19/16": ["1.1875rem", { lineHeight: "1.2" }],
                "size_20/16": ["1.25rem", { lineHeight: "1.2" }],
                "size_22/16": ["1.375rem", { lineHeight: "1.2" }],
                "size_24/16": ["1.5rem", { lineHeight: "1.2" }],
                "size_26/16": ["1.625rem", { lineHeight: "1.2" }],
                "size_28/16": ["1.75rem", { lineHeight: "1.2" }],
                "size_30/16": ["1.875rem", { lineHeight: "1.2" }],
                "size_32/16": ["2rem", { lineHeight: "1.2" }],
                "size_34/16": ["2.125rem", { lineHeight: "1.2" }],

                h1: ["3.5rem", { lineHeight: "1.3", letterSpacing: "-0.011em" }],
                h2: ["2.5rem", { lineHeight: "1.3", letterSpacing: "-0.011em" }],
                h3: ["2rem", { lineHeight: "1.5", letterSpacing: "-0.011em" }],
                h4: ["1.75rem", { lineHeight: "1.3" }],
                h5: ["1.625rem", { lineHeight: "1.3" }],
                s1: ["1.5rem", { lineHeight: "1.3", letterSpacing: "-0.011em" }],
                s2: ["1.375rem", { lineHeight: "1.3", letterSpacing: "-0.011em" }],
                b1: ["1.25rem", { lineHeight: "1.5", letterSpacing: "-0.011em" }],
                "b1-semibold": ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.011em" }],
                b2: ["1.125rem", { lineHeight: "1.5", letterSpacing: "-0.011em" }],
                "b2-medium": ["1.125rem", { lineHeight: "1.4", letterSpacing: "-0.011em" }],
                b3: ["1rem", { lineHeight: "1.4", letterSpacing: "-0.011em" }],
            },

            opacity: {
                ...(() => {
                    const map = {};
                    for (let i = 0; i <= 100; i += 5) {
                        map[i] = Number(i / 100).toFixed(2);
                    }
                    return map;
                })(),
            },

            screens: {
                "sm--6": "320px",
                "sm--5": "360px",
                "sm--4": "400px",
                "sm--3": "480px",
                "sm--2": "540px",
                "sm--1": "600px",
                sm: "640px",
                "md--2": "680px",
                "md--1": "720px",
                md: "768px",
                "lg--1": "960px",
                lg: "1024px",
                xl: "1125px",
                "2xl": "1280px",
                "3xl": "1366px",
                "4xl": "1440px",
                "5xl": "1536px",
                "6xl": "1680px",
                "7xl": "1792px",
                "full-hd": "1920px",
            },

            boxShadow: {
                "c-menu-button": "0px 2px 8px 0px #0000001A",
            },

            spacing: {
                px: "1px",
                ...(() => {
                    const max = 200;
                    const spacing = {};
                    const step = 0.5;
                    const ratio = 0.25;
                    const length = max / step;

                    for (let i = 0; i <= length; i++) {
                        spacing[step * i] = `${step * i * ratio}rem`;
                    }

                    return spacing;
                })(),
            },

            zIndex: {
                auto: "auto",
                ...(() => {
                    const map = {};
                    for (let i = 0; i <= 100; i++) {
                        map[i] = `${i}`;
                    }
                    return map;
                })(),
            },

            backgroundImage: {
                "c-blur":
                    "radial-gradient(ellipse closest-side at 50% 50%,rgba(101, 185, 255, 0.4) 0%,rgba(255, 255, 255, 0) 100%)",
            },
        },
    },
    plugins: [
        function ({ addBase, theme }) {
            const toBeExposedColorKeys = [
                "cl-main",
                "cl-darker-green",
                "cl-dark-green",
                "cl-green-overlay",
                "cl-text-color",
                "cl-green-stroke",
                "cl-green-stroke-passive",
                "cl-gray-stroke",
                "cl-green-gradient-1",
                "cl-green-gradient-2",
            ];
            function extractColorVars(colorObj, colorGroup = "") {
                return Object.keys(colorObj).reduce((vars, colorKey) => {
                    const value = colorObj[colorKey];
                    const newVars =
                        typeof value === "string"
                            ? { [`--color${colorGroup}-${colorKey}`]: value }
                            : extractColorVars(value, `-${colorKey}`);
                    return { ...vars, ...newVars };
                }, {});
            }
            const customColors = Object.entries(theme("colors"))
                .filter(([key]) => toBeExposedColorKeys.includes(key))
                .reduce((acc, [key, value]) => {
                    acc[key] = value;
                    return acc;
                }, {});
            addBase({
                ":root": extractColorVars(customColors),
            });
        },
    ],
};
