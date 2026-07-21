import baseConfig from '../../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: ['src/**/*.e2e.spec.ts'],
    rules: {
      '@nx/enforce-module-boundaries': 'off',
    },
  },
];
