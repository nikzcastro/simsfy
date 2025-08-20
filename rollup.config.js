export default {
  input: 'src/index.js',  // Seu arquivo de entrada principal
  output: {
    file: 'dist/bundle.js',
    format: 'cjs', // Ou 'esm', 'iife', etc., dependendo do seu caso
  },
  plugins: [
    postcss({
      // Configurações opcionais do PostCSS
      extract: true, // Extrai CSS para um arquivo separado
      minimize: true, // Minimiza o CSS
    }),
    // Outros plugins que você possa estar usando
  ]
};
