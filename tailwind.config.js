module.exports = {
    darkMode: "media",
    purge: ['./src/pages/**/*.{js,ts,jsx,tsx}', './src/components/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            outline: {
                blue: 'var(--color-outline)',
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
            // button: "var(--color-button-text)",
            transparent: "transparent",
            secondary: "var(--color-secondary)",
            primary: "var(--color-primary)",
            red: {
                100: "var(--color-red-100)",
                200: "var(--color-red-200)",
                300: "var(--color-red-300)",
                400: "var(--color-red-400)",
                600: "var(--color-red-600)"
            },
            black: {
                600: '#000000'
            },
            blue: {
                100: "var(--color-blue-100)",
                600: "var(--color-blue-600)"
            },
            accent: {
                DEFAULT: "var(--color-accent)",
                hover: "var(--color-accent-hover)",
                disabled: "var(--color-accent-disabled)",
                muted: "var(--color-accent-muted)"
            },
        },
        spacing: {
            1: "5px",
            2: "10px",
            3: "15px",
            4: "20px",
            5: "30px",
            6: "40px",
            7: "60px",
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
