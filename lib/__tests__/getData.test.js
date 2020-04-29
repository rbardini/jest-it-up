const fs = require('fs')

const getData = require('../getData')

const configPath = './jest.config.js'
const reportPath = './coverage/coverage-summary.json'

const reportContents = JSON.stringify({
  total: {
    branches: { pct: 80 },
    functions: { pct: 70 },
    lines: { pct: 60 },
    statements: { pct: 50 },
  },
})

jest.mock('fs')

jest.mock(
  '../jest.config.js',
  () => ({
    coverageThreshold: {
      global: {
        branches: 10,
        functions: 20,
        lines: 30,
        statements: 40,
      },
    },
  }),
  { virtual: true },
)

beforeAll(() => {
  fs.readFileSync.mockReturnValue(reportContents)
})

it('returns parsed config and report contents', () => {
  const data = getData(configPath, reportPath)

  expect(fs.readFileSync).toHaveBeenCalledTimes(1)
  expect(fs.readFileSync).toHaveBeenCalledWith(reportPath, 'utf8')
  expect(data).toStrictEqual({
    coverages: {
      branches: { pct: 80 },
      functions: { pct: 70 },
      lines: { pct: 60 },
      statements: { pct: 50 },
    },
    thresholds: {
      branches: 10,
      functions: 20,
      lines: 30,
      statements: 40,
    },
  })
})
