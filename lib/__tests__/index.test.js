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
  expect(getData).toHaveBeenCalledWith('/workingDir/jest.config.js', ['global'])

  expect(getNewThresholds).toHaveBeenCalledTimes(1)
  expect(getNewThresholds).toHaveBeenCalledWith(
    'thresholds',
    'coverages',
    0,
    0,
    ['global'],
  )

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
  expect(outputResult).toHaveBeenCalledWith('/workingDir/jest.config.js', false)
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
  expect(getNewThresholds).toHaveBeenCalledWith(
    'thresholds',
    'coverages',
    10,
    0,
    ['global'],
  )
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
      expect(outputResult).toHaveBeenCalledWith(
        '/workingDir/jest.config.js',
        false,
      )
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
  expect(outputResult).toHaveBeenCalledWith('/workingDir/jest.config.js', true)
})

it('runs with custom config', async () => {
  await jestItUp({ config: './customDir/jest.config.js' })

  expect(getData).toHaveBeenCalledTimes(1)
  expect(getData).toHaveBeenCalledWith('/workingDir/customDir/jest.config.js', [
    'global',
  ])
})

it('runs with custom tolerance', async () => {
  await jestItUp({ tolerance: 10 })

  expect(getNewThresholds).toHaveBeenCalledTimes(1)
  expect(getNewThresholds).toHaveBeenCalledWith(
    'thresholds',
    'coverages',
    0,
    10,
    ['global'],
  )
})
