/** @type {import('jest').Config} */
module.exports = {
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.js' }],
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@react-native-async-storage|@expo|expo-.*|react-native-reanimated|react-native-gesture-handler|react-native-screens|react-native-safe-area-context|react-native-web|react-native-worklets)/)',
  ],
  moduleNameMapper: {
    '^@multi-restaurant/database$': '<rootDir>/../../packages/database/src/index.ts',
    '^@expo/vector-icons$': '<rootDir>/__mocks__/@expo/vector-icons.js',
    '^react-native-reanimated$': '<rootDir>/node_modules/react-native-reanimated/lib/module/index.js',
  },
  setupFiles: [
    '<rootDir>/../../node_modules/react-native/jest/setup.js',
    '<rootDir>/jest.setup.js',
  ],
};
