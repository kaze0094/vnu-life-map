import {defineConfig,globalIgnores} from 'eslint/config';
import next from 'eslint-config-next/core-web-vitals';
import ts from 'eslint-config-next/typescript';
export default defineConfig([
  ...next,
  ...ts,
  // Astryx reads descriptors statically and requires a literal default object.
  {files:['src/themes/**/*.doc.mjs'],rules:{'import/no-anonymous-default-export':['error',{allowObject:true}]}},
  globalIgnores(['.next/**','next-env.d.ts','**/.wrangler/**','work/**']),
]);
