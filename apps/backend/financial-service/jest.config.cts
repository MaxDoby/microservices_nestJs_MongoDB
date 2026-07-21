module.exports = {
  displayName: 'financial-service',
  preset: '../../../jest.preset.js',
  coverageDirectory: '../../../coverage/apps/backend/financial-service',
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/src/test-setup.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts',
    '!src/test-setup.ts',
    '!src/**/*.module.ts',
    '!src/**/schemas/**',
  ],
};
