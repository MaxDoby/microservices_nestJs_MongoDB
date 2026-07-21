module.exports = {
  displayName: 'audit-service',
  preset: '../../../jest.preset.js',
  testEnvironment: 'node',
  coverageDirectory: '../../../coverage/apps/backend/audit-service',
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/schemas/**',
    '!src/**/test-fixtures/**',
  ],
};
