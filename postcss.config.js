export default {
  plugins: {
    'postcss-preset-env': {
      features: {
        'custom-properties': false,
        'custom-selectors': false,
      },
      preserve: true,
      enableClientSidePolyfills: true,
      browsers: ['Chrome >= 87', 'Safari >= 14'],
    },
  },
}
