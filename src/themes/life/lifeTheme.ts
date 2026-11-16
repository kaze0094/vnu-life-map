import {defineTheme} from '@astryxdesign/core/theme';
import {matchaTheme} from '@astryxdesign/theme-matcha/built';

// Preserve Matcha's semantic palette; use installed system fonts so Vietnamese
// copy remains readable without a third-party font request or font-loading shift.
export const lifeTheme = defineTheme({
  name: 'life',
  extends: matchaTheme,
  typography: {
    body: {family: 'system-ui', fallbacks: '-apple-system, "Segoe UI", Arial, sans-serif'},
    heading: {family: 'Georgia', fallbacks: '"Times New Roman", serif'},
    code: {family: 'monospace'},
  },
});
