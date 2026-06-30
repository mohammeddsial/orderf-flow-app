jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  Version: '0.0.0',
  constants: { reactNativeVersion: { major: 0, minor: 0, patch: 0 } },
  isPad: false,
  isTV: false,
  isTesting: true,
  select: (spec) => 'ios' in spec ? spec.ios : spec.default,
  default: {
    OS: 'ios',
    select: (spec) => 'ios' in spec ? spec.ios : spec.default,
  },
}));

jest.mock('react-native-safe-area-context', () => {
  const insets = { top: 0, bottom: 0, left: 0, right: 0 };
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }) =>
      React.createElement('View', null, children),
    SafeAreaView: ({ children, style }) =>
      React.createElement('View', { style }, children),
    useSafeAreaInsets: () => insets,
  };
});
