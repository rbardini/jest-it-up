module.exports = {
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ['lib/*.js'],
  coverageReporters: [
    'json-summary',
    'lcovonly',
    ['text', { skipFull: true }],
    'text-summary',
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
  testEnvironment: 'node',
}
