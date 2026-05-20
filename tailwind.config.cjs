module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    primary: '#0a0e1a',
                    secondary: '#131b2d',
                    tertiary: '#1b2640',
                },
                text: {
                    primary: '#ffffff',
                    secondary: '#94a3b8',
                    muted: '#64748b',
                },
                accent: {
                    blue: '#3b82f6',
                    'blue-hover': '#2563eb',
                    green: '#10b981',
                    purple: '#8b5cf6',
                    orange: '#f59e0b',
                    red: '#ef4444',
                }
            },
            fontFamily: {
                inter: ['Inter', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
