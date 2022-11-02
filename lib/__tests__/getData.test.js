const fs = require('fs')
const path = require('path')

const getData = require('../getData')

const configPath = './jest.config.js'
const coverageThreshold = {
  global: {
    branches: 10,
    functions: 20,
    lines: 30,
    statements: 40,
  },
}
const reportContents = JSON.stringify({
  total: {
    branches: { pct: 80 },
    functions: { pct: 70 },
    lines: { pct: 60 },
    statements: { pct: 50 },
  },
})

jest.mock('fs')
jest.spyOn(path, 'dirname').mockImplementation(() => '/workingDir')

beforeAll(() => fs.readFileSync.mockReturnValue(reportContents))
beforeEach(() => jest.resetModules())

it('returns parsed config and report contents', async () => {
  jest.mock('../jest.config.js', () => ({ coverageThreshold }), {
    virtual: true,
  })

  const data = await getData(configPath)

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

it('returns parsed async config and report contents', async () => {
  jest.mock('../jest.config.js', () => async () => ({ coverageThreshold }), {
    virtual: true,
  })

  const data = await getData(configPath)

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

it('returns parsed config and report contents when a custom coverage directory is specified in the jest config', async () => {
  jest.mock(
    '../jest.config.js',
    () => ({
      coverageThreshold,
      coverageDirectory: 'custom/coverage/directory',
    }),
    { virtual: true },
  )

  const data = await getData(configPath)

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
})
