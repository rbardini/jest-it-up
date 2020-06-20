const confirm = require('@inquirer/confirm')

const applyChanges = require('../applyChanges')
const getChanges = require('../getChanges')
const getData = require('../getData')
const getNewThresholds = require('../getNewThresholds')
const outputChanges = require('../outputChanges')
const outputResult = require('../outputResult')

const jestItUp = require('..')

jest.spyOn(process, 'cwd').mockImplementation(() => '/workingDir')

jest.mock('@inquirer/confirm')

jest.mock('../applyChanges')
jest.mock('../getChanges', () =>
  jest.fn(() => ({ changes: ['changes'], data: 'data' })),
)
jest.mock('../getData', () =>
  jest.fn(() => ({
    thresholds: 'thresholds',
    coverages: 'coverages',
  })),
)
jest.mock('../getNewThresholds', () => jest.fn(() => 'newThresholds'))
jest.mock('../outputChanges')
jest.mock('../outputResult')

it('runs with with default options', async () => {
  await jestItUp()

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

  expect(outputChanges).toHaveBeenCalledTimes(1)
  expect(outputChanges).toHaveBeenCalledWith(['changes'], false)

  expect(applyChanges).toHaveBeenCalledTimes(1)
  expect(applyChanges).toHaveBeenCalledWith(
    '/workingDir/jest.config.js',
    'data',
  )

  expect(outputResult).toHaveBeenCalledTimes(1)
  expect(outputResult).toHaveBeenCalledWith(false)
})

it('returns early if there are no changes', async () => {
  getChanges.mockReturnValueOnce({ changes: [] })

  await jestItUp()

  expect(outputChanges).toHaveBeenCalledTimes(1)
  expect(outputChanges).toHaveBeenCalledWith([], false)

  expect(applyChanges).not.toHaveBeenCalled()
  expect(outputResult).not.toHaveBeenCalled()
})

it('runs with custom margin', async () => {
  await jestItUp({ margin: 10 })

  expect(getNewThresholds).toHaveBeenCalledTimes(1)
  expect(getNewThresholds).toHaveBeenCalledWith('thresholds', 'coverages', 10)
})

it.each([true, false])(
  'runs in interactive mode with %p confirmation',
  async confirmed => {
    confirm.mockResolvedValueOnce(confirmed)

    await jestItUp({ interactive: true })

    if (confirmed) {
      expect(applyChanges).toHaveBeenCalledTimes(1)
      expect(applyChanges).toHaveBeenCalledWith(
        '/workingDir/jest.config.js',
        'data',
      )

      expect(outputResult).toHaveBeenCalledTimes(1)
      expect(outputResult).toHaveBeenCalledWith(false)
    } else {
      expect(applyChanges).not.toHaveBeenCalled()
      expect(outputResult).not.toHaveBeenCalled()
    }
  },
)

it('runs in silent mode', async () => {
  await jestItUp({ silent: true })

  expect(outputChanges).not.toHaveBeenCalled()
})

it('runs in dry-run mode', async () => {
  await jestItUp({ dryRun: true })

  expect(outputChanges).toHaveBeenCalledTimes(1)
  expect(outputChanges).toHaveBeenCalledWith(['changes'], true)

  expect(applyChanges).not.toHaveBeenCalled()

  expect(outputResult).toHaveBeenCalledTimes(1)
  expect(outputResult).toHaveBeenCalledWith(true)
})
