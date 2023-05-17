const fs = require('fs')
require('ansi-colors').enabled = false

const getChanges = require('../getChanges')

console.warn = jest.fn()
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
  level2 = 'global',
  newThresholds = {
    branches: { diff: 70, next: 80, prev: 10 },
    functions: { diff: 50, next: 70, prev: 20 },
    lines: { diff: 30, next: 60, prev: 30 },
    statements: { diff: 10, next: 50, prev: 40 },
  },
) => ({ [level2]: newThresholds })

jest.mock('fs')

// Mock console.warn
jest.spyOn(console, 'warn').mockImplementation(() => {})
beforeEach(() => {
  console.warn.mockReset()
})

it('returns the original contents and no changes if no new thresholds', () => {
  const contents = getContents()
  const newThresholds = getNewThresholds('global', {})

  fs.readFileSync.mockReturnValue(contents)
  const { changes, data } = getChanges(configPath, newThresholds)

  expect(fs.readFileSync).toHaveBeenCalledTimes(1)
  expect(fs.readFileSync).toHaveBeenCalledWith(configPath, 'utf8')
  expect(changes).toStrictEqual([])
  expect(data).toBe(contents)
})

it('returns the new contents and changes if new thresholds', () => {
  const contents = getContents()
  const newThresholds = getNewThresholds()

  fs.readFileSync.mockReturnValue(contents)
  const { changes, data } = getChanges(configPath, newThresholds)

  expect(changes).toStrictEqual([
    'global branches    10 → 80    +70',
    'global functions   20 → 70    +50',
    'global lines       30 → 60    +30',
    'global statements  40 → 50    +10',
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
    const newThresholds = getNewThresholds(level2, {
      branches: { diff: 0, next: 10, prev: 10 },
      functions: { diff: 0, next: 20, prev: 20 },
      lines: { diff: 0, next: 30, prev: 30 },
      statements: { diff: 0, next: 40, prev: 40 },
    })

    fs.readFileSync.mockReturnValueOnce(contents)
    const { changes, data } = getChanges(configPath, newThresholds)

    expect(changes).toStrictEqual([])
    expect(data).toBe(contents)
  },
)

it('returns changes for an updated custom threshold', () => {
  fs.readFileSync.mockReturnValue(`
    module.exports = {
      coverageThreshold: {
        global: {
          branches: 0,
          functions: 0,
          lines: 0,
          statements: 0,
        },
        './src/modules/**/*.module.ts': {
          branches: 50,
          functions: 60,
          lines: 70,
          statements: 80,
        },
      },
    }
  `)

  const changes = getChanges('./jest.config.js', {
    './src/modules/**/*.module.ts': {
      branches: { prev: 50, next: 55, diff: 5 },
      functions: { prev: 60, next: 65, diff: 5 },
      lines: { prev: 70, next: 75, diff: 5 },
      statements: { prev: 80, next: 85, diff: 5 },
    },
  })

  expect(changes).toEqual({
    data: expect.any(String),
    changes: [
      './src/modules/**/*.module.ts branches    50 → 55     +5',
      './src/modules/**/*.module.ts functions   60 → 65     +5',
      './src/modules/**/*.module.ts lines       70 → 75     +5',
      './src/modules/**/*.module.ts statements  80 → 85     +5',
    ],
  })
})
