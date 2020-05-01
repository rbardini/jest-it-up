const applyChanges = require('../applyChanges')
const getChanges = require('../getChanges')
const getData = require('../getData')
const getNewThresholds = require('../getNewThresholds')
const outputResults = require('../outputResults')

const jestItUp = require('..')

jest.spyOn(process, 'cwd').mockImplementation(() => '/workingDir')

jest.mock('../applyChanges')
jest.mock('../getChanges', () =>
  jest.fn(() => ({ changes: 'changes', data: 'data' })),
)
jest.mock('../getData', () =>
  jest.fn(() => ({
    thresholds: 'thresholds',
    coverages: 'coverages',
  })),
)
jest.mock('../getNewThresholds', () => jest.fn(() => 'newThresholds'))
jest.mock('../outputResults')

it('runs with with default options', () => {
  jestItUp()

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith(
    '/workingDir/jest.config.js',
    '/workingDir/coverage/coverage-summary.json',
  )

  expect(getNewThresholds).toHaveBeenCalledTimes(1)
  expect(getNewThresholds).toHaveBeenCalledWith('thresholds', 'coverages', 0)

  expect(getChanges).toHaveBeenCalledTimes(1)
  expect(getChanges).toHaveBeenCalledWith(
    '/workingDir/jest.config.js',
    'newThresholds',
  )

  expect(applyChanges).toHaveBeenCalledTimes(1)
  expect(applyChanges).toHaveBeenCalledWith(
    '/workingDir/jest.config.js',
    'changes',
    'data',
  )

  expect(outputResults).toHaveBeenCalledTimes(1)
  expect(outputResults).toHaveBeenCalledWith('changes', false)
})

it('runs with custom margin', () => {
  jestItUp({ margin: 10 })

  expect(getNewThresholds).toHaveBeenCalledTimes(1)
  expect(getNewThresholds).toHaveBeenCalledWith('thresholds', 'coverages', 10)
})

it('runs in silent mode', () => {
  jestItUp({ silent: true })

  expect(outputResults).not.toHaveBeenCalled()
})

it('runs in dry-run mode', () => {
  jestItUp({ dryRun: true })

  expect(applyChanges).not.toHaveBeenCalled()

  expect(outputResults).toHaveBeenCalledTimes(1)
  expect(outputResults).toHaveBeenCalledWith('changes', true)
})
