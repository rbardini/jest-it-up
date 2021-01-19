const fs = require('fs')

const getData = require('../getData')

const configPath = './jest.config.js'

const reportContents = JSON.stringify({
  total: {
    branches: { pct: 80 },
    functions: { pct: 70 },
    lines: { pct: 60 },
    statements: { pct: 50 },
  },
})

jest.mock('fs')
jest.spyOn(process, 'cwd').mockImplementation(() => '/workingDir')

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

it('returns parsed config and report contents when no coverage directory is specified in the jest config', () => {
  const data = getData(configPath)

  expect(fs.readFileSync).toHaveBeenCalledTimes(1)
  expect(fs.readFileSync).toHaveBeenCalledWith(
    '/workingDir/coverage/coverage-summary.json',
    'utf8',
  )
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

it('returns parsed config and report contents when a custom coverage directory is specified in the jest config', () => {
  const config = require('../jest.config.js')
  const { coverageDirectory: defaultCovergeDirectory } = config
  config.coverageDirectory = 'custom/coverage/directory'
  const data = getData(configPath)

  expect(fs.readFileSync).toHaveBeenCalledTimes(1)
  expect(fs.readFileSync).toHaveBeenCalledWith(
    '/workingDir/custom/coverage/directory/coverage-summary.json',
    'utf8',
  )
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
  config.coverageDirectory = defaultCovergeDirectory
})
