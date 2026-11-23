import { defineConfig } from 'rolldown';
import { dts } from 'rolldown-plugin-dts';

export default defineConfig({
  input: 'src/index.ts',
  plugins: [
    dts({
      generator: 'oxc',
      dtsOnly: true,
      sourcemap: true,
    }),
  ],
  output: {
    dir: 'dist',
    format: 'es',
  },
});
