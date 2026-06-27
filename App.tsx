// Entry shim. Expo's default entry (node_modules/expo/AppEntry.js) does
// `import App from '../../App'`. In this monorepo `expo` is hoisted to the repo
// root, so that path resolves to THIS file. We simply re-export the real app so
// the bundle works whether Expo uses index.js or the default AppEntry.
export { default } from './apps/mobile/src/App';
