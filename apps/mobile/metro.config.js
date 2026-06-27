// Metro config for an Expo app inside a monorepo.
// https://docs.expo.dev/guides/monorepos/
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// 1. Watch the whole monorepo so changes in packages/* are picked up.
config.watchFolders = [workspaceRoot];

// 2. Resolve modules from the app first, then fall back to the workspace root.
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// 3. Some installed packages are missing their `src/` folder (incomplete
// installs) but ship a built `lib/`. Prefer the compiled entry (`main`/`module`)
// over the `react-native`/source field so resolution doesn't fail on missing src.
config.resolver.resolverMainFields = ['main', 'module', 'react-native', 'browser'];

module.exports = config;
