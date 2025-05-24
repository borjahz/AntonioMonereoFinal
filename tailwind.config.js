/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./public/**/*.html", 
  "./src/**/*.{js,css}",
    // si más adelante añades carpetas con componentes, añádelas aquí:
    // "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // aquí puedes añadir personalizaciones:
      // colors: { 'brand-blue': '#1fb6ff' },
      // fontSize: { 'xxs': '0.65rem' },
      fontFamily: {
        // Asigna Comfortaa a la familia sans por defecto
        sans: ['Comfortaa', 'cursive'],
      },
    },
  },
  plugins: [
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
  // darkMode: 'class', // descoméntalo si quieres soporte de modo oscuro
}
