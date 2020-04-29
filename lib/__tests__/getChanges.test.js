const fs = require('fs')
require('ansi-colors').enabled = false

const getChanges = require('../getChanges')

const configPath = './jest.config.js'
const getContents = (
  level1 = 'coverageThreshold',
  level2 = 'global',
) => `module.exports = {
  ${level1}: {
    ${level2}: {
      branches: 10,
      functions: 20,
      lines: 30,
      statements: 40,
    },
  },
}`
const getNewThresholds = (
  newThresholds = {
    branches: { diff: 70, next: 80, prev: 10 },
    functions: { diff: 50, next: 70, prev: 20 },
    lines: { diff: 30, next: 60, prev: 30 },
    statements: { diff: 10, next: 50, prev: 40 },
  },
) => newThresholds

jest.mock('fs')

it('returns the original contents and no changes if no new thresholds', () => {
  const contents = getContents()
  const newThresholds = getNewThresholds({})

  fs.readFileSync.mockReturnValue(contents)
  const { changes, data } = getChanges(configPath, newThresholds)

  expect(fs.readFileSync).toHaveBeenCalledTimes(1)
  expect(fs.readFileSync).toHaveBeenCalledWith(configPath, 'utf8')
  expect(changes).toStrictEqual([])
  expect(data).toMatchInlineSnapshot(`
    "module.exports = {
      coverageThreshold: {
        global: {
          branches: 10,
          functions: 20,
          lines: 30,
          statements: 40,
        },
      },
    }"
  `)
  expect(data).toBe(contents)
})

it('returns the new contents and changes if new thresholds', () => {
  const contents = getContents()
  const newThresholds = getNewThresholds()

  fs.readFileSync.mockReturnValue(contents)
  const { changes, data } = getChanges(configPath, newThresholds)

  expect(changes).toStrictEqual([
    'branches    10 → 80    +70',
    'functions   20 → 70    +50',
    'lines       30 → 60    +30',
    'statements  40 → 50    +10',
  ])
  expect(data).toMatchInlineSnapshot(`
    "module.exports = {
      coverageThreshold: {
        global: {
          branches: 80,
          functions: 70,
          lines: 60,
          statements: 50,
        },
      },
    }"
  `)
  expect(data).not.toBe(contents)
})

it.each([
  ['level1', undefined],
  [undefined, 'level2'],
  ['level1', 'level2'],
])(
  'returns the original contents and no changes if no matches #%#',
  (level1, level2) => {
    const contents = getContents(level1, level2)
    const newThresholds = getNewThresholds()

    fs.readFileSync.mockReturnValueOnce(contents)
    const { changes, data } = getChanges(configPath, newThresholds)

    expect(changes).toStrictEqual([])
    expect(data).toBe(contents)
  },
)
