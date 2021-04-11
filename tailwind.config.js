module.exports = {
    darkMode: "media",
    purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            outline: {
                blue: 'var(--color-outline)',
            },
            zIndex: {
                '-10': '-10',
            }
        },
        fontFamily: {
            sans: [
                "Inter",
                "-apple-system",
                "BlinkMacSystemFont",
                "Segoe UI",
                "Roboto",
                "Helvetica",
                "Arial",
                "sans-serif",
            ],
            // mono: ["Menlo", "Monaco", "Courier New", "monospace"],
        },
        colors: {
            transparent: "transparent",
            secondary: "var(--color-secondary)",
            primary: "var(--color-primary)",
            white: "#ffffff",
            red: {
                100: "var(--color-red-100)",
                200: "var(--color-red-200)",
                300: "var(--color-red-300)",
                400: "var(--color-red-400)",
                600: "var(--color-red-600)",
                700: "var(--color-red-700)",
                800: "var(--color-red-800)"
            },
            grey: {
                100: "var(--color-grey-100)",
                200: "var(--color-grey-200)",
                300: "var(--color-grey-300)",
                400: "var(--color-grey-400)",
                600: "var(--color-grey-600)",
                700: "var(--color-grey-700)",
                800: "var(--color-grey-800)"
            },
            black: {
                100: "var(--color-black-100)",
                200: "var(--color-black-200)",
                300: "var(--color-black-300)",
                400: "var(--color-black-400)",
                600: "var(--color-black-600)",
                700: "var(--color-black-700)",
                800: "var(--color-black-800)"
            },
            blue: {
                100: "var(--color-blue-100)",
                200: "var(--color-blue-200)",
                300: "var(--color-blue-300)",
                400: "var(--color-blue-400)",
                500: "var(--color-blue-500)",
                600: "var(--color-blue-600)",
                700: "var(--color-blue-700)",
                800: "var(--color-blue-800)"
            },
            muted: 'var(--color-grey-300)',
            accent: {
                DEFAULT: "var(--color-accent)",
                hover: "var(--color-accent-hover)",
                disabled: "var(--color-accent-disabled)",
                muted: "var(--color-accent-muted)"
            },
        },
    },
    variants: {
        backgroundColor: ({ after }) => after(["disabled"]),
        textColor: ({ after }) => after(["disabled"]),
        extend: {
            opacity: ['disabled'],
        }
    },
    plugins: [
        require('@tailwindcss/forms')
    ],
};
